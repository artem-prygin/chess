export enum ColumnNames {
    A = 1,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
}

export namespace ColumnNames {
    export function getLetter(column: ColumnNames): string {
        switch (column) {
            case ColumnNames.A:
                return 'a';
            case ColumnNames.B:
                return 'b';
            case ColumnNames.C:
                return 'c';
            case ColumnNames.D:
                return 'd';
            case ColumnNames.E:
                return 'e';
            case ColumnNames.F:
                return 'f';
            case ColumnNames.G:
                return 'g';
            case ColumnNames.H:
                return 'h';
            default:
                return '';
        }
    }
}
