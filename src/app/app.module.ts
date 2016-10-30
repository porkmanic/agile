import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {AngularFireModule} from "angularfire2";

export const firebaseConfig = {
  apiKey: "AIzaSyAjhv-9x1AaIDOrw11wYhrvaCehKg_tg-8",
  authDomain: "spades-39baf.firebaseapp.com",
  databaseURL: "https://spades-39baf.firebaseio.com",
  storageBucket: "spades-39baf.appspot.com",
  messagingSenderId: "388005840392"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
