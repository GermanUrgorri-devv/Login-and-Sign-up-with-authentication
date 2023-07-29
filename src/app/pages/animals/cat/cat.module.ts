import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatPageRoutingModule } from './cat-routing.module';

import { CatPage } from './cat.page';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
    declarations: [CatPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CatPageRoutingModule,
        ComponentsModule
    ]
})
export class CatPageModule {}
