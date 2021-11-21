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
        const activeFigurePrevInfo = move.prevPosition[0];
        const activeFigureCurrentInfo = move.currentPosition[0];
        const type = FigureTypeEnum.getFigureAlias(activeFigurePrevInfo.figureType);
        const prevPosition = ColumnNames.getLetter(activeFigurePrevInfo.column) + activeFigurePrevInfo.row;
        const currentPosition = ColumnNames.getLetter(activeFigureCurrentInfo.column) + activeFigureCurrentInfo.row;

        const castlingType = move.castlingMoveType;
        if (castlingType) {
            return castlingType === CastlingMoveTypeEnum.SHORT ? 'O-O' : 'O-O-O';
        }

        const actionSymbol = move.isEatenFigureMove ? ' x ' : ' - ';
        const pawnPromotedType = move.isPawnPromotionMove
            ? FigureTypeEnum.getFigureAlias(activeFigureCurrentInfo.figureType)
            : '';
        const enPassantSymbol = move.isEnPassantMove ? '[e.p.]' : '';
        const mateSymbol = move.isMate ? '#' : '';
        const checkSymbol = move.isCheck && !move.isMate ? '+' : '';
        const staleMateSymbol = move.isStaleMate ? '(=)' : '';

        return `${type}${prevPosition}${actionSymbol}${enPassantSymbol}${currentPosition}${pawnPromotedType}${checkSymbol}${mateSymbol}${staleMateSymbol}`;
    }
}
