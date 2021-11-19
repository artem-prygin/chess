import { ColumnNames } from '../enum/column-names.enum';
import { FigureTypeEnum } from '../enum/figure-type.enum';
import { WhiteBlackEnum } from '../enum/white-black.enum';

export interface IFigure {
    id: number;
    color: WhiteBlackEnum;
    type: FigureTypeEnum;
    column: ColumnNames;
    row: number;
    active: boolean;
    underCheck?: boolean;
    movesCount?: number;
}
