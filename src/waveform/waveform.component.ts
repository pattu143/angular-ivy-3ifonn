import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
// import { WaveService } from 'angular-wavesurfer-service';
declare const WaveSurfer;
// import WaveSurfer from 'wavesurfer.js';
import { BASE_URL } from '../app/music.data';
import { PlayerService } from '../services/player.service';

export interface Music {
  audiofile?: string;
  trackImage?: string;
  trackname?: string;
  artistname?: string;
  trackuuid?: any;
  type?: string;
  start?: number;
  graph?: any;
}
@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaveformComponent
  implements OnDestroy, AfterViewInit, OnInit, OnChanges
{
  @ViewChild('player') player: ElementRef;
  @Input() musicInfo: Music;
  @Input() play;
  @Output() pause = new EventEmitter();

  wave;
  loading: boolean;

  constructor(
    private cd: ChangeDetectorRef,
    public playerService: PlayerService
  ) {}
  ngOnInit() {
    this.playerService.musicInfo.subscribe((currentMusic) => {
      if (currentMusic.trackuuid !== this.musicInfo.trackuuid) {
        this.wave?.pause();
        this.cd.detectChanges();
      }
    });
  }
  ngAfterViewInit() {
    const options = {
      progressColor: '#ff3567',
      hideScrollbar: true,
    };
    this.wave = WaveSurfer.create({
      container: this.player.nativeElement,
      // backend: 'MediaElement', // enable this to show cursor on all tracks before playing
      plugins: [
        WaveSurfer.cursor.create({
          showTime: true,
          opacity: 1,
          customShowTimeStyle: {
            'background-color': '#000',
            color: '#fff',
            padding: '2px',
            'font-size': '10px',
          },
        }),
      ],
      ...options,
    });
    const url = `${this.musicInfo.audiofile}`;

    this.wave.load(url, this.musicInfo.graph, false);

    this.wave.on('play', () => {
      this.playerService.musicInfo.next(this.musicInfo);
      this.cd.detectChanges();
    });

    this.wave.on('pause', () => this.pause.emit());
    this.wave.on('finish', () => {
      this.pause.emit();
      this.cd.detectChanges();
    });
    this.wave.on('audioprocess', (value) => {
      const d = { value, max: this.wave.getDuration() };
      this.playerService.progress.next(d);
    });
    this.wave.on('loading', () => {
      this.loading = true;
      this.cd.markForCheck();
    });
    this.wave.on('ready', () => {
      this.loading = false;
      this.cd.markForCheck();
    });

    this.cd.detectChanges();
  }
  ngOnChanges() {
    if (this.play) {
      this.wave?.play();
    } else {
      this.wave?.pause();
    }
  }

  playPause() {
    this.wave?.playPause();
  }

  ngOnDestroy() {
    this.wave?.destroy();
  }
}
