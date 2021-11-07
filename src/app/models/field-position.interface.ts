import { ColumnNames } from '../enum/column-names.enum';

export interface IFieldPosition {
    column: ColumnNames;
    row: number;
    enPassantMove?: boolean;
    pawnToFigureMove?: boolean;
}
