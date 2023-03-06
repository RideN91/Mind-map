/**
 * @author    Daniel Kovalovsky (d.kovalovsky@outlook.com)
 * @copyright Copyright (c) 2022 Daniel Kovalovsky
 */

import { Component } from '@angular/core';

@Component({
  selector: 'jeba-programs-diagram-name-dialog',
  templateUrl: './element-name.dialog.component.html'
})
export class ElementNameDialogComponent {
  public name: string;

  public title = 'Type in name';
}
