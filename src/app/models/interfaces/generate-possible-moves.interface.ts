import { IFieldPosition } from './field-position.interface';
import { IFigure } from './figure.interface';
import { IMovesHistory } from './moves-history.interface';

export interface IGeneratePossibleMoves {
    generatePossibleMoves(currentFigure: IFigure, figures: IFigure[], moves?: IMovesHistory[]): IFieldPosition[];
}
