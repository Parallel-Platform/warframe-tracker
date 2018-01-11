import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CommaSeparatePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'commaSeparate',
})
export class CommaSeparatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value:number, exponent: string) : any {
   return value.toLocaleString();
  }
}
