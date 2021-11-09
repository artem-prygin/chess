import { IFigure } from '../models/figure.interface';
import { IFieldPosition } from '../models/field-position.interface';
import { WhiteBlackEnum } from '../enum/white-black.enum';
import { Injectable } from '@angular/core';
import { IGeneratePossibleMoves } from '../models/generate-possible-moves.interface';
import { GameConstants } from '../constants/game-constants';
import { FigureTypeEnum } from '../enum/figure-type.enum';
import { ColumnNames } from '../enum/column-names.enum';
import { CastlingMoveTypeEnum } from '../enum/castling-move-type.enum';


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

    getShortCastlingMove(): IFieldPosition {
        if (this.currentFigure.movesHistory.length > 0) {
            return;
        }

        const hasNearbyFigures: boolean = this.figures
            .some((f) => {
                return f.row === this.currentPosition.row
                    && (f.column === ColumnNames.F || f.column === ColumnNames.G);
            });

        if (hasNearbyFigures) {
            return;
        }

        const rook: IFigure = this.figures
            .find((f) => f.type === FigureTypeEnum.ROOK
                && f.movesHistory.length === 0
                && f.column === ColumnNames.H,
            );

        console.log(rook);
        if (!rook) {
            return;
        }

        return {
            column: this.currentPosition.column + 2,
            row: this.currentPosition.row,
            castlingMoveType: CastlingMoveTypeEnum.SHORT,
        };
    }

    getLongCastlingMove(): IFieldPosition {
        if (this.currentFigure.movesHistory.length > 0) {
            return;
        }

        const hasNearbyFigures: boolean = this.figures
            .some((f) => {
                return f.row === this.currentPosition.row
                    && (f.column === ColumnNames.B || f.column === ColumnNames.C || f.column === ColumnNames.D);
            });

        if (hasNearbyFigures) {
            return;
        }

        const rook: IFigure = this.figures
            .find((f) => f.type === FigureTypeEnum.ROOK
                && f.movesHistory.length === 0
                && f.color === this.currentColor
                && f.column === ColumnNames.A,
            );

        if (!rook) {
            return;
        }

        return {
            column: this.currentPosition.column - 2,
            row: this.currentPosition.row,
            castlingMoveType: CastlingMoveTypeEnum.LONG,
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
            this.getShortCastlingMove(),
            this.getLongCastlingMove(),
        ];

        return dirtyPossibleMoves.filter((move) => !!move);
    }
}
