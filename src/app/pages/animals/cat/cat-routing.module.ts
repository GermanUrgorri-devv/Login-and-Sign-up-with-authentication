import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatPage } from './cat.page';

const routes: Routes = [
  {
    path: '',
    component: CatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatPageRoutingModule {}
