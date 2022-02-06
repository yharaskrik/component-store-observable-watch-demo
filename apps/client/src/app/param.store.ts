import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  distinctUntilKeyChanged,
  filter,
  interval,
  map,
  Observable,
  tap,
} from 'rxjs';

export interface ParamState {
  time?: Date;
}

@Injectable()
export class ParamStore extends ComponentStore<ParamState> {
  /*
   * Just an interval that will emit once a second, so we have some recurring to watch for.
   */
  readonly interval$ = interval(1000);

  /*
   * The component store property selector, this will just be used to display in the UI
   */
  readonly time$ = this.select((state) => state.time);

  /*
   * An Observable that will emit whenever the `time` query param changes.
   */
  readonly timeParam$: Observable<string> = this._route.queryParams.pipe(
    // distinctUntilKeyChanged makes sure that our observable won't emit unless it was `time` that changed
    distinctUntilKeyChanged('time'),
    map((params) => params['time'])
  );

  /*
   * This is the first way we can configure an `effect` to always be listening to an observable without needing to call
   * the `effect` like a method like we see in the example here: https://ngrx.io/guide/component-store/effect
   *
   * This subscription will also be automatically cleaned up when the ComponentStore is destroyed.
   */
  readonly intervalParamUpdate$ = this.effect(() =>
    this.interval$.pipe(
      tap(() =>
        /*
         * Whenever the interval ticks update the `time` query param with the current date. this should then trigger
         * the `timeParam$` observable.
         */
        this._router.navigate([], {
          queryParams: { time: new Date().toISOString() },
        })
      )
    )
  );

  /*
   * An effect setup to update the state of the component store with whatever the value of our `time` query param is
   */
  readonly updateStateFromParam$ = this.effect(
    (timeParam$: Observable<string>) =>
      timeParam$.pipe(
        tap((time) => console.log(time)),
        filter((time) => !!time),
        tap((time) =>
          this.patchState({
            time: new Date(time),
          })
        )
      )
  );

  constructor(private _route: ActivatedRoute, private _router: Router) {
    super({});

    /*
     * The second way we can set up an effect to always be listening to a hot observable (you can also call this
     * with a cold observable if you want).
     *
     * ComponentStore effects can be called with either a value (which is then wrapped in an observable) or an observable
     * which is just passed into the effect. When you call an effect with a hot observable the effect will keep being
     * called for every emission of the `timeParam`.
     *
     * This subscription will also be automatically cleaned up when the ComponentStore is destroyed.
     */
    this.updateStateFromParam$(this.timeParam$);
  }
}
