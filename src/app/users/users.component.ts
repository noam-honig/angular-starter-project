import { Component, OnInit } from '@angular/core'
import { User } from './user'

import { UIToolsService } from '../common/UIToolsService'
import { Roles } from './roles'

import { terms } from '../terms'
import { GridSettings } from 'common-ui-elements/interfaces'
import { remult } from 'remult'
import { saveToExcel } from '../common-ui-elements/interfaces/src/saveGridToExcel'
import { BusyService } from '../common-ui-elements'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  constructor(private ui: UIToolsService, private busyService: BusyService) {}
  isAdmin() {
    return remult.isAllowed(Roles.admin)
  }

  users: GridSettings<User> = new GridSettings<User>(remult.repo(User), {
    allowDelete: false,
    allowInsert: true,
    allowUpdate: true,
    columnOrderStateKey: 'users',

    orderBy: { name: 'asc' },
    rowsInPage: 100,

    columnSettings: (user) => [user.name, user.admin, user.disabled],
    rowCssClass: (row) => (row.disabled ? 'canceled' : ''),
    gridButtons: [
      {
        name: 'Excel',
        click: () => saveToExcel(this.users, 'users', this.busyService),
      },
    ],
    rowButtons: [
      {
        name: terms.resetPassword,
        click: async () => {
          if (
            await this.ui.yesNoQuestion(
              terms.passwordDeleteConfirmOf + ' ' + this.users.currentRow.name
            )
          ) {
            await this.users.currentRow.resetPassword()
            this.ui.info(terms.passwordDeletedSuccessful)
          }
        },
      },
    ],
    confirmDelete: async (h) => {
      return await this.ui.confirmDelete(h.name)
    },
  })

  ngOnInit() {}
}
