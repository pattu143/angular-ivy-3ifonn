import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BASE_URL } from '../app/music.data';
import { Music } from '../waveform/waveform.component';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  musicInfo = new BehaviorSubject<Music>({});
  progress = new BehaviorSubject<any>(false);
  constructor(private http: HttpClient) {}
  getTrack(filename) {
    return this.http.get(`${filename}`);
  }
}
