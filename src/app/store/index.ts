import { GameState } from './game.state';
import { ActionReducerMap } from '@ngrx/store';
import { GameReducer } from './game.reducers';
import { InjectionToken } from '@angular/core';

export interface AppState {
    game: GameState;
}

export const appReducers: ActionReducerMap<AppState> = {
    game: GameReducer,
};

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<AppState>>('Registered Reducers');

export const reducerProvider = [
    { provide: REDUCERS_TOKEN, useValue: appReducers },
];
