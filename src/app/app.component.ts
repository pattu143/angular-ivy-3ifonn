import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { PlayerService } from '../services/player.service';
import { Music } from '../waveform/waveform.component';
import WaveSurfer from 'wavesurfer.js';

import { BASE_URL, MUSIC_DATA } from './music.data';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('mainWaves', { static: false }) mainWaves: ElementRef;

  musics: Music[] = MUSIC_DATA;
  play = Array(this.musics.length).fill(false);
  currentMusicInfo: Music;
  playing = false;
  wave;

  constructor(
    private cd: ChangeDetectorRef,
    private playerService: PlayerService
  ) {}

  ngAfterViewInit() {
    this.wave = WaveSurfer.create({
      container: this.mainWaves?.nativeElement,
      progressColor: '#ff3567',
      backend: 'MediaElement', // To avoid multiple fetch calls of same audio  file
    });

    this.playerService.musicInfo.subscribe((currentMusicInfo) => {
      if (!Object.keys(currentMusicInfo).length) return;

      this.currentMusicInfo = currentMusicInfo;

      this.wave.load(
        `${BASE_URL}${currentMusicInfo.audiofile}`,
        currentMusicInfo.graph,
        false
      );

      this.playing = true;
      this.wave.setMute(true);
      this.cd.markForCheck();
    });
    this.playerService.progress.subscribe(({ value, max }) => {
      if (typeof value === 'number') this.wave.seekTo(value / max);
    });
  }

  togglePlay() {
    const index = this.musics.findIndex(
      (m) => m.trackuuid === this.currentMusicInfo.trackuuid
    );
    if (index >= 0) {
      this.play[index] = !this.play[index];
      this.playing = this.play[index];
    }
    this.cd.detectChanges();
  }

  playPause() {
    this.togglePlay();
  }

  onPause() {
    this.playing = false;
    this.wave.pause();
    this.cd.detectChanges();
  }
}
