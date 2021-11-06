import { IFigure } from '../models/figure.interface';
import { IFieldPosition } from '../models/field-position.interface';
import { WhiteBlackEnum } from '../enum/white-black.enum';
import { GameConstants } from '../constants/game-constants';
import { ColumnNames } from '../enum/column-names.enum';
import { Injectable } from '@angular/core';
import { IGeneratePossibleMoves } from '../models/generate-possible-moves.interface';

@Injectable({ providedIn: 'root' })
export class PawnService implements IGeneratePossibleMoves {
    figures: IFigure[];
    currentFigure: IFigure;
    currentPosition: IFieldPosition;
    currentColor: WhiteBlackEnum;
    moveFactor: -1 | 1;

    constructor() {
    }

    getOneFieldFurtherPosition(): IFieldPosition {
        const destinationFieldIsEmpty = !this.figures
            .some((f) => f.column === this.currentPosition.column && f.row === this.currentPosition.row + 1 * this.moveFactor);

        if (!destinationFieldIsEmpty) {
            return;
        }

        return {
            column: this.currentPosition.column,
            row: this.currentPosition.row + 1 * this.moveFactor,
        };
    }

    getTwoFieldsFurtherPosition(): IFieldPosition {
        const pawnStartRow = this.currentColor === WhiteBlackEnum.WHITE
            ? GameConstants.WHITE_PAWN_START_ROW
            : GameConstants.BLACK_PAWN_START_ROW;

        if (pawnStartRow !== this.currentPosition.row) {
            return;
        }

        if (!this.getOneFieldFurtherPosition()) {
            return;
        }

        const destinationFieldIsEmpty = !this.figures
            .some((f) => f.column === this.currentPosition.column && f.row === this.currentPosition.row + 2 * this.moveFactor);

        if (!destinationFieldIsEmpty) {
            return;
        }

        return {
            column: this.currentPosition.column,
            row: this.currentPosition.row + 2 * this.moveFactor,
        };
    }

    getOneFieldFurtherToLeftPosition(): IFieldPosition {
        if (this.currentPosition.column + 1 > ColumnNames.G || this.currentPosition.column - 1 < ColumnNames.A) {
            return;
        }

        const isEnemyFigureOnLeftDestinationField = this.figures
            .some((f) => {
                return f.column === this.currentPosition.column - 1 * this.moveFactor
                    && f.row === this.currentPosition.row + 1 * this.moveFactor
                    && f.color !== this.currentColor;
            });

        if (!isEnemyFigureOnLeftDestinationField) {
            return;
        }

        return {
            column: this.currentPosition.column - 1 * this.moveFactor,
            row: this.currentPosition.row + 1 * this.moveFactor,
        };
    }

    getOneFieldFurtherToRightPosition(): IFieldPosition {
        if (this.currentPosition.column + 1 > ColumnNames.G || this.currentPosition.column - 1 < ColumnNames.A) {
            return;
        }

        const isEnemyFigureOnRightDestinationField = this.figures
            .some((f) => {
                return f.column === this.currentPosition.column + 1 * this.moveFactor
                    && f.row === this.currentPosition.row + 1 * this.moveFactor
                    && f.color !== this.currentColor;
            });

        if (!isEnemyFigureOnRightDestinationField) {
            return;
        }

        return {
            column: this.currentPosition.column + 1 * this.moveFactor,
            row: this.currentPosition.row + 1 * this.moveFactor,
        };
    }

    generatePossibleMoves(currentFigure: IFigure, figures: IFigure[]): IFieldPosition[] {
        this.figures = figures;
        this.currentFigure = currentFigure;
        this.currentPosition = { column: currentFigure.column, row: currentFigure.row };
        this.currentColor = currentFigure.color;
        this.moveFactor = this.currentColor === WhiteBlackEnum.WHITE ? 1 : -1;
        const possibleMoves = [
            this.getOneFieldFurtherPosition(),
            this.getTwoFieldsFurtherPosition(),
            this.getOneFieldFurtherToLeftPosition(),
            this.getOneFieldFurtherToRightPosition(),
        ];

        console.log(possibleMoves);

        return possibleMoves.filter((move) => !!move);
    }
}
