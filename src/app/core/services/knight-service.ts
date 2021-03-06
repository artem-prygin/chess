import { IFigure } from '../../models/interfaces/figure.interface';
import { IFieldPosition } from '../../models/interfaces/field-position.interface';
import { WhiteBlackEnum } from '../../models/enum/white-black.enum';
import { Injectable } from '@angular/core';
import { IGeneratePossibleMoves } from '../../models/interfaces/generate-possible-moves.interface';
import { IMove } from '../../models/interfaces/move.interface';
import { ColumnNames } from '../../models/enum/column-names.enum';


@Injectable({ providedIn: 'root' })
export class KnightService implements IGeneratePossibleMoves {
    figures: IFigure[];
    currentFigure: IFigure;
    currentPosition: IFieldPosition;
    currentColor: WhiteBlackEnum;

    constructor() {
    }

    getNewPosition(columnDiff: number, rowDiff: number): IMove {
        const destinationFieldExists = this.currentPosition.column + columnDiff > 0
            && this.currentPosition.column + columnDiff <= ColumnNames.H
            && this.currentPosition.row + rowDiff > 0
            && this.currentPosition.row + rowDiff <= 8;

        if (!destinationFieldExists) {
            return;
        }

        const destinationFieldIsEmpty = !this.figures
            .some((f) => f.column === this.currentPosition.column + columnDiff
                && f.row === this.currentPosition.row + rowDiff
                && f.color === this.currentColor);

        if (!destinationFieldIsEmpty) {
            return;
        }

        return {
            column: this.currentPosition.column + columnDiff,
            row: this.currentPosition.row + rowDiff,
        };
    }

    generatePossibleMoves(currentFigure: IFigure, figures: IFigure[]): IMove[] {
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
