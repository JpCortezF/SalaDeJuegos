import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LogInComponent } from './components/log-in/log-in.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'log-in', component: LogInComponent},
    {path: 'about-me', component: AboutMeComponent},
    {
        path: 'juegos',
        loadChildren: () =>
          import('./modules/juegos/juegos.module').then((m) => m.JuegosModule),
    },    
    // La ruta comodin debe ir siempre al final
    { path: '**', component: PageNotFoundComponent},
];
