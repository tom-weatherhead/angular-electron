// github:tom-weatherhead/angular-electron/src/app/app.module.ts

// **** Modules ****
import { CommonModule } from '@angular/common';
import { NgModule /*, CUSTOM_ELEMENTS_SCHEMA */ } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientModule } from '@angular/common/http';

// FormsModule must be present in order for ngModel to work.
// See https://stackoverflow.com/questions/43298011/angular-4-cant-bind-to-ngmodel-since-it-isnt-a-known-property-of-input
import {
	FormsModule // ,
	// ReactiveFormsModule
} from '@angular/forms';

// Import the modules for all ng-bootstrap components:

// import {
// 	NgbModule
// } from '@ng-bootstrap/ng-bootstrap';

// Import only the modules for specified ng-bootstrap components:

import {
	NgbButtonsModule,
	NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';

import { HttpJsonClientModule } from 'thaw-angular-service-library';

import { AppRoutingModule } from './app-routing.module';

// **** Services ****
import { ConfigurationService } from './services/configuration/configuration.service';
import { ElectronService } from './services/electron/electron.service';
import { FileService } from './services/file/file.service';
import { LoggerService } from './services/logger/logger.service';
import { MessageService } from './services/message/message.service';

// **** Components ****
import { AppComponent } from './components/app/app.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { BasicCanvasComponent } from './components/basic-canvas/basic-canvas.component';
import { PaletteComponent } from './components/palette/palette.component';

@NgModule({
	// schemas: [
	// 	// CUSTOM_ELEMENTS_SCHEMA
	// ],
	imports: [
		AppRoutingModule,
		BrowserModule,
		CommonModule,
		FormsModule, // Required in order for ngModel to work.
		// ReactiveFormsModule,
		// HttpClientModule,
		// JsonpModule,

		// NgbModule,
		// NgbModule.forRoot(),
		NgbButtonsModule,
		NgbDropdownModule,

		// Service modules from thaw-angular-service-library
		HttpJsonClientModule
	],
	declarations: [
		AppComponent,

		// Page components
		DashboardComponent,

		// BasicCanvasComponent,

		PaletteComponent
	],
	providers: [
		ConfigurationService,
		ElectronService,
		FileService,
		LoggerService,
		MessageService
	],
	// exports: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
