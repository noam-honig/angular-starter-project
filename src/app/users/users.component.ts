import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { BackendMethod, Remult } from 'remult';

import { DialogService } from '../common/dialog';
import { Roles } from './roles';

import { terms } from '../terms';
import { GridSettings } from 'common-ui-elements/interfaces';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  constructor(private dialog: DialogService, public remult: Remult) {
  }
  isAdmin() {
    return this.remult.isAllowed(Roles.admin);
  }

  users = new GridSettings(this.remult.repo(User), {
    allowDelete: true,
    allowInsert: true,
    allowUpdate: true,
    numOfColumnsInGrid: 2,

    orderBy: { name: "asc" },
    rowsInPage: 100,

    columnSettings: users => [
      users.name,
      users.admin
    ],
    rowButtons: [{
      name: terms.resetPassword,
      click: async () => {

        if (await this.dialog.yesNoQuestion(terms.passwordDeleteConfirmOf + " " + this.users.currentRow.name)) {
          await this.users.currentRow.resetPassword();
          this.dialog.info(terms.passwordDeletedSuccessful);
        };
      }
    }
    ],
    confirmDelete: async (h) => {
      return await this.dialog.confirmDelete(h.name)
    },
  });

  ngOnInit() {
  }

}
