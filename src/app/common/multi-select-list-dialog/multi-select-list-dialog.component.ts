import { Component } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { MultiSelectOptions } from '../UITools'

@Component({
  template: `
    <h1 mat-dialog-title>{{ title }}</h1>

    <div mat-dialog-content>
      <form (submit)="selectFirst()">
        <mat-form-field>
          <input
            matInput
            [(ngModel)]="searchString"
            [ngModelOptions]="{ standalone: true }"
            placeholder="חיפוש"
          />
        </mat-form-field>
      </form>
      <mat-nav-list role="list" *ngIf="values">
        <ng-container *ngFor="let o of values">
          <ng-container *ngIf="matchesFilter(o)">
            <mat-list-item
              role="listitem"
              style="height:36px"
              (click)="selectItem(o)"
            >
              <mat-checkbox
                [checked]="selectedValues.includes(o)"
              ></mat-checkbox>
              &nbsp;
              {{ getCaption(o) }}
            </mat-list-item>
            <mat-divider></mat-divider>
          </ng-container>
        </ng-container>
      </mat-nav-list>
    </div>
    <div mat-dialog-actions>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>clear</mat-icon>
      </button>
      <button mat-icon-button (click)="select()">
        <mat-icon>check</mat-icon>
      </button>
    </div>
  `,
})
export class MultiSelectListDialogComponent {
  constructor(private dialog: MatDialogRef<any>) {}
  searchString = ''

  matchesFilter(o: any) {
    return this.getCaption(o)
      .toLocaleLowerCase()
      .includes(this.searchString.toLocaleLowerCase())
  }

  values: any[] = []
  title? = ''
  onSelect!: (selected: any[]) => void
  getCaption!: (item: any) => string

  args<T>(args: MultiSelectOptions<T>) {
    this.values = args.values
    this.onSelect = args.onSelect as (selected: any[]) => void
    this.getCaption = args.getCaption as (x: T) => string
    if (!this.getCaption) {
      this.getCaption = (x: { caption: string }) => x.caption
    }
    this.title = args.title
    if (args.selected) this.selectedValues = args.selected
  }
  selectedValues: any[] = []
  selectItem(x: any) {
    if (this.selectedValues.includes(x))
      this.selectedValues = this.selectedValues.filter((y) => y != x)
    else this.selectedValues.push(x)
  }
  selectFirst() {
    for (const o of this.values) {
      if (this.matchesFilter(o)) {
        this.selectItem(o)
        return
      }
    }
  }
  select() {
    this.onSelect(this.selectedValues)
    this.dialog.close()
  }
}
