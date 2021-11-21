import { CastlingMoveTypeEnum } from '../enum/castling-move-type.enum';
import { IFieldPosition } from './field-position.interface';

export interface IMovesHistory {
    moveNumber: number;
    prevPosition: IFieldPosition[];
    currentPosition: IFieldPosition[];
    castlingMoveType?: CastlingMoveTypeEnum;
    isEatenFigureMove?: boolean;
    isPawnPromotionMove?: boolean;
    isEnPassantMove?: boolean;
    isCheck?: boolean;
    isMate?: boolean;
    isStaleMate?: boolean;
}
