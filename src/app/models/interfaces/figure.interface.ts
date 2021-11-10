import { ColumnNames } from '../enum/column-names.enum';
import { FigureTypeEnum } from '../enum/figure-type.enum';
import { WhiteBlackEnum } from '../enum/white-black.enum';
import { IMovesHistory } from './moves-history.interface';

export interface IFigure {
    id: number;
    color: WhiteBlackEnum;
    type: FigureTypeEnum;
    column: ColumnNames;
    row: number;
    active: boolean;
    movesHistory: IMovesHistory[];
    underCheck?: boolean;
}
