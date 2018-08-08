import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserManagerService} from "./user-manager.service";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        UserManagerService
    ]
})
export class UserManagerModule { }