import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
//import { MatMenuModule } from '@angular/material/menu';

import { AppComponent } from './app.component';

import { DialogModule } from '../dialog.module';

@NgModule({
     bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        //MatMenuModule,

        DialogModule,
    ],
    providers: []

})
export class AppModule { }
