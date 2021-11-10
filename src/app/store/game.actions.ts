import { createAction, props } from '@ngrx/store';
import { IFigure } from '../models/interfaces/figure.interface';
import { IFieldPosition } from '../models/interfaces/field-position.interface';

export const moveFigure = createAction(
    'Move Figure',
    props<{ figure: IFigure; move: IFieldPosition }>(),
);

export const makeCastling = createAction(
    'Make Castling',
    props<{ king: IFigure; move: IFieldPosition }>(),
);

export const makeEnPassantMove = createAction(
    'Make En Passant Move',
    props<{ pawn: IFigure; move: IFieldPosition }>(),
);

export const makePawnPromotionMove = createAction(
    'Make Pawn Promotion Move',
    props<{ pawn: IFigure; move: IFieldPosition }>(),
);

export const resetGame = createAction(
    'Reset Game',
);

export const undoMove = createAction(
    'Undo Move',
);
