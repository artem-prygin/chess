import { Pipe, PipeTransform } from '@angular/core';
import { IMovesHistory } from '../../models/interfaces/moves-history.interface';
import { ColumnNames } from '../../models/enum/column-names.enum';
import { FigureTypeEnum } from '../../models/enum/figure-type.enum';

@Pipe({
    name: 'printMove',
})
export class MoveDisplay implements PipeTransform {
    transform(move: IMovesHistory): string {
        const type = FigureTypeEnum.getFigureAlias(move.type);
        const prevPosition = ColumnNames.getLetter(move.prevColumn) + move.prevRow;
        const currentPosition = ColumnNames.getLetter(move.currentColumn) + move.currentRow;
        return `${type}${prevPosition} - ${currentPosition}`;
    }
}
