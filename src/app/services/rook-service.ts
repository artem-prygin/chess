import { IFigure } from '../models/figure.interface';
import { IFieldPosition } from '../models/field-position.interface';
import { WhiteBlackEnum } from '../enum/white-black.enum';
import { Injectable } from '@angular/core';
import { IGeneratePossibleMoves } from '../models/generate-possible-moves.interface';
import { IMovesHistory } from '../models/moves-history.interface';
import { GameConstants } from '../constants/game-constants';

@Injectable({ providedIn: 'root' })
export class RookService implements IGeneratePossibleMoves {
    figures: IFigure[];
    currentFigure: IFigure;
    currentPosition: IFieldPosition;
    currentColor: WhiteBlackEnum;
    lastMove: IMovesHistory;

    constructor() {
    }

    isPossibleMove(column, row): boolean {
        return !this.figures
            .some((f) => f.column === column && f.row === row && f.color === this.currentColor);
    }

    isEatEnemyMove(column, row): boolean {
        return this.figures
            .some((f) => f.column === column && f.row === row && f.color !== this.currentColor);
    }

    getVerticalToTopMoves(): IFieldPosition[] {
        const dirtyPossibleMoves: IFieldPosition[] = [];

        for (let row = this.currentPosition.row + 1; row <= GameConstants.ROWS_COUNT; row += 1) {
            const isPossibleMove = this.isPossibleMove(this.currentPosition.column, row);

            if (!isPossibleMove) {
                break;
            }

            const isEatEnemyMove = this.isEatEnemyMove(this.currentPosition.column, row);

            if (isEatEnemyMove) {
                dirtyPossibleMoves.push({ column: this.currentPosition.column, row });
                break;
            }

            dirtyPossibleMoves.push({ column: this.currentPosition.column, row });
        }

        return dirtyPossibleMoves;
    }

    getVerticalToBottomMoves(): IFieldPosition[] {
        const dirtyPossibleMoves: IFieldPosition[] = [];

        for (let row = this.currentPosition.row - 1; row >= 1; row -= 1) {
            const isPossibleMove = this.isPossibleMove(this.currentPosition.column, row);

            if (!isPossibleMove) {
                break;
            }

            const isEatEnemyMove = this.isEatEnemyMove(this.currentPosition.column, row);

            if (isEatEnemyMove) {
                dirtyPossibleMoves.push({ column: this.currentPosition.column, row });
                break;
            }

            dirtyPossibleMoves.push({ column: this.currentPosition.column, row });
        }

        return dirtyPossibleMoves;
    }

    getHorizontalToLeftMoves(): IFieldPosition[] {
        const dirtyPossibleMoves: IFieldPosition[] = [];

        for (let column = this.currentPosition.column - 1; column >= 1; column -= 1) {
            const isPossibleMove = this.isPossibleMove(column, this.currentPosition.row);

            if (!isPossibleMove) {
                break;
            }

            const isEatEnemyMove = this.isEatEnemyMove(column, this.currentPosition.row);

            if (isEatEnemyMove) {
                dirtyPossibleMoves.push({ column, row: this.currentPosition.row });
                break;
            }

            dirtyPossibleMoves.push({ column, row: this.currentPosition.row });
        }

        return dirtyPossibleMoves;
    }

    getHorizontalToRightMoves(): IFieldPosition[] {
        const dirtyPossibleMoves: IFieldPosition[] = [];

        for (let column = this.currentPosition.column + 1; column <= GameConstants.COLUMNS_COUNT; column += 1) {
            const isPossibleMove = this.isPossibleMove(column, this.currentPosition.row);

            if (!isPossibleMove) {
                break;
            }

            const isEatEnemyMove = this.isEatEnemyMove(column, this.currentPosition.row);

            if (isEatEnemyMove) {
                dirtyPossibleMoves.push({ column, row: this.currentPosition.row });
                break;
            }

            dirtyPossibleMoves.push({ column, row: this.currentPosition.row });
        }

        return dirtyPossibleMoves;
    }

    generatePossibleMoves(currentFigure: IFigure, figures: IFigure[]): IFieldPosition[] {
        this.figures = figures;
        this.currentFigure = currentFigure;
        this.currentPosition = { column: currentFigure.column, row: currentFigure.row };
        this.currentColor = currentFigure.color;

        const dirtyPossibleMoves = [
            ...this.getVerticalToTopMoves(),
            ...this.getVerticalToBottomMoves(),
            ...this.getHorizontalToLeftMoves(),
            ...this.getHorizontalToRightMoves(),
        ];

        return dirtyPossibleMoves.filter((move) => !!move);
    }
}
