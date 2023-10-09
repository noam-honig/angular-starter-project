import { Component, OnInit } from '@angular/core'
import { Fields, getFields } from 'remult'
import { DataAreaSettings } from '../common-ui-elements/interfaces'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  @Fields.string<HomeComponent>({
    customInput: (o) => {
      o.inputAddress((result, self: HomeComponent) => {
        self.city = result.city
      })
    },
  })
  a = 'a'
  get $() {
    return getFields(this)
  }

  city = 'NONE'
  ngOnInit() {}
}
