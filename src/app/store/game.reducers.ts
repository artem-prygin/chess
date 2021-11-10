import { initialState } from './game.state';
import { WhiteBlackEnum } from '../models/enum/white-black.enum';
import { FigureTypeEnum } from '../models/enum/figure-type.enum';
import { ColumnNames } from '../models/enum/column-names.enum';
import { createReducer, on } from '@ngrx/store';
import * as gameActions from './game.actions';
import { GameConstants } from '../models/constants/game-constants';
import { LocalStorageService } from '../core/services/local-storage-service';
import { IMovesHistory } from '../models/interfaces/moves-history.interface';
import { IFigure } from '../models/interfaces/figure.interface';
import { CastlingMoveTypeEnum } from '../models/enum/castling-move-type.enum';

export const GameReducer = createReducer(
    JSON.parse(LocalStorageService.getItem('game')) || initialState,
    on(gameActions.moveFigure, (state, { figure, move }) => {
        const { type, column: prevColumn, row: prevRow } = figure;
        const { column: currentColumn, row: currentRow } = move;

        const eatenFigure: IFigure = [...state.figures]
            .find((f) => f.column === currentColumn && f.row === currentRow);

        const moveNumber: number = state.moves.length > 0
            ? state.moves[state.moves.length - 1].moveNumber + 1
            : 1;
        const newMove: IMovesHistory = { moveNumber, type, prevColumn, prevRow, currentColumn, currentRow };
        const currentTurn: WhiteBlackEnum = switchTurn(state.currentTurn);

        const figures: IFigure[] = [...state.figures].map((f) => {
            if (f.id !== figure.id && f.id !== eatenFigure?.id) {
                return f;
            }

            const movesHistory: IMovesHistory[] = [...f.movesHistory];

            if (f.id === eatenFigure?.id) {
                movesHistory.push({
                    type,
                    moveNumber,
                    prevColumn: eatenFigure.column,
                    prevRow: eatenFigure.row,
                    currentColumn: null,
                    currentRow: null,
                });

                return {
                    ...f,
                    column: null,
                    row: null,
                    active: false,
                    movesHistory,
                };
            }

            if (f.id === figure.id) {
                if (f.type === FigureTypeEnum.PAWN && f.color === WhiteBlackEnum.WHITE && currentRow === GameConstants.MAX_ROW_COLUMN
                    || f.type === FigureTypeEnum.PAWN && f.color === WhiteBlackEnum.BLACK && currentRow === 1) {
                    movesHistory.push({
                        type,
                        moveNumber,
                        prevColumn,
                        prevRow,
                        currentColumn,
                        currentRow,
                    });

                    return {
                        ...f,
                        type: FigureTypeEnum.QUEEN,
                        column: currentColumn,
                        row: currentRow,
                        movesHistory,
                    };
                }

                movesHistory.push({
                    type,
                    moveNumber,
                    prevColumn,
                    prevRow,
                    currentColumn,
                    currentRow,
                });

                return {
                    ...f,
                    column: currentColumn,
                    row: currentRow,
                    movesHistory,
                };
            }
        });

        const moves: IMovesHistory[] = [...state.moves, newMove];
        const gameInfo = { currentTurn, moves, figures };
        LocalStorageService.setItem('game', JSON.stringify(gameInfo));
        return gameInfo;
    }),
    on(gameActions.makePawnPromotionMove, (state, { pawn, move }) => {
        const { type, column: prevColumn, row: prevRow } = pawn;
        const { column: currentColumn, row: currentRow } = move;

        const eatenFigure: IFigure = [...state.figures]
            .find((f) => f.column === currentColumn && f.row === currentRow);

        const moveNumber: number = state.moves[state.moves.length - 1].moveNumber + 1;
        const newMove: IMovesHistory = { moveNumber, type, prevColumn, prevRow, currentColumn, currentRow };

        const figures: IFigure[] = [...state.figures].map((f) => {
            if (f.id !== pawn.id && f.id !== eatenFigure?.id) {
                return f;
            }

            const movesHistory: IMovesHistory[] = [...f.movesHistory];

            if (f.id === eatenFigure?.id) {
                movesHistory.push({
                    type,
                    moveNumber,
                    prevColumn: eatenFigure.column,
                    prevRow: eatenFigure.row,
                    currentColumn: null,
                    currentRow: null,
                });

                return {
                    ...f,
                    column: null,
                    row: null,
                    active: false,
                    movesHistory,
                };
            }

            if (f.id === pawn.id) {
                movesHistory.push({
                    type,
                    moveNumber,
                    prevColumn,
                    prevRow,
                    currentColumn,
                    currentRow,
                });

                return {
                    ...f,
                    type: FigureTypeEnum.QUEEN,
                    column: currentColumn,
                    row: currentRow,
                    movesHistory,
                };
            }
        });

        const currentTurn: WhiteBlackEnum = switchTurn(state.currentTurn);
        const moves: IMovesHistory[] = [...state.moves, newMove];
        const gameInfo = { currentTurn, moves, figures };
        LocalStorageService.setItem('game', JSON.stringify(gameInfo));
        return gameInfo;
    }),
    on(gameActions.makeEnPassantMove, (state, { pawn, move }) => {
        const { type, column: prevColumn, row: prevRow } = pawn;
        const { column: currentColumn, row: currentRow } = move;

        const eatenPawn: IFigure = [...state.figures]
            .find((f) => f.column === currentColumn && f.row === prevRow);

        const moveNumber: number = state.moves[state.moves.length - 1].moveNumber + 1;
        const newMove: IMovesHistory = { moveNumber, type, prevColumn, prevRow, currentColumn, currentRow };
        const moves: IMovesHistory[] = [...state.moves, newMove];
        const currentTurn: WhiteBlackEnum = switchTurn(state.currentTurn);

        const figures: IFigure[] = [...state.figures].map((f) => {
            if (f.id !== pawn.id && f.id !== eatenPawn?.id) {
                return f;
            }

            const movesHistory: IMovesHistory[] = [...f.movesHistory];

            if (f.id === eatenPawn?.id) {
                movesHistory.push({
                    type,
                    moveNumber,
                    prevColumn: eatenPawn.column,
                    prevRow: eatenPawn.row,
                    currentColumn: null,
                    currentRow: null,
                });

                return {
                    ...f,
                    column: null,
                    row: null,
                    active: false,
                    movesHistory,
                };
            }

            if (f.id === pawn.id) {
                movesHistory.push({
                    type,
                    moveNumber,
                    prevColumn,
                    prevRow,
                    currentColumn,
                    currentRow,
                });

                return {
                    ...f,
                    column: currentColumn,
                    row: currentRow,
                    movesHistory,
                };
            }
        });

        const gameInfo = { currentTurn, moves, figures };
        LocalStorageService.setItem('game', JSON.stringify(gameInfo));
        return gameInfo;
    }),
    on(gameActions.makeCastling, (state, { king, move }) => {
        const { type, column: prevColumn, row: prevRow } = king;
        const { column: currentColumn, row: currentRow, castlingMoveType } = move;

        const moveNumber: number = state.moves[state.moves.length - 1].moveNumber + 1;
        const newMove: IMovesHistory = {
            moveNumber,
            type,
            prevColumn,
            prevRow,
            currentColumn,
            currentRow,
            castlingMoveType,
        };
        const moves: IMovesHistory[] = [...state.moves, newMove];
        const rookColumn = castlingMoveType === CastlingMoveTypeEnum.SHORT
            ? ColumnNames.H
            : ColumnNames.A;
        const rook = [...state.figures]
            .find((f) => f.type === FigureTypeEnum.ROOK
                && f.color === state.currentTurn
                && f.movesHistory.length === 0
                && f.column === rookColumn);

        const figures: IFigure[] = [...state.figures].map((f) => {
            if (f.id !== king.id && f.id !== rook.id) {
                return f;
            }

            const movesHistory: IMovesHistory[] = [...f.movesHistory];

            if (f.id === king.id) {
                movesHistory.push({
                    type,
                    moveNumber,
                    prevColumn,
                    prevRow,
                    currentColumn,
                    currentRow,
                    castlingMoveType,
                });

                return {
                    ...f,
                    column: currentColumn,
                    row: currentRow,
                    movesHistory,
                };
            }

            if (f.id === rook.id) {
                movesHistory.push({
                    type: FigureTypeEnum.ROOK,
                    moveNumber,
                    prevColumn: rook.column,
                    prevRow: rook.row,
                    currentColumn: castlingMoveType === CastlingMoveTypeEnum.SHORT
                        ? rook.column - 2
                        : rook.column + 3,
                    currentRow: rook.row,
                    castlingMoveType,
                });

                return {
                    ...f,
                    column: castlingMoveType === CastlingMoveTypeEnum.SHORT
                        ? rook.column - 2
                        : rook.column + 3,
                    row: rook.row,
                    movesHistory,
                };
            }
        });

        const currentTurn: WhiteBlackEnum = switchTurn(state.currentTurn);
        const gameInfo = { currentTurn, moves, figures };
        LocalStorageService.setItem('game', JSON.stringify(gameInfo));
        return gameInfo;
    }),
    on(gameActions.undoMove, (state) => {
        const lastMoveNumber: number = [...state.moves].pop()?.moveNumber;
        if (!lastMoveNumber) {
            return {
                ...state,
            };
        }
        const moves: IMovesHistory[] = [...state.moves].slice(0, -1);
        const figures: IFigure[] = [...state.figures].map((f) => {
            if (f.movesHistory.length > 0 && [...f.movesHistory].pop().moveNumber === lastMoveNumber) {
                const { prevColumn: column, prevRow: row } = [...f.movesHistory].pop();
                const movesHistory = [...f.movesHistory].slice(0, -1);
                return {
                    ...f,
                    column,
                    row,
                    movesHistory,
                    active: true,
                };
            }

            return f;
        });

        const currentTurn: WhiteBlackEnum = switchTurn(state.currentTurn);
        const gameInfo = { currentTurn, moves, figures };
        LocalStorageService.setItem('game', JSON.stringify(gameInfo));
        return gameInfo;
    }),
    on(gameActions.resetGame, () => {
        LocalStorageService.removeItem('game');
        return initialState;
    }),
);

const switchTurn = (currentTurn: WhiteBlackEnum): WhiteBlackEnum => {
    return currentTurn === WhiteBlackEnum.WHITE
        ? WhiteBlackEnum.BLACK
        : WhiteBlackEnum.WHITE;
};
