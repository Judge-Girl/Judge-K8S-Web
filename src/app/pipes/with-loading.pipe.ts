import {Pipe, PipeTransform} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, startWith} from 'rxjs/operators';


export interface Loading<T> {
  loading?: boolean;
  value?: T;
  error?: any;
}

const defaultError = 'Something went wrong';

/**
 * Reference: https://medium.com/angular-in-depth/angular-show-loading-indicator-when-obs-async-is-not-yet-resolved-9d8e5497dd8
 */
@Pipe({
  name: 'withLoading',
})
export class WithLoadingPipe implements PipeTransform {
  transform<T = any>(val: Observable<T>): Observable<Loading<T>> {
    return val.pipe(
      map((value: any) => {
        return {
          loading: value.type === 'start',
          error: value.type === 'error' ? defaultError : '',
          value: value.type ? value.value : value,
        };
      }),
      startWith({ loading: true }),
      catchError(error => of({ loading: false, error: error.message }))
    );
  }
}
