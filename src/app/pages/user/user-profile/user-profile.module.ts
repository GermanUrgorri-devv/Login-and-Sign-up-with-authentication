import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePage } from './user-profile.page';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
    declarations: [UserProfilePage],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        UserProfilePageRoutingModule,
        ComponentsModule
    ]
})
export class UserProfilePageModule {}
