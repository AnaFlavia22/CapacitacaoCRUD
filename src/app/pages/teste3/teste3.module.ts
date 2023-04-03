import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Teste3PageRoutingModule } from './teste3-routing.module';

import { Teste3Page } from './teste3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Teste3PageRoutingModule
  ],
  declarations: [Teste3Page]
})
export class Teste3PageModule {}
