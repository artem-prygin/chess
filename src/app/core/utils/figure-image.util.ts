import { IFigure } from '../../models/interfaces/figure.interface';
import { FigureTypeEnum } from '../../models/enum/figure-type.enum';
import { GameConstants } from '../../models/constants/game-constants';

export class FigureImageUtil {
    static getFigureImage(figure: IFigure, color: string, path: string): string {
        switch (figure.type) {
            case FigureTypeEnum.PAWN:
                return `${path}${color}-pawn${GameConstants.FIGURE_IMAGE_EXTENSION}`;
            case FigureTypeEnum.ROOK:
                return `${path}${color}-rook${GameConstants.FIGURE_IMAGE_EXTENSION}`;
            case FigureTypeEnum.KNIGHT:
                return `${path}${color}-knight${GameConstants.FIGURE_IMAGE_EXTENSION}`;
            case FigureTypeEnum.BISHOP:
                return `${path}${color}-bishop${GameConstants.FIGURE_IMAGE_EXTENSION}`;
            case FigureTypeEnum.QUEEN:
                return `${path}${color}-queen${GameConstants.FIGURE_IMAGE_EXTENSION}`;
            case FigureTypeEnum.KING:
                return `${path}${color}-king${GameConstants.FIGURE_IMAGE_EXTENSION}`;
            default:
                return null;
        }
    }
}
