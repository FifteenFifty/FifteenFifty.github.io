import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { ResourceComponent } from './resource/resource.component';
import { KeysPipe } from './keys.pipe';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    ResourceComponent,
    KeysPipe
  ],
  imports: [
      BrowserModule,
      NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
