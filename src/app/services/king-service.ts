import { IFigure } from '../models/figure.interface';
import { IFieldPosition } from '../models/field-position.interface';
import { WhiteBlackEnum } from '../enum/white-black.enum';
import { Injectable } from '@angular/core';
import { IGeneratePossibleMoves } from '../models/generate-possible-moves.interface';
import { GameConstants } from '../constants/game-constants';


@Injectable({ providedIn: 'root' })
export class KingService implements IGeneratePossibleMoves {
    figures: IFigure[];
    currentFigure: IFigure;
    currentPosition: IFieldPosition;
    currentColor: WhiteBlackEnum;

    constructor() {
    }

    getNewPosition(columnDiff: number, rowDiff: number): IFieldPosition {
        if (this.currentPosition.column + columnDiff < 1 || this.currentPosition.column + columnDiff > GameConstants.COLUMNS_COUNT) {
            return;
        }

        if (this.currentPosition.row + rowDiff < 1 || this.currentPosition.row + rowDiff > GameConstants.ROWS_COUNT) {
            return;
        }

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
            this.getNewPosition(-1, 1),
            this.getNewPosition(0, 1),
            this.getNewPosition(1, 1),
            this.getNewPosition(1, 0),
            this.getNewPosition(1, -1),
            this.getNewPosition(0, -1),
            this.getNewPosition(-1, -1),
            this.getNewPosition(-1, 0),
        ];

        return dirtyPossibleMoves.filter((move) => !!move);
    }
}
