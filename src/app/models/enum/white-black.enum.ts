export enum WhiteBlackEnum {
    WHITE,
    BLACK,
}

export namespace WhiteBlackEnum {
    export function getStringValue(color: WhiteBlackEnum): string {
        switch (color) {
            case WhiteBlackEnum.WHITE:
                return 'white';
            case WhiteBlackEnum.BLACK:
                return 'black';
            default:
                return '';
        }
    }
}
