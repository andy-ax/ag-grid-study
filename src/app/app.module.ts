import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
    imports: [
        BrowserModule,
        AgGridModule.withComponents([]),
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
