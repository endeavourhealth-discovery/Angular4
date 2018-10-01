import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserManagerService} from "./user-manager.service";
import {UserManagerNotificationService} from "./user-manager-notification.service";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        UserManagerService,
        UserManagerNotificationService
    ]
})
export class UserManagerModule { }