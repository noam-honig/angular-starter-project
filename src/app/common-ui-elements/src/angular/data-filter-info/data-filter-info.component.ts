import { Directionality } from '@angular/cdk/bidi'
import { Component, Input, ElementRef, ViewChild } from '@angular/core'
import { openDialog } from '../common-ui-elements.module'
import { FieldMetadata, Remult } from 'remult'
import { GridSettings } from '../../../interfaces'
import { DataControlSettings } from '../../../interfaces'

import { SelectValueDialogComponent } from '../add-filter-dialog/add-filter-dialog.component'
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component'

@Component({
  selector: 'Data-Filter',
  templateUrl: './data-filter-info.component.html',
  styles: [
    `
      .link {
        cursor: pointer;
        color: blue;
        text-decoration: underline;
      }
    `,
  ],
})
export class DataFilterInfoComponent {
  @Input() settings!: GridSettings<any>
  filterColumnToAdd!: DataControlSettings
  getCurrentFilterValue(col: FieldMetadata) {
    this.settings.initOrigList()
    let m = this.settings.origList.find((x) => x.field == col)
    if (this.settings.filterHelper.filterRow[col.key] instanceof Date) {
      return this.settings.filterHelper.filterRow[col.key].toLocaleDateString()
    }
    return this.settings.columns._getColDisplayValue(
      m!,
      this.settings.filterHelper.filterRow
    )
  }
  cancelAddFilter() {}
  constructor(dir: Directionality) {
    this.rightToLeft = dir.value === 'rtl'
  }

  showFilterButton = false
  showAddFilter = false
  editFilterVisible = false
  showEditFilter(col: FieldMetadata) {
    this.filterColumnToAdd = this.settings.origList.find((x) => x.field == col)!
    this.editFilterVisible = true
    this.showAddFilter = false
  }
  userFilterButton() {
    this.showFilterButton = !this.showFilterButton
    this.settings.initOrigList()
    if (this.settings.filterHelper.filterColumns.length == 0)
      this.showAddAnotherFilterDialog()
  }
  async showAddAnotherFilterDialog() {
    this.settings.initOrigList()
    this.filterColumnToAdd = undefined!
    await openDialog(SelectValueDialogComponent, (x) =>
      x.args({
        title: this.rightToLeft
          ? 'בחר עמודה לסינון'
          : 'Select Column to Filter',
        values: this.settings.origList,
        onSelect: (x) => (this.filterColumnToAdd = x),
      })
    )

    if (this.filterColumnToAdd) {
      await this.showFilterDialog()
    }

    this.showAddFilter = true
    this.filterColumnToAdd = undefined!
  }
  private async showFilterDialog() {
    if (this.filterColumnToAdd.customFilter) {
      await this.filterColumnToAdd.customFilter((filterValue) => {
        if (filterValue === undefined) {
          this.settings.columns.clearFilter(this.filterColumnToAdd)
        } else {
          this.settings.filterHelper.filterRow[
            (this.filterColumnToAdd.field as FieldMetadata).key
          ] = filterValue
          this.settings.columns.filterRows(this.filterColumnToAdd)
        }
      })
    } else await openDialog(FilterDialogComponent, (x) => (x.info = this))
  }

  public async editFilter(col: FieldMetadata) {
    this.filterColumnToAdd = this.settings.origList.find((x) => x.field == col)!
    await this.showFilterDialog()
  }
  confirmEditFilter() {
    this.settings.columns.filterRows(this.filterColumnToAdd)
    this.editFilterVisible = false
  }
  clearEditFilter() {
    this.settings.columns.clearFilter(this.filterColumnToAdd)
    this.editFilterVisible = false
  }

  addFilter() {
    this.settings.columns.filterRows(this.filterColumnToAdd)
    this.showAddFilter = false
  }
  cancelAddNewFilter() {
    this.showAddFilter = false
  }
  rightToLeft = false
}
