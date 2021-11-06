import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducerProvider, REDUCERS_TOKEN } from './store';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        StoreModule.forRoot(REDUCERS_TOKEN),
        StoreDevtoolsModule.instrument({
            maxAge: 50,
        }),
        // EffectsModule.forRoot([...])
    ],
    providers: [
        reducerProvider,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
