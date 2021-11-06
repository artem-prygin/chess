import { createAction, props } from '@ngrx/store';
import { IFigure } from '../models/figure.interface';
import { ColumnNames } from '../enum/column-names.enum';

export const testAction = createAction(
    'testAction',
);

export const moveFigure = createAction(
    'Move Figure',
    props<{ figure: IFigure; column: ColumnNames; row: number }>(),
);
