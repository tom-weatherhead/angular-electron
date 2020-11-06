// github:tom-weatherhead/angular-electron/src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
	// { path: 'detail/:id', component: HeroDetailComponent },
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: 'app-root', component: AppComponent },
	{ path: 'dashboard', component: DashboardComponent } // ,
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
