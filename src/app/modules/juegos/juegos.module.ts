import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from '../ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../preguntados/preguntados.component';
import { DeftionaryComponent } from '../deftionary/deftionary.component';

@NgModule({
  declarations: [AhorcadoComponent, MayorMenorComponent, PreguntadosComponent, DeftionaryComponent],
  imports: [
    CommonModule,
    JuegosRoutingModule
  ]
})
export class JuegosModule {}