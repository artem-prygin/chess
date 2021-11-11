import { createAction, props } from '@ngrx/store';
import { IFigure } from '../models/interfaces/figure.interface';
import { IMove } from '../models/interfaces/move.interface';
import { FigureTypeEnum } from '../models/enum/figure-type.enum';

export const moveFigure = createAction(
    'Move Figure',
    props<{ figure: IFigure; move: IMove }>(),
);

export const makeCastling = createAction(
    'Make Castling',
    props<{ king: IFigure; move: IMove }>(),
);

export const makeEnPassantMove = createAction(
    'Make En Passant Move',
    props<{ pawn: IFigure; move: IMove }>(),
);

export const makePawnPromotionMove = createAction(
    'Make Pawn Promotion Move',
    props<{ pawn: IFigure; move: IMove, promotedType: FigureTypeEnum }>(),
);

export const resetGame = createAction(
    'Reset Game',
);

export const undoMove = createAction(
    'Undo Move',
);
