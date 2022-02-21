import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WaveformComponent } from '../waveform/waveform.component';
import { PlayerService } from '../services/player.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, BrowserModule, FormsModule, HttpClientModule],
  declarations: [AppComponent, WaveformComponent],
  bootstrap: [AppComponent],
  providers: [PlayerService],
})
export class AppModule {}
