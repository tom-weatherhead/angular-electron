// angular-electron/src/app/components/app/app.component.spec.ts

// import { NgModule } from '@angular/core';

// To re-enable async testing, uncomment this line in src/test.ts :
// // import 'zone.js/dist/zone-testing';
// Then restore the import and usage of 'async' in every .spec.ts file

import {
	ComponentFixture,
	TestBed,
	waitForAsync
} from '@angular/core/testing';

import { FormsModule /*, ReactiveFormsModule */ } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';

// RouterTestingModule : See https://stackoverflow.com/questions/41252496/router-outlet-is-not-a-known-element
import { RouterTestingModule } from '@angular/router/testing';

// import {
// 	NgbModule //,
// 	// NgbDropdownModule,
// 	// NgbDropdown
// } from '@ng-bootstrap/ng-bootstrap';

// import {
// 	ElectronService
// } from '../../services/electron/electron.service';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
	let fixture: ComponentFixture<AppComponent>;
	let app: AppComponent;
	let nativeElement: Element;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [
					BrowserModule,
					// HttpClientModule,
					FormsModule, // For e.g. NgModel
					// ReactiveFormsModule,
					RouterTestingModule // ,
					// JsonpModule,
					// NgbModule.forRoot()
					// NgbModule
					// NgbDropdownModule
				],
				declarations: [AppComponent],
				providers: [
					// ElectronService
				]
			})
				.compileComponents() // compileComponents() is asynchronous
				.then(() => {
					fixture = TestBed.createComponent(AppComponent);
					// app = fixture.debugElement.componentInstance;
					app = fixture.componentInstance;
					// nativeElement = fixture.debugElement.nativeElement;
					nativeElement = fixture.nativeElement;
					fixture.detectChanges();
				});
		})
	);

	it('should create the app', () => {
		expect(app).toBeDefined();
	});

	// Test the value of a field in the component object:

	// it(`should have 'angular-electron' as app.title`, () => {
	// 	expect(app.title).toEqual('angular-electron');
	// });

	// Test using a CSS selector:

	it('should render the app name in a specific div tag', () => {
		expect(
			nativeElement.querySelector('div.sidebar-heading').textContent
		).toEqual('angular-electron');
	});

	it('should display 10 links in the sidebar', () => {
		expect(
			nativeElement.querySelectorAll('#sidebar-wrapper a').length
		).toEqual(3);
	});

	it('should display 1 router-outlet', () => {
		expect(
			nativeElement.querySelectorAll('router-outlet').length
		).toEqual(1);
	});
});
