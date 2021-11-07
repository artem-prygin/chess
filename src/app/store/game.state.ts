import { WhiteBlackEnum } from '../enum/white-black.enum';
import { IFigure } from '../models/figure.interface';
import { IMovesHistory } from '../models/moves-history.interface';

export class GameState {
    figures: IFigure[];
    currentTurn: WhiteBlackEnum;
    moves: IMovesHistory[];
}
