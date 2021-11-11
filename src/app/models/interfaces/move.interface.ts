import { ColumnNames } from '../enum/column-names.enum';
import { CastlingMoveTypeEnum } from '../enum/castling-move-type.enum';

export interface IMove {
    column: ColumnNames;
    row: number;
    isEnPassantMove?: boolean;
    isPawnPromotionMove?: boolean;
    castlingMoveType?: CastlingMoveTypeEnum;
    isCheck?: boolean;
    isMate?: boolean;
}
