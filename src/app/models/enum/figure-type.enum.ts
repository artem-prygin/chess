export enum FigureTypeEnum {
    PAWN,
    ROOK,
    KNIGHT,
    BISHOP,
    QUEEN,
    KING,
}

export namespace FigureTypeEnum {
    export function getFigureAlias(type: FigureTypeEnum): string {
        switch (type) {
            case FigureTypeEnum.PAWN:
                return '';
            case FigureTypeEnum.ROOK:
                return 'R';
            case FigureTypeEnum.KNIGHT:
                return 'N';
            case FigureTypeEnum.BISHOP:
                return 'B';
            case FigureTypeEnum.QUEEN:
                return 'Q';
            case FigureTypeEnum.KING:
                return 'K';
            default:
                return '';
        }
    }
}
