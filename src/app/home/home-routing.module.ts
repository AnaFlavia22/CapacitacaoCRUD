import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children:[
      {
        path: 'visualizar',
        children:[
          {
            path:'',
            loadChildren: () => import('../pages/visualizar/visualizar.module').then( m => m.VisualizarPageModule)
          }
        ] 
      },
      {
        path: 'editar',
        children:[
          {
            path:'',
            loadChildren: () => import('../pages/editar/editar.module').then( m => m.EditarPageModule)
          }
        ] 
      },
      {
        path: 'excluir',
        children:[
          {
            path:'',
            loadChildren: () => import('../pages/excluir/excluir.module').then( m => m.ExcluirPageModule)
          }
        ] 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
