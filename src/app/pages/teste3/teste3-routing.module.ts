import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Teste3Page } from './teste3.page';

const routes: Routes = [
  {
    path: '',
    component: Teste3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Teste3PageRoutingModule {}
