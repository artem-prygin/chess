import { GameState } from './game.state';
import { WhiteBlackEnum } from '../enum/white-black.enum';
import { FigureTypeEnum } from '../enum/figure-type.enum';
import { ColumnNames } from '../enum/column-names.enum';
import { createReducer, on } from '@ngrx/store';
import * as gameActions from './game.actions';
import { GameConstants } from '../constants/game-constants';
import { LocalStorageService } from '../services/local-storage-service';
import { IMovesHistory } from '../models/moves-history.interface';
import { IFigure } from '../models/figure.interface';

const initialState: GameState = {
    figures: [
        {
            id: 1,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.A,
            row: 2,
            active: true,
            movesHistory: [],
        },
        {
            id: 2,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.B,
            row: 2,
            active: true,
            movesHistory: [],
        },
        {
            id: 3,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.C,
            row: 2,
            active: true,
            movesHistory: [],
        },
        {
            id: 4,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.D,
            row: 2,
            active: true,
            movesHistory: [],
        },
        {
            id: 5,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.E,
            row: 2,
            active: true,
            movesHistory: [],
        },
        {
            id: 6,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.F,
            row: 2,
            active: true,
            movesHistory: [],
        },
        {
            id: 7,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.G,
            row: 2,
            active: true,
            movesHistory: [],
        },
        {
            id: 8,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.H,
            row: 2,
            active: true,
            movesHistory: [],
        },
        {
            id: 9,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.ROOK,
            column: ColumnNames.A,
            row: 1,
            active: true,
            movesHistory: [],
        },
        {
            id: 10,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.ROOK,
            column: ColumnNames.H,
            row: 1,
            active: true,
            movesHistory: [],
        },
        {
            id: 11,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.KNIGHT,
            column: ColumnNames.B,
            row: 1,
            active: true,
            movesHistory: [],
        },
        {
            id: 12,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.KNIGHT,
            column: ColumnNames.G,
            row: 1,
            active: true,
            movesHistory: [],
        },
        {
            id: 13,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.BISHOP,
            column: ColumnNames.C,
            row: 1,
            active: true,
            movesHistory: [],
        },
        {
            id: 14,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.BISHOP,
            column: ColumnNames.F,
            row: 1,
            active: true,
            movesHistory: [],
        },
        {
            id: 15,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.QUEEN,
            column: ColumnNames.D,
            row: 1,
            active: true,
            movesHistory: [],
        },
        {
            id: 16,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.KING,
            column: ColumnNames.E,
            row: 1,
            active: true,
            movesHistory: [],
        },
        {
            id: 17,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.A,
            row: 7,
            active: true,
            movesHistory: [],
        },
        {
            id: 18,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.B,
            row: 7,
            active: true,
            movesHistory: [],
        },
        {
            id: 19,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.C,
            row: 7,
            active: true,
            movesHistory: [],
        },
        {
            id: 20,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.D,
            row: 7,
            active: true,
            movesHistory: [],
        },
        {
            id: 21,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.E,
            row: 7,
            active: true,
            movesHistory: [],
        },
        {
            id: 22,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.F,
            row: 7,
            active: true,
            movesHistory: [],
        },
        {
            id: 23,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.G,
            row: 7,
            active: true,
            movesHistory: [],
        },
        {
            id: 24,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.H,
            row: 7,
            active: true,
            movesHistory: [],
        },
        {
            id: 25,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.ROOK,
            column: ColumnNames.A,
            row: 8,
            active: true,
            movesHistory: [],
        },
        {
            id: 26,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.ROOK,
            column: ColumnNames.H,
            row: 8,
            active: true,
            movesHistory: [],
        },
        {
            id: 27,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.KNIGHT,
            column: ColumnNames.B,
            row: 8,
            active: true,
            movesHistory: [],
        },
        {
            id: 28,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.KNIGHT,
            column: ColumnNames.G,
            row: 8,
            active: true,
            movesHistory: [],
        },
        {
            id: 29,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.BISHOP,
            column: ColumnNames.C,
            row: 8,
            active: true,
            movesHistory: [],
        },
        {
            id: 30,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.BISHOP,
            column: ColumnNames.F,
            row: 8,
            active: true,
            movesHistory: [],
        },
        {
            id: 31,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.QUEEN,
            column: ColumnNames.D,
            row: 8,
            active: true,
            movesHistory: [],
        },
        {
            id: 32,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.KING,
            column: ColumnNames.E,
            row: 8,
            active: true,
            movesHistory: [],
        },
    ],
    currentTurn: WhiteBlackEnum.WHITE,
    moves: [],
};

export const GameReducer = createReducer(
    JSON.parse(LocalStorageService.getItem('game')) || initialState,
    on(gameActions.moveFigure, (state, { figure, move }) => {
        const { type, column: prevColumn, row: prevRow } = figure;
        const { column: currentColumn, row: currentRow, enPassantMove } = move;

        const eatenFigure: IFigure = enPassantMove
            ? [...state.figures]
                .find((f) => f.column === currentColumn && f.row === prevRow)
            : [...state.figures]
                .find((f) => f.column === currentColumn && f.row === currentRow);

        const movesLength: number = state.moves.length;
        const moveNumber: number = movesLength > 0
            ? state.moves[movesLength - 1].moveNumber + 1
            : 1;
        const newMove: IMovesHistory = { moveNumber, type, prevColumn, prevRow, currentColumn, currentRow };
        const moves: IMovesHistory[] = [...state.moves, newMove];
        const currentTurn: WhiteBlackEnum = state.currentTurn === WhiteBlackEnum.WHITE
            ? WhiteBlackEnum.BLACK
            : WhiteBlackEnum.WHITE;

        const figures: IFigure[] = [...state.figures].map((f) => {
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

            return f;
        });

        const gameInfo = { currentTurn, moves, figures };
        LocalStorageService.setItem('game', JSON.stringify(gameInfo));
        return gameInfo;
    }),
    on(gameActions.resetGame, () => {
        LocalStorageService.removeItem('game');
        return initialState;
    }),
    on(gameActions.undoMove, (state) => {
        const lastMoveNumber: number = [...state.moves].pop()?.moveNumber;
        if (!lastMoveNumber) {
            return {
                ...state,
            };
        }
        const moves: IMovesHistory[] = [...state.moves].slice(0, -1);
        const currentTurn: WhiteBlackEnum = state.currentTurn === WhiteBlackEnum.WHITE
            ? WhiteBlackEnum.BLACK
            : WhiteBlackEnum.WHITE;
        const figures: IFigure[] = [...state.figures].map((f) => {
            if (f.movesHistory.length > 0 && [...f.movesHistory].pop().moveNumber === lastMoveNumber) {
                console.log(f);
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

        const gameInfo = { currentTurn, moves, figures };
        LocalStorageService.setItem('game', JSON.stringify(gameInfo));
        return gameInfo;
    }),
);
