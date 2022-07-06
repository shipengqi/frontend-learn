import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PeekABooComponent } from './components/peekaboo/peek-a-boo.component';
import { ParentComponent } from './components/csst/parent.component';
import { AComponent } from './components/csst/suba.component';
import { BComponent } from './components/csst/subb.component';

@NgModule({
  declarations: [
    AppComponent,
    PeekABooComponent,
    ParentComponent,
    AComponent,
    BComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
