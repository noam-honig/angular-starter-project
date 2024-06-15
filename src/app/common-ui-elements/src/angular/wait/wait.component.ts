import { Component, OnInit } from '@angular/core'
import { LegacyProgressSpinnerMode as ProgressSpinnerMode } from '@angular/material/legacy-progress-spinner'

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.scss'],
})
export class WaitComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  mode: ProgressSpinnerMode = 'indeterminate'
  value = 0
}
