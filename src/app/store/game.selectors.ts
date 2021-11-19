import { createSelector } from '@ngrx/store';
import { AppState } from './index';
import { WhiteBlackEnum } from '../models/enum/white-black.enum';

export const getGameState = (state: AppState) => state.game;

export const selectActiveFigures = createSelector(
    getGameState,
    ({ figures }) => figures.filter((f) => f.active),
);

export const selectTakenFigures = (color: WhiteBlackEnum) => createSelector(
    getGameState,
    ({ figures }) => figures
        .filter((f) => !f.active && f.color === color)
        .sort((a, b) => a.type - b.type),
);

export const selectCurrentTurn = createSelector(
    getGameState,
    ({ currentTurn }) => currentTurn,
);

export const selectCurrentTurnString = createSelector(
    getGameState,
    ({ currentTurn }) => WhiteBlackEnum.getStringValue(currentTurn),
);

export const selectMoves = createSelector(
    getGameState,
    ({ moves }) => moves,
);

export const selectLastMove = createSelector(
    getGameState,
    ({ moves }) => moves && moves[moves.length - 1],
);
