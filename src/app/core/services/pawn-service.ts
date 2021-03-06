import { IFigure } from '../../models/interfaces/figure.interface';
import { IFieldPosition } from '../../models/interfaces/field-position.interface';
import { WhiteBlackEnum } from '../../models/enum/white-black.enum';
import { GameConstants } from '../../models/constants/game-constants';
import { ColumnNames } from '../../models/enum/column-names.enum';
import { Injectable } from '@angular/core';
import { IGeneratePossibleMoves } from '../../models/interfaces/generate-possible-moves.interface';
import { IMovesHistory } from '../../models/interfaces/moves-history.interface';
import { FigureTypeEnum } from '../../models/enum/figure-type.enum';
import { IMove } from '../../models/interfaces/move.interface';

@Injectable({ providedIn: 'root' })
export class PawnService implements IGeneratePossibleMoves {
    figures: IFigure[];
    currentFigure: IFigure;
    currentPosition: IFieldPosition;
    currentColor: WhiteBlackEnum;
    moveFactor: -1 | 1;
    lastMove: IMovesHistory;

    constructor() {
    }

    getOneFieldFurtherPosition(): IMove {
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

    getTwoFieldsFurtherPosition(): IMove {
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

    getOneFieldDiagonallyPosition(factor: 1 | -1): IMove {
        if (this.currentColor === WhiteBlackEnum.WHITE && this.currentPosition.column - factor < ColumnNames.A) {
            return;
        }

        if (this.currentColor === WhiteBlackEnum.BLACK && this.currentPosition.column + factor > ColumnNames.H) {
            return;
        }

        const isEnemyFigureOnLeftDestinationField = this.figures
            .some((f) => {
                return f.column === this.currentPosition.column - factor * this.moveFactor
                    && f.row === this.currentPosition.row + 1 * this.moveFactor
                    && f.color !== this.currentColor;
            });

        if (!isEnemyFigureOnLeftDestinationField) {
            return;
        }

        return {
            column: this.currentPosition.column - factor * this.moveFactor,
            row: this.currentPosition.row + 1 * this.moveFactor,
        };
    }

    getEnPassantPosition(factor: -1 | 1): IMove {
        if (this.lastMove?.currentPosition[0].figureType !== FigureTypeEnum.PAWN
            || Math.abs(this.lastMove.currentPosition[0].row - this.lastMove.prevPosition[0].row) !== 2
            || this.lastMove.currentPosition[0].column !== this.currentPosition.column - factor * this.moveFactor
        ) {
            return;
        }

        if (this.currentColor === WhiteBlackEnum.WHITE && this.currentPosition.row !== GameConstants.WHITE_PAWN_EN_PASSANT_ROW) {
            return;
        }

        if (this.currentColor === WhiteBlackEnum.BLACK && this.currentPosition.row !== GameConstants.BLACK_PAWN_EN_PASSANT_ROW) {
            return;
        }

        const enPassantPossible = this.figures
            .some((f) => {
                return f.type === FigureTypeEnum.PAWN
                    && f.column === this.currentPosition.column - factor * this.moveFactor
                    && f.row === this.currentPosition.row
                    && f.color !== this.currentColor;
            });

        if (!enPassantPossible) {
            return;
        }

        return {
            column: this.currentPosition.column - factor * this.moveFactor,
            row: this.currentPosition.row + 1 * this.moveFactor,
            isEnPassantMove: true,
        };
    }

    generatePossibleMoves(currentFigure: IFigure, figures: IFigure[], lastMove: IMovesHistory): IMove[] {
        this.figures = figures;
        this.currentFigure = currentFigure;
        this.currentPosition = { column: currentFigure.column, row: currentFigure.row };
        this.currentColor = currentFigure.color;
        this.moveFactor = this.currentColor === WhiteBlackEnum.WHITE ? 1 : -1;
        this.lastMove = lastMove;

        const dirtyPossibleMoves = [
            this.getOneFieldFurtherPosition(),
            this.getTwoFieldsFurtherPosition(),
            this.getOneFieldDiagonallyPosition(1),
            this.getOneFieldDiagonallyPosition(-1),
            this.getEnPassantPosition(1),
            this.getEnPassantPosition(-1),
        ];

        return dirtyPossibleMoves
            .filter((move) => !!move)
            .map((move) => {
                if (this.currentColor === WhiteBlackEnum.WHITE && move.row === 8
                    || this.currentColor === WhiteBlackEnum.BLACK && move.row === 1) {
                    return { ...move, isPawnPromotionMove: true };
                }

                return move;
            });
    }
}
