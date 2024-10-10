import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { authGuard } from './guards/auth.guard';
import { RankingComponent } from './components/ranking/ranking.component';
import { EncuestaComponent } from './components/encuesta/encuesta.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'ranking', component: RankingComponent},
    {path: 'log-in', component: LogInComponent, canActivate: [authGuard], data: { negate: true} }, // Solo para usuarios NO logueados
    {path: 'about-me', component: AboutMeComponent},
    {path: 'encuesta', component: EncuestaComponent},
    {
        path: 'juegos',
        loadChildren: () =>
          import('./modules/juegos/juegos.module').then((m) => m.JuegosModule), canActivate: [authGuard],
    },    
    // La ruta comodin debe ir siempre al final
    { path: '**', component: PageNotFoundComponent},
];
