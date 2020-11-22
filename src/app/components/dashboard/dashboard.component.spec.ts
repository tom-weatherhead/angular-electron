// angular-electron/src/app/components/dashboard/dashboard.component.spec.ts

import { HttpClientModule } from '@angular/common/http';

import {
	ComponentFixture,
	TestBed,
	waitForAsync
} from '@angular/core/testing';

import { FormsModule /*, ReactiveFormsModule */ } from '@angular/forms';

// import { ConfigurationService } from '../../services/configuration/configuration.service';

// import { ElectronService } from '../../services/electron/electron.service';

// import { LoggerService } from '../../services/logger/logger.service';

import { BasicCanvasComponent } from '../basic-canvas/basic-canvas.component';

import { PaletteComponent } from '../palette/palette.component';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
	let fixture: ComponentFixture<DashboardComponent>;
	let component: DashboardComponent;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [
					FormsModule, // For e.g. NgModel
					HttpClientModule
				],
				declarations: [
					DashboardComponent,
					BasicCanvasComponent,
					PaletteComponent
				],
				providers: [
					// ConfigurationService,
					// ElectronService,
					// LoggerService
				]
			})
				.compileComponents()
				.then(() => {
					fixture = TestBed.createComponent(DashboardComponent);
					component = fixture.componentInstance;
					fixture.detectChanges();
				});
		})
	);

	it('should create the dashboard component', () => {
		expect(component).toBeTruthy();
	});
});

// - Angular: Testing with Dependency Injection:
// 	- From https://angular.io/guide/dependency-injection#testing-components-with-dependencies :

// Testing components with dependencies

// Designing a class with dependency injection makes the class easier
// to test. Listing dependencies as constructor parameters may be all
// you need to test application parts effectively.

// For example, you can create a new HeroListComponent with a mock service that you can manipulate under test.
// src/app/test.component.ts

// Code:

// const expectedHeroes = [{name: 'A'}, {name: 'B'}]
// const mockService = <HeroService> {getHeroes: () => expectedHeroes }

// it('should have heroes when HeroListComponent created', () => {
// 	// Pass the mock to the constructor as the Angular injector would
// 	const component = new HeroListComponent(mockService);
// 	expect(component.heroes.length).toEqual(expectedHeroes.length);
// });
