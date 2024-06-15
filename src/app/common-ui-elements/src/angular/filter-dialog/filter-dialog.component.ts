import { Component } from '@angular/core'
import { DataFilterInfoComponent } from '../data-filter-info/data-filter-info.component'
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'

@Component({
  templateUrl: './filter-dialog.component.html',
})
export class FilterDialogComponent {
  constructor(private dialog: MatDialogRef<any>) {}
  info!: DataFilterInfoComponent
  setFilter() {
    this.info.settings.columns.filterRows(this.info.filterColumnToAdd)
    this.dialog.close()
  }
  clear() {
    this.info.settings.columns.clearFilter(this.info.filterColumnToAdd)
    this.dialog.close()
  }
}
