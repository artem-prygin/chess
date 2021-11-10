import { IFigure } from '../../models/interfaces/figure.interface';
import { IFieldPosition } from '../../models/interfaces/field-position.interface';
import { WhiteBlackEnum } from '../../models/enum/white-black.enum';
import { Injectable } from '@angular/core';
import { IGeneratePossibleMoves } from '../../models/interfaces/generate-possible-moves.interface';
import { IMovesHistory } from '../../models/interfaces/moves-history.interface';
import { GameConstants } from '../../models/constants/game-constants';

@Injectable({ providedIn: 'root' })
export class BishopService implements IGeneratePossibleMoves {
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

    getTopMoves(factor: -1 | 1): IFieldPosition[] {
        const dirtyPossibleMoves: IFieldPosition[] = [];
        let index = 1;

        for (let row = this.currentPosition.row + 1; row <= GameConstants.ROWS_COUNT; row += 1) {
            if (this.currentPosition.column - index * factor < 1
                || this.currentPosition.column - index * factor > GameConstants.COLUMNS_COUNT) {
                break;
            }

            const isPossibleMove = this.isPossibleMove(this.currentPosition.column - index * factor, row);

            if (!isPossibleMove) {
                break;
            }

            const isEatEnemyMove = this.isEatEnemyMove(this.currentPosition.column - index * factor, row);

            const possibleMove = { column: this.currentPosition.column - index * factor, row };
            if (isEatEnemyMove) {
                dirtyPossibleMoves.push(possibleMove);
                break;
            }

            dirtyPossibleMoves.push(possibleMove);
            index += 1;
        }

        return dirtyPossibleMoves;
    }

    getBottomMoves(factor: -1 | 1): IFieldPosition[] {
        const dirtyPossibleMoves: IFieldPosition[] = [];
        let index = 1;

        for (let row = this.currentPosition.row - 1; row >= 1; row -= 1) {
            if (this.currentPosition.column - index * factor < 1
                || this.currentPosition.column - index * factor > GameConstants.COLUMNS_COUNT) {
                break;
            }

            const isPossibleMove = this.isPossibleMove(this.currentPosition.column - index * factor, row);

            if (!isPossibleMove) {
                break;
            }

            const isEatEnemyMove = this.isEatEnemyMove(this.currentPosition.column - index * factor, row);

            const possibleMove = { column: this.currentPosition.column - index * factor, row };
            if (isEatEnemyMove) {
                dirtyPossibleMoves.push(possibleMove);
                break;
            }

            dirtyPossibleMoves.push(possibleMove);
            index += 1;
        }

        return dirtyPossibleMoves;
    }

    generatePossibleMoves(currentFigure: IFigure, figures: IFigure[]): IFieldPosition[] {
        this.figures = figures;
        this.currentFigure = currentFigure;
        this.currentPosition = { column: currentFigure.column, row: currentFigure.row };
        this.currentColor = currentFigure.color;

        const dirtyPossibleMoves = [
            ...this.getTopMoves(1),
            ...this.getTopMoves(-1),
            ...this.getBottomMoves(1),
            ...this.getBottomMoves(-1),
        ];

        return dirtyPossibleMoves.filter((move) => !!move);
    }
}
