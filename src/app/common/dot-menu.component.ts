import { Component, Input, OnInit } from '@angular/core'
import { RowButton } from '../common-ui-elements/interfaces'
import { async } from 'rxjs'
import { UIToolsService } from './UIToolsService'

@Component({
  selector: 'app-dots-menu',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon>more_vert</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <ng-container *ngFor="let b of buttons">
        <button
          mat-menu-item
          *ngIf="b.visible === undefined || b.visible(item)"
          (click)="click(b)"
        >
          <mat-icon *ngIf="!b.icon?.includes('/')">{{ b.icon }}</mat-icon>
          <img
            [src]="b.icon"
            *ngIf="b.icon?.includes('/')"
            style="height: 24px; margin-left: 16px; vertical-align: middle"
          />

          <span>{{ getButtonName(b) }}</span>
        </button>
      </ng-container>
    </mat-menu>
  `,
})
export class DotsMenuComponent implements OnInit {
  constructor(private ui: UIToolsService) {}
  @Input() buttons!: RowButton<any>[]
  @Input() item: any
  ngOnInit(): void {}
  getButtonName(b: RowButton<any>) {
    if (b.textInMenu) {
      if (typeof b.textInMenu === 'function') return b.textInMenu(this.item)
      return b.textInMenu
    }
    return b.name
  }
  async click(b: RowButton<any>) {
    try {
      await b.click!(this.item)
    } catch (err) {
      this.ui.error(err)
    }
  }
}
