/**
 * @author    Daniel Kovalovsky (d.kovalovsky@outlook.com)
 * @copyright Copyright (c) 2022 Daniel Kovalovsky
 */


import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//import { MatMenuModule } from '@angular/material/menu';

import { ElementNameDialogComponent } from './presentation/element-name.dialog.component';

@NgModule({
  declarations: [
    ElementNameDialogComponent,
  ],
  exports: [
    ElementNameDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    //MatMenuModule,
  ]
})
export class DialogModule { }
