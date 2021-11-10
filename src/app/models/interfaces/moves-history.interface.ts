import { ColumnNames } from '../enum/column-names.enum';
import { FigureTypeEnum } from '../enum/figure-type.enum';
import { CastlingMoveTypeEnum } from '../enum/castling-move-type.enum';

export interface IMovesHistory {
    moveNumber: number;
    type: FigureTypeEnum;
    currentColumn: ColumnNames;
    currentRow: number;
    prevColumn?: ColumnNames;
    prevRow?: number;
    castlingMoveType?: CastlingMoveTypeEnum;
    eatenFigure?: boolean;
    isCheck?: boolean;
    isMate?: boolean;
}
