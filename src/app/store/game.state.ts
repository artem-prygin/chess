import { WhiteBlackEnum } from '../enum/white-black.enum';
import { IFigure } from '../models/figure.interface';

export class GameState {
    figures: IFigure[];
    currentTurn: WhiteBlackEnum;
    moves: string[];
}
