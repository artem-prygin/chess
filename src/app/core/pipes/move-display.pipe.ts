import { Pipe, PipeTransform } from '@angular/core';
import { IMovesHistory } from '../../models/interfaces/moves-history.interface';
import { ColumnNames } from '../../models/enum/column-names.enum';
import { FigureTypeEnum } from '../../models/enum/figure-type.enum';
import { CastlingMoveTypeEnum } from '../../models/enum/castling-move-type.enum';

@Pipe({
    name: 'printMove',
})
export class MoveDisplayPipe implements PipeTransform {
    transform(move: IMovesHistory): string {
        // const type = FigureTypeEnum.getFigureAlias(move.type);
        // const prevPosition = ColumnNames.getLetter(move.prevColumn) + move.prevRow;
        // const currentPosition = ColumnNames.getLetter(move.currentColumn) + move.currentRow;
        //
        // const castlingType = move.castlingMoveType;
        // if (castlingType) {
        //     return castlingType === CastlingMoveTypeEnum.SHORT ? 'O-O' : 'O-O-O';
        // }
        //
        // const actionSymbol = move.isEatenFigure ? ' x ' : ' - ';
        // const pawnPromotedType = move.isPawnPromotionMove
        //     ? FigureTypeEnum.getFigureAlias(move.pawnPromotedType)
        //     : '';
        // const enPassantSymbol = move.isEnPassantMove ? '[e.p.]' : '';
        // const mateSymbol = move.isMate ? '#' : '';
        // const checkSymbol = move.isCheck && !move.isMate ? '+' : '';
        // const staleMateSymbol = move.isStaleMate ? '(=)' : '';
        //
        // return `${type}${prevPosition}${actionSymbol}${enPassantSymbol}${currentPosition}${pawnPromotedType}${checkSymbol}${mateSymbol}${staleMateSymbol}`;
        return '';
    }
}
