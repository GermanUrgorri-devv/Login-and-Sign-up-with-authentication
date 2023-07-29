import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DogPageRoutingModule } from './dog-routing.module';

import { DogPage } from './dog.page';
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
    declarations: [DogPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DogPageRoutingModule,
        ComponentsModule
    ]
})
export class DogPageModule {}
