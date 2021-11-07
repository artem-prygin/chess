import { createAction, props } from '@ngrx/store';
import { IFigure } from '../models/figure.interface';
import { IFieldPosition } from '../models/field-position.interface';

export const testAction = createAction(
    'testAction',
);

export const moveFigure = createAction(
    'Move Figure',
    props<{ figure: IFigure; move: IFieldPosition }>(),
);

export const resetGame = createAction(
    'Reset Game',
);
