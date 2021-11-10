import { ColumnNames } from '../enum/column-names.enum';
import { CastlingMoveTypeEnum } from '../enum/castling-move-type.enum';

export interface IFieldPosition {
    column: ColumnNames;
    row: number;
    enPassantMove?: boolean;
    pawnPromotionMove?: boolean;
    castlingMoveType?: CastlingMoveTypeEnum;
}
