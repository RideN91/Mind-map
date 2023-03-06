/**
 * @author    Daniel Kovalovsky (d.kovalovsky@outlook.com)
 * @copyright Copyright (c) 2023 Daniel Kovalovsky
 */

// MVC

// M => Model
// V => View
// C => Controller

// Model je datova vrstva
// View je xicht
// Controller je mustek mezi datovou vrstvou a xichtem


// C => V vzdy, co se public veci tyce
// V => C promenne jen pres @decoratory, metody vzdy, co se public veci tyce

import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { connectors, dia, shapes, util, V } from 'jointjs';

import { first } from 'rxjs/operators';
import { IDiagramCoordinates } from '../interface/diagram-coordinates.interface';

import { ElementNameDialogComponent } from '../presentation/element-name.dialog.component';

const BACKGROUND_COLOR = '#fafafa';
const ELEMENT_BORDER_COLOR = '#ccc';
const LINK_COLOR = '#000';
const ORANGE = '#e6a502';
const BLUE = '#3f51b5';

const PORT_FILL_COLOR = BACKGROUND_COLOR;

const PORT_OUTPUT_BORDER_COLOR = ORANGE;
const PORT_INPUT_BORDER_COLOR = BLUE;

const zoomElement = document.querySelector("container");
let zoom = 1;

const DEFAULT_LINK_OPTIONS: shapes.standard.LinkAttributes = {
  attrs: {
    line: {
      stroke: LINK_COLOR
    }
  },
  connector: connectors.smooth,
  router: { name: 'manhattan' }
};
@Component({
  selector: 'jeba-programs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @HostListener('window:resize')
  public onResize(): void {
    const containerWidth = this.container.nativeElement.clientWidth;
    const containerHeight = this.container.nativeElement.clientHeight;

    const toolsWidth = this.tools.nativeElement.clientWidth;

    const width = containerWidth - toolsWidth;
    const height = containerHeight;

    this._resize(width, height);
  }

  @ViewChild('container')
  public container: ElementRef<HTMLDivElement>;

  @ViewChild('contextMenu')
  public contextMenu: ElementRef<HTMLDivElement>;

  @ViewChild('diagram')
  public diagram: ElementRef<HTMLDivElement>;

  @ViewChild('diagramWrap')
  public diagramWrap: ElementRef<HTMLDivElement>;

  @ViewChild('tools')
  public tools: ElementRef<HTMLDivElement>;

  public isContextMenuVisible = false;

  private _contextMenuRelativeCoordinates: IDiagramCoordinates;

  private _graph: dia.Graph;

  private _paper: dia.Paper;

  public constructor(private _dialog: MatDialog) {
  }

  public ngAfterViewInit(): void {
    const namespace = shapes;

    this._graph = new dia.Graph({}, { cellNamespace: namespace });

    this._paper = new dia.Paper({
      width: this.diagramWrap.nativeElement.clientWidth,
      height: this.diagramWrap.nativeElement.clientHeight,
      background: {
        color: BACKGROUND_COLOR
      },
      cellViewNamespace: namespace,
      defaultLink: () => new shapes.standard.Link(DEFAULT_LINK_OPTIONS),
      el: this.diagram.nativeElement,
      highlighting: {
        connecting: {
          name: 'addClass',
          options: {
            className: 'highlight-connecting'
          }
        },
        default: {
          name: 'addClass',
          options: {
            className: 'highlight-default'
          }
        },
        'magnetAvailability': {
          name: 'addClass',
          options: {
            className: 'highlight-magnet-available'
          }
        }
      },
      linkPinning: false,
      markAvailable: true,
      model: this._graph,
      snapLinks: { radius: 35 },
    });
  }

  public addRectangle(): void {
    const dialogRef = this._dialog.open(ElementNameDialogComponent);

    dialogRef.componentInstance.title = 'Rectangle name';

    dialogRef.afterClosed()
      .pipe(first())
      .subscribe(label => {
        if (!label) {
          return;
        }

        this._createRectangleEvent(label, this._contextMenuRelativeCoordinates);
      });
  }

  public addStart(): void {
    const dialogRef = this._dialog.open(ElementNameDialogComponent, {
    });

    dialogRef.componentInstance.title = 'Start event name';

    dialogRef.afterClosed()
      .pipe(first())
      .subscribe(label => {
        if (!label) {
          return;
        }

        this._createStartEvent(label, this._contextMenuRelativeCoordinates);
      });
  }

  public contextMenuHide(): void {
    this.isContextMenuVisible = false;
  }

  public contextMenuShow(event: MouseEvent): void {
    this.isContextMenuVisible = true;

    // MATIKA

    // const contextMenuWidth = util.parseCssNumeric(
    //   getComputedStyle(this.contextMenu.nativeElement).getPropertyValue('width'),
    //   'px'
    // )?.value ?? 0;

    // const contextMenuWidth = util.parseCssNumeric(
    //   { width: '160 px' }.getPropertyValue('width'),
    //   'px'
    // )?.value ?? 0;

    // const contextMenuWidth = util.parseCssNumeric(
    //   '160 px',
    //   'px'
    // )?.value ?? 0;

    // const contextMenuWidth = { value: 160, unit: 'px' }?.value ?? 0;

    // const contextMenuWidth = 160 ?? 0;

    // const contextMenuWidth = 160;

    const contextMenuWidth = util.parseCssNumeric(getComputedStyle(this.contextMenu.nativeElement).getPropertyValue('width'), 'px')?.value ?? 0;
    const contextMenuHeight = util.parseCssNumeric(getComputedStyle(this.contextMenu.nativeElement).getPropertyValue('height'), 'px')?.value ?? 0;

    let x = event.offsetX;
    let y = event.offsetY;

    if (x + contextMenuWidth > this.diagramWrap.nativeElement.clientWidth) {
      x = this.diagramWrap.nativeElement.clientWidth - contextMenuWidth;
    }

    if (y + contextMenuHeight > this.diagramWrap.nativeElement.clientHeight) {
      y = this.diagramWrap.nativeElement.clientHeight - contextMenuHeight;
    }

    this.contextMenu.nativeElement.style.top = `${y}px`;
    this.contextMenu.nativeElement.style.left = `${x}px`;

    const paperCoordinates = this._getPaperPoint({ x: event.clientX, y: event.clientY });

    this._contextMenuRelativeCoordinates = {
      x: paperCoordinates.x,
      y: paperCoordinates.y
    };
  }


//   public zoom('wheel', function (e) {
//     let zoom = 1;

//     if (e.deltaY > 0) {
//       zoomElement.style.transform = 'scale(${(zoom += 0.06)})';
//     } else {
//       zoomElement.style.transform = 'scale(${(zoom -= 0.06)})';
//     }

// }

  private _createRectangleEvent(label: string, position?: IDiagramCoordinates): void {
    if (!position) {
      position = {
        x: 0,
        y: 0
      };
    }

    const rectangleEvent = new shapes.standard.Rectangle({
      attrs: {
        body: {
          fillOpacity: 0,
          stroke: BACKGROUND_COLOR,
          strokeWidth: '3'
        },
        label: {
          text: label
        }
      },
      position,
      ports: {
        groups: {
          out: {
            attrs: {
              portBody: {
                magnet: true,
                r: 3,
                fill: PORT_FILL_COLOR,
                stroke: PORT_INPUT_BORDER_COLOR
              },
            },
            position: {
              name: 'left',
              args: {
                x: 45,
                y: 10
              }
            },
            markup: [{
              tagName: 'circle',
              selector: 'portBody'
            }]
          }
        }
      },
      size: {
        width: 40,
        height: 20
      }
    });

    rectangleEvent.addPorts([
      { group: 'out'},
    ]);

    rectangleEvent.addTo(this._graph)
  }

  private _createStartEvent(label: string, position?: IDiagramCoordinates): void {
    if (!position) {
      position = {
        x: 0,
        y: 0
      };
    }

    const startEvent = new shapes.standard.Circle({
      attrs: {
        body: {
          fillOpacity: 0,
          stroke: ELEMENT_BORDER_COLOR,
          strokeWidth: '3'
        },
        label: {
          text: label
        }
      },
      position,
      ports: {
        groups: {
          out: {
            attrs: {
              portBody: {
                magnet: true,
                r: 10,
                fill: PORT_FILL_COLOR,
                stroke: PORT_OUTPUT_BORDER_COLOR
              },
            },
            label: {
              position: {
                name: 'bottom',
                args: {
                  y: 15
                }
              }
            },
            position: {
              name: 'left',
              args: {
                x: 0,
                y: 39
              }
            },
            markup: [{
              tagName: 'circle',
              selector: 'portBody'
            }]
          }
        },
        items: [
          {
            group: 'out',
            id: 'out1',
            attrs: {
            },
            label: {
              position: {
                name: 'bottom',
                args: {
                  y: -25
                }
              }
            },
          },
          {
            group: 'out',
            id: 'out2',
          },
          {
            group: 'out',
            id: 'out3',
          }
        ]
      },
      size: {
        width: 80,
        height: 80
      }
    });

    startEvent.addPorts([
      { group: 'out' },
    ]);

    startEvent.portProp('out1', 'args/x', 80);
    startEvent.portProp('out2', 'args/x', 40);
    startEvent.portProp('out2', 'args/y', 0);
    startEvent.portProp('out3', 'args/x', 40);
    startEvent.portProp('out3', 'args/y', 80);

    startEvent.addTo(this._graph);
  }

  private _getPaperPoint(coordinates: IDiagramCoordinates): IDiagramCoordinates {
    return V(this._paper.viewport).toLocalPoint(coordinates.x, coordinates.y);
  }

  private _resize(width: number, height: number): void {
    this._paper.setDimensions(width, height);
  }

}
