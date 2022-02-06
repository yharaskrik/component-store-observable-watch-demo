An example showing how to use NgRx Component store with observables to set them up to always be listening to observables, hot or cold.

If you have some observable (like a `webSocket`) or something else you can set up a `ComponentStore` to listen to that observable whether
you know the observable at store creation time or at some later time.

Technology:
NgRx ComponentStore
Angular
RxJs

References:
https://ngrx.io/guide/component-store/effect

Running:

`yarn nx serve` then go to `http://localhost:4200`
