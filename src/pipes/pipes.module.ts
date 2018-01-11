import { NgModule } from '@angular/core';
import { CommaSeparatePipe } from './comma-separate/comma-separate';
@NgModule({
	declarations: [CommaSeparatePipe],
	imports: [],
	exports: [CommaSeparatePipe]
})
export class PipesModule {}
