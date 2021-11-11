import { IFigure } from './figure.interface';
import { IMovesHistory } from './moves-history.interface';
import { IMove } from './move.interface';

export interface IGeneratePossibleMoves {
    generatePossibleMoves(currentFigure: IFigure, figures: IFigure[], moves?: IMovesHistory[]): IMove[];
}
