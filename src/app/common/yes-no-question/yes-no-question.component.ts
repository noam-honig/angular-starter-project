import { Component, OnInit } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'
import { terms } from '../../terms'

@Component({
  selector: 'app-yes-no-question',
  templateUrl: './yes-no-question.component.html',
  styleUrls: ['./yes-no-question.component.scss'],
})
export class YesNoQuestionComponent implements OnInit {
  okPressed = false
  args!: {
    message: string
    isAQuestion?: boolean
  }

  constructor(private dialogRef: MatDialogRef<any>) {}
  terms = terms

  ngOnInit() {
    if (this.args.isAQuestion === undefined) this.args.isAQuestion = true
  }
  close() {
    this.dialogRef.close()
  }
  select() {
    this.dialogRef.close()
    this.okPressed = true
  }
}
