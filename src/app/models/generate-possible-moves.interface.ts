import { IFieldPosition } from './field-position.interface';
import { IFigure } from './figure.interface';

export interface IGeneratePossibleMoves {
    generatePossibleMoves(currentFigure: IFigure, figures: IFigure[]): IFieldPosition[];
}
