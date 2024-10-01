import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from '../ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../preguntados/preguntados.component';

@NgModule({
  declarations: [AhorcadoComponent, MayorMenorComponent, PreguntadosComponent],
  imports: [
    CommonModule,
    JuegosRoutingModule
  ]
})
export class JuegosModule {}