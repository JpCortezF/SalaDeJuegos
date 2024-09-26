import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from '../ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../mayor-menor/mayor-menor.component';

const routes: Routes = [
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'mayor-menor', component: MayorMenorComponent },
  // Aquí puedes agregar más juegos con sus respectivos componentes
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class JuegosRoutingModule {}
