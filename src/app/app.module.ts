import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducerProvider, REDUCERS_TOKEN } from './store';
import { BoardComponent } from './components/game/board/board.component';
import { MovesHistoryComponent } from './components/game/moves-history/moves-history.component';
import { MoveDisplay } from './core/pipes/move-display';
import { GameComponent } from './components/game/game.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PawnPromotionComponent } from './components/game/pawn-promotion/pawn-promotion.component';

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        BoardComponent,
        MovesHistoryComponent,
        MoveDisplay,
        PawnPromotionComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        StoreModule.forRoot(REDUCERS_TOKEN),
        StoreDevtoolsModule.instrument({
            maxAge: 50,
        }),
        BrowserAnimationsModule,
        MatDialogModule,
        // EffectsModule.forRoot([...])
    ],
    entryComponents: [

    ],
    providers: [
        reducerProvider,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
