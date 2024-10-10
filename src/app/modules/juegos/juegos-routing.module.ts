import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from '../ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../preguntados/preguntados.component';
import { DeftionaryComponent } from '../deftionary/deftionary.component';

const routes: Routes = [
  { path: 'ahorcado', component: AhorcadoComponent},
  { path: 'mayor-menor', component: MayorMenorComponent },
  { path: 'preguntados', component: PreguntadosComponent },
  { path: 'deftionary', component: DeftionaryComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
  // Aquí puedes agregar más juegos con sus respectivos componentes
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class JuegosRoutingModule {}
