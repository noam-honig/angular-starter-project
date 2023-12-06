import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'

import { GridDialogArgs, button } from '../UITools'
import { DialogConfig } from '../../common-ui-elements/src/angular/DialogConfig'

@Component({
  selector: 'app-grid-dialog',
  templateUrl: './grid-dialog.component.html',
  styleUrls: ['./grid-dialog.component.scss'],
})
@DialogConfig({
  minWidth: '95vw',
})
export class GridDialogComponent implements OnInit {
  args!: GridDialogArgs

  constructor(public dialogRef: MatDialogRef<any>) {
    dialogRef
      .afterClosed()
      .toPromise()
      .then((x) => this.cancel())
  }

  ngOnInit() {}
  cancel() {
    if (!this.ok && this.args.cancel) this.args.cancel()
  }
  ok = false
  async confirm() {
    if (this.args.validate) {
      try {
        await this.args.validate()
      } catch {
        return
      }
    }
    if (this.args.ok) await this.args.ok()
    this.ok = true
    this.dialogRef.close()
  }
  buttonClick(b: button, e: MouseEvent) {
    e.preventDefault()
    b.click(() => {
      this.dialogRef.close()
    })
  }
  isVisible(b: button) {
    if (!b.visible) return true
    return b.visible()
  }
}
