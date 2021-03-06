import { IFigure } from '../../models/interfaces/figure.interface';
import { IFieldPosition } from '../../models/interfaces/field-position.interface';
import { WhiteBlackEnum } from '../../models/enum/white-black.enum';
import { Injectable } from '@angular/core';
import { IGeneratePossibleMoves } from '../../models/interfaces/generate-possible-moves.interface';
import { IMovesHistory } from '../../models/interfaces/moves-history.interface';
import { GameConstants } from '../../models/constants/game-constants';
import { IMove } from '../../models/interfaces/move.interface';

@Injectable({ providedIn: 'root' })
export class QueenService implements IGeneratePossibleMoves {
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

    getTopToLeftMoves(): IMove[] {
        const dirtyPossibleMoves: IMove[] = [];
        let index = 1;

        for (let row = this.currentPosition.row + 1; row <= GameConstants.ROWS_COUNT; row += 1) {
            if (this.currentPosition.column - index < 1) {
                break;
            }

            const isPossibleMove = this.isPossibleMove(this.currentPosition.column - index, row);

            if (!isPossibleMove) {
                break;
            }

            const isEatEnemyMove = this.isEatEnemyMove(this.currentPosition.column - index, row);

            if (isEatEnemyMove) {
                dirtyPossibleMoves.push({ column: this.currentPosition.column - index, row });
                break;
            }

            dirtyPossibleMoves.push({ column: this.currentPosition.column - index, row });
            index += 1;
        }

        return dirtyPossibleMoves;
    }

    getTopToRightMoves(): IMove[] {
        const dirtyPossibleMoves: IMove[] = [];
        let index = 1;

        for (let row = this.currentPosition.row + 1; row <= GameConstants.ROWS_COUNT; row += 1) {
            if (this.currentPosition.column + index > GameConstants.COLUMNS_COUNT) {
                break;
            }

            const isPossibleMove = this.isPossibleMove(this.currentPosition.column + index, row);

            if (!isPossibleMove) {
                break;
            }

            const isEatEnemyMove = this.isEatEnemyMove(this.currentPosition.column + index, row);

            if (isEatEnemyMove) {
                dirtyPossibleMoves.push({ column: this.currentPosition.column + index, row });
                break;
            }

            dirtyPossibleMoves.push({ column: this.currentPosition.column + index, row });
            index += 1;
        }

        return dirtyPossibleMoves;
    }

    getBottomToLeftMoves(): IMove[] {
        const dirtyPossibleMoves: IMove[] = [];
        let index = 1;

        for (let row = this.currentPosition.row - 1; row >= 1; row -= 1) {
            if (this.currentPosition.column - index < 1) {
                break;
            }

            const isPossibleMove = this.isPossibleMove(this.currentPosition.column - index, row);

            if (!isPossibleMove) {
                break;
            }

            const isEatEnemyMove = this.isEatEnemyMove(this.currentPosition.column - index, row);

            if (isEatEnemyMove) {
                dirtyPossibleMoves.push({ column: this.currentPosition.column - index, row });
                break;
            }

            dirtyPossibleMoves.push({ column: this.currentPosition.column - index, row });
            index += 1;
        }

        return dirtyPossibleMoves;
    }

    getBottomToRightMoves(): IMove[] {
        const dirtyPossibleMoves: IMove[] = [];
        let index = 1;

        for (let row = this.currentPosition.row - 1; row >= 1; row -= 1) {
            if (this.currentPosition.column + index > GameConstants.COLUMNS_COUNT) {
                break;
            }

            const isPossibleMove = this.isPossibleMove(this.currentPosition.column + index, row);

            if (!isPossibleMove) {
                break;
            }

            const isEatEnemyMove = this.isEatEnemyMove(this.currentPosition.column + index, row);

            if (isEatEnemyMove) {
                dirtyPossibleMoves.push({ column: this.currentPosition.column + index, row });
                break;
            }

            dirtyPossibleMoves.push({ column: this.currentPosition.column + index, row });
            index += 1;
        }

        return dirtyPossibleMoves;
    }

    getVerticalToTopMoves(): IMove[] {
        const dirtyPossibleMoves: IMove[] = [];

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

    getVerticalToBottomMoves(): IMove[] {
        const dirtyPossibleMoves: IMove[] = [];

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

    getHorizontalToLeftMoves(): IMove[] {
        const dirtyPossibleMoves: IMove[] = [];

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

    getHorizontalToRightMoves(): IMove[] {
        const dirtyPossibleMoves: IMove[] = [];

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

    generatePossibleMoves(currentFigure: IFigure, figures: IFigure[]): IMove[] {
        this.figures = figures;
        this.currentFigure = currentFigure;
        this.currentPosition = { column: currentFigure.column, row: currentFigure.row };
        this.currentColor = currentFigure.color;

        const dirtyPossibleMoves = [
            ...this.getTopToRightMoves(),
            ...this.getTopToLeftMoves(),
            ...this.getBottomToRightMoves(),
            ...this.getBottomToLeftMoves(),
            ...this.getVerticalToTopMoves(),
            ...this.getVerticalToBottomMoves(),
            ...this.getHorizontalToLeftMoves(),
            ...this.getHorizontalToRightMoves(),
        ];

        return dirtyPossibleMoves.filter((move) => !!move);
    }
}
