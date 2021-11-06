import { GameState } from './game.state';
import { WhiteBlackEnum } from '../enum/white-black.enum';
import { FigureTypeEnum } from '../enum/figure-type.enum';
import { ColumnNames } from '../enum/column-names.enum';
import { createReducer, on } from '@ngrx/store';
import * as gameActions from './game.actions';

const initialState: GameState = {
    figures: [
        {
            id: 1,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.A,
            row: 2,
            active: true,
        },
        {
            id: 2,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.B,
            row: 2,
            active: true,
        },
        {
            id: 3,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.C,
            row: 2,
            active: true,
        },
        {
            id: 4,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.D,
            row: 2,
            active: true,
        },
        {
            id: 5,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.E,
            row: 2,
            active: true,
        },
        {
            id: 6,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.F,
            row: 2,
            active: true,
        },
        {
            id: 7,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.G,
            row: 2,
            active: true,
        },
        {
            id: 8,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.H,
            row: 2,
            active: true,
        },
        {
            id: 9,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.ROOK,
            column: ColumnNames.A,
            row: 1,
            active: true,
        },
        {
            id: 10,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.ROOK,
            column: ColumnNames.H,
            row: 1,
            active: true,
        },
        {
            id: 11,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.KNIGHT,
            column: ColumnNames.B,
            row: 1,
            active: true,
        },
        {
            id: 12,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.KNIGHT,
            column: ColumnNames.G,
            row: 1,
            active: true,
        },
        {
            id: 13,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.BISHOP,
            column: ColumnNames.C,
            row: 1,
            active: true,
        },
        {
            id: 14,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.BISHOP,
            column: ColumnNames.F,
            row: 1,
            active: true,
        },
        {
            id: 15,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.QUEEN,
            column: ColumnNames.D,
            row: 1,
            active: true,
        },
        {
            id: 16,
            color: WhiteBlackEnum.WHITE,
            type: FigureTypeEnum.KING,
            column: ColumnNames.E,
            row: 1,
            active: true,
        },
        {
            id: 17,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.A,
            row: 7,
            active: true,
        },
        {
            id: 18,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.B,
            row: 7,
            active: true,
        },
        {
            id: 19,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.C,
            row: 7,
            active: true,
        },
        {
            id: 20,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.D,
            row: 7,
            active: true,
        },
        {
            id: 21,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.E,
            row: 7,
            active: true,
        },
        {
            id: 22,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.F,
            row: 7,
            active: true,
        },
        {
            id: 23,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.G,
            row: 7,
            active: true,
        },
        {
            id: 24,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.PAWN,
            column: ColumnNames.H,
            row: 7,
            active: true,
        },
        {
            id: 25,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.ROOK,
            column: ColumnNames.A,
            row: 8,
            active: true,
        },
        {
            id: 26,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.ROOK,
            column: ColumnNames.H,
            row: 8,
            active: true,
        },
        {
            id: 27,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.KNIGHT,
            column: ColumnNames.B,
            row: 8,
            active: true,
        },
        {
            id: 28,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.KNIGHT,
            column: ColumnNames.G,
            row: 8,
            active: true,
        },
        {
            id: 29,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.BISHOP,
            column: ColumnNames.C,
            row: 8,
            active: true,
        },
        {
            id: 30,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.BISHOP,
            column: ColumnNames.F,
            row: 8,
            active: true,
        },
        {
            id: 31,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.QUEEN,
            column: ColumnNames.D,
            row: 8,
            active: true,
        },
        {
            id: 32,
            color: WhiteBlackEnum.BLACK,
            type: FigureTypeEnum.KING,
            column: ColumnNames.E,
            row: 8,
            active: true,
        },
    ],
    currentTurn: WhiteBlackEnum.WHITE,
    moves: [],
};

export const GameReducer = createReducer(
    initialState,
    on(gameActions.moveFigure, (state, { figure, column, row }) => {
        const prevColumn = figure.column;
        const prevRow = figure.row;
        const eatenFigure = [...state.figures]
            .find((f) => f.column === column && f.row === row);
        return {
            currentTurn: state.currentTurn === WhiteBlackEnum.WHITE ? WhiteBlackEnum.BLACK : WhiteBlackEnum.WHITE,
            moves: [...state.moves, `${prevColumn}${prevRow}-${column}${row}`],
            figures: [...state.figures].map((f) => {
                if (f.id === eatenFigure?.id) {
                    return { ...f, column: null, row: null, active: false };
                }

                if (f.id === figure.id) {
                    return { ...f, column: column, row: row };
                }

                return f;
            }),
        };
    }),
);
