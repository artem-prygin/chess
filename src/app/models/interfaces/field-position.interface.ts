import { ColumnNames } from '../enum/column-names.enum';
import { FigureTypeEnum } from '../enum/figure-type.enum';

export interface IFieldPosition {
    column: ColumnNames;
    row: number;
    figureID?: number;
    figureType?: FigureTypeEnum;
}
