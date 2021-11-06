import { createSelector } from '@ngrx/store';
import { AppState } from './index';

export const getGameState = (state: AppState) => state.game;

export const selectActiveFigures = createSelector(
    getGameState,
    ({ figures }) => figures.filter((f) => f.active),
);

export const selectCurrentTurn = createSelector(
    getGameState,
    ({ currentTurn }) => currentTurn,
);
