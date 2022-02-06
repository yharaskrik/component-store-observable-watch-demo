import { Component } from '@angular/core';
import { ParamStore } from './param.store';

@Component({
  selector: 'component-store-observable-watch-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly time$ = this.paramStore.time$;

  constructor(private paramStore: ParamStore) {}
}
