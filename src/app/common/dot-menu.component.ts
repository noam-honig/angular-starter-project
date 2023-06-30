import { Component, Input, OnInit } from '@angular/core'
import { RowButton } from '../common-ui-elements/interfaces'

@Component({
  selector: 'app-dots-menu',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon>more_vert</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item *ngFor="let b of buttons" (click)="b.click!(item)">
        <mat-icon *ngIf="!b.icon?.includes('/')">{{ b.icon }}</mat-icon>
        <img
          [src]="b.icon"
          *ngIf="b.icon?.includes('/')"
          style="height: 24px; margin-left: 16px; vertical-align: middle"
        />

        <span>{{ b.name }}</span>
      </button>
    </mat-menu>
  `,
})
export class DotsMenuComponent implements OnInit {
  constructor() {}
  @Input() buttons!: RowButton<any>[]
  @Input() item: any
  ngOnInit(): void {}
}
