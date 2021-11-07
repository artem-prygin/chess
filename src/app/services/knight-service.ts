import { IFigure } from '../models/figure.interface';
import { IFieldPosition } from '../models/field-position.interface';
import { WhiteBlackEnum } from '../enum/white-black.enum';
import { Injectable } from '@angular/core';
import { IGeneratePossibleMoves } from '../models/generate-possible-moves.interface';


@Injectable({ providedIn: 'root' })
export class KnightService implements IGeneratePossibleMoves {
    figures: IFigure[];
    currentFigure: IFigure;
    currentPosition: IFieldPosition;
    currentColor: WhiteBlackEnum;

    constructor() {
    }

    getNewPosition(columnDiff: number, rowDiff: number): IFieldPosition {
        const destinationFieldIsAvailable = !this.figures
            .some((f) => f.column === this.currentPosition.column + columnDiff
                && f.row === this.currentPosition.row + rowDiff
                && f.color === this.currentColor);

        if (!destinationFieldIsAvailable) {
            return;
        }

        return {
            column: this.currentPosition.column + columnDiff,
            row: this.currentPosition.row + rowDiff,
        };
    }

    generatePossibleMoves(currentFigure: IFigure, figures: IFigure[]): IFieldPosition[] {
        this.figures = figures;
        this.currentFigure = currentFigure;
        this.currentPosition = { column: currentFigure.column, row: currentFigure.row };
        this.currentColor = currentFigure.color;

        const dirtyPossibleMoves = [
            this.getNewPosition(-2, 1),
            this.getNewPosition(-1, 2),
            this.getNewPosition(1, 2),
            this.getNewPosition(2, 1),
            this.getNewPosition(2, -1),
            this.getNewPosition(1, -2),
            this.getNewPosition(-1, -2),
            this.getNewPosition(-2, -1),
        ];

        return dirtyPossibleMoves.filter((move) => !!move);
    }
}
