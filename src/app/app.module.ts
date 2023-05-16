import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonUIElementsModule } from 'common-ui-elements';
import { UsersComponent } from './users/users.component';
import { HomeComponent } from './home/home.component';
import { YesNoQuestionComponent } from './common/yes-no-question/yes-no-question.component';
import { DataAreaDialogComponent } from './common/data-area-dialog/data-area-dialog.component';
import { UIToolsService } from './common/UIToolsService';
import { AdminGuard } from "./users/AdminGuard";
import { remult } from 'remult';
import { SignInController } from './users/SignInController';
import { TextAreaDataControlComponent } from './common/textarea-data-control/textarea-data-control.component';

@NgModule({
    declarations: [
        AppComponent,
        UsersComponent,
        HomeComponent,
        YesNoQuestionComponent,
        DataAreaDialogComponent,
        TextAreaDataControlComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        CommonUIElementsModule
    ],
    providers: [
        UIToolsService,
        AdminGuard,
        { provide: APP_INITIALIZER, useFactory: initApp, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function initApp() {
  const loadCurrentUserBeforeAppStarts = async () => {
    remult.user = await SignInController.currentUser();
  };
  return loadCurrentUserBeforeAppStarts;
}