import { Injectable } from '@angular/core';
import { IFigure } from '../models/figure.interface';
import { IFieldPosition } from '../models/field-position.interface';
import { WhiteBlackEnum } from '../enum/white-black.enum';
import { GameConstants } from '../constants/game-constants';
import { FigureTypeEnum } from '../enum/figure-type.enum';
import { ColumnNames } from '../enum/column-names.enum';
import { CastlingMoveTypeEnum } from '../enum/castling-move-type.enum';


@Injectable({ providedIn: 'root' })
export class VerifyCheckService {
    figures: IFigure[];
    currentColor: WhiteBlackEnum;
    unavailableMoves: IFieldPosition[] = [];
    horizontalAttackers: FigureTypeEnum[] = [FigureTypeEnum.QUEEN, FigureTypeEnum.ROOK, FigureTypeEnum.KING];
    diagonalAttackers = [FigureTypeEnum.QUEEN, FigureTypeEnum.BISHOP, FigureTypeEnum.KING, FigureTypeEnum.PAWN];

    constructor() {
    }

    verifyHorizontalToLeftCheck(
        emulatedFigures: IFigure[],
        kingColumn: ColumnNames,
        kingRow: number,
        column: ColumnNames = null,
        row: number = null,
        castlingMoveType: CastlingMoveTypeEnum = null,
    ): boolean {
        for (let iColumn = kingColumn - 1; iColumn >= 1; iColumn -= 1) {
            const figureOnTheWay = emulatedFigures
                .find((f) => f.column === iColumn && f.row === kingRow);

            if (figureOnTheWay
                && (figureOnTheWay.color === this.currentColor || !this.horizontalAttackers.includes(figureOnTheWay.type))
            ) {
                return false;
            }

            if (kingColumn - iColumn === 1
                && figureOnTheWay
                && figureOnTheWay.type === FigureTypeEnum.KING
            ) {
                this.unavailableMoves.push({ column, row });
                return true;
            }

            if (figureOnTheWay && this.horizontalAttackers.includes(figureOnTheWay.type)) {
                if (figureOnTheWay.type === FigureTypeEnum.KING) {
                    return false;
                }
                this.unavailableMoves.push({ column, row });
                return true;
            }
        }

        return false;
    }

    verifyHorizontalToRightCheck(
        emulatedFigures: IFigure[],
        kingColumn: ColumnNames,
        kingRow: number,
        column: ColumnNames = null,
        row: number = null,
    ): boolean {
        for (let iColumn = kingColumn + 1; iColumn <= GameConstants.COLUMNS_COUNT; iColumn += 1) {
            const figureOnTheWay = emulatedFigures
                .find((f) => f.column === iColumn && f.row === kingRow);

            console.log(kingColumn, column);

            if (figureOnTheWay && (figureOnTheWay.color === this.currentColor)) {
                return false;
            }

            if (iColumn - kingColumn === 1
                && figureOnTheWay
                && figureOnTheWay.color !== this.currentColor
                && figureOnTheWay.type === FigureTypeEnum.KING
            ) {
                this.unavailableMoves.push({ column, row });
                return true;
            }

            if (figureOnTheWay && this.horizontalAttackers.includes(figureOnTheWay.type)) {
                if (figureOnTheWay.type === FigureTypeEnum.KING) {
                    return false;
                }
                this.unavailableMoves.push({ column, row });
                return true;
            }
        }

        return false;
    }

    verifyVerticalToTopCheck(
        emulatedFigures: IFigure[],
        kingColumn: ColumnNames,
        kingRow: number,
        column: ColumnNames = null,
        row: number = null,
    ): boolean {
        for (let iRow = kingRow + 1; iRow <= GameConstants.ROWS_COUNT; iRow += 1) {
            const figureOnTheWay = emulatedFigures
                .find((f) => f.column === kingColumn && f.row === iRow);

            if (figureOnTheWay
                && (figureOnTheWay.color === this.currentColor || !this.horizontalAttackers.includes(figureOnTheWay.type))
            ) {
                return false;
            }

            if (iRow - kingRow === 1
                && figureOnTheWay
                && figureOnTheWay.type === FigureTypeEnum.KING
            ) {
                this.unavailableMoves.push({ column, row });
                return true;
            }

            if (figureOnTheWay && this.horizontalAttackers.includes(figureOnTheWay.type)) {
                if (figureOnTheWay.type === FigureTypeEnum.KING) {
                    return false;
                }
                this.unavailableMoves.push({ column, row });
                return true;
            }
        }

        return false;
    }

    verifyVerticalToBottomCheck(
        emulatedFigures: IFigure[],
        kingColumn: ColumnNames,
        kingRow: number,
        column: ColumnNames = null,
        row: number = null,
    ): boolean {
        for (let iRow = kingRow - 1; iRow >= 1; iRow -= 1) {
            const figureOnTheWay = emulatedFigures
                .find((f) => f.column === kingColumn && f.row === iRow);

            if (figureOnTheWay
                && (figureOnTheWay.color === this.currentColor || !this.horizontalAttackers.includes(figureOnTheWay.type))
            ) {
                return false;
            }

            if (kingRow - iRow === 1
                && figureOnTheWay
                && figureOnTheWay.type === FigureTypeEnum.KING
            ) {
                this.unavailableMoves.push({ column, row });
                return true;
            }

            if (figureOnTheWay && this.horizontalAttackers.includes(figureOnTheWay.type)) {
                if (figureOnTheWay.type === FigureTypeEnum.KING) {
                    return false;
                }
                this.unavailableMoves.push({ column, row });
                return true;
            }
        }

        return false;
    }

    verifyDiagonalToTopLeftCheck(
        emulatedFigures: IFigure[],
        kingColumn: ColumnNames,
        kingRow: number,
        column: ColumnNames = null,
        row: number = null,
    ): boolean {
        let rowDiff = 1;
        for (let iColumn = kingColumn - 1; iColumn >= 1; iColumn -= 1) {
            if (kingRow + rowDiff > GameConstants.ROWS_COUNT) {
                return false;
            }

            const figureOnTheWay = emulatedFigures
                .find((f) => f.column === iColumn && f.row === kingRow + rowDiff);

            if (figureOnTheWay
                && (figureOnTheWay.color === this.currentColor || !this.diagonalAttackers.includes(figureOnTheWay.type))
            ) {
                return false;
            }

            if (kingColumn - iColumn === 1
                && figureOnTheWay
                && (figureOnTheWay.type === FigureTypeEnum.KING || figureOnTheWay.type === FigureTypeEnum.PAWN)
            ) {
                this.unavailableMoves.push({ column, row });
                return true;
            }

            if (figureOnTheWay && this.diagonalAttackers.includes(figureOnTheWay.type)) {
                if (figureOnTheWay.type === FigureTypeEnum.KING || figureOnTheWay.type === FigureTypeEnum.PAWN) {
                    return false;
                }
                this.unavailableMoves.push({ column, row });
                return true;
            }

            rowDiff += 1;
        }

        return false;
    }

    verifyDiagonalToTopRightCheck(
        emulatedFigures: IFigure[],
        kingColumn: ColumnNames,
        kingRow: number,
        column: ColumnNames = null,
        row: number = null,
    ): boolean {
        let rowDiff = 1;
        for (let iColumn = kingColumn + 1; iColumn <= GameConstants.COLUMNS_COUNT; iColumn += 1) {
            if (kingRow + rowDiff > GameConstants.ROWS_COUNT) {
                return false;
            }

            const figureOnTheWay = emulatedFigures
                .find((f) => f.column === iColumn && f.row === kingRow + rowDiff);

            if (figureOnTheWay
                && (figureOnTheWay.color === this.currentColor || !this.diagonalAttackers.includes(figureOnTheWay.type))
            ) {
                return false;
            }

            if (iColumn - kingColumn === 1
                && figureOnTheWay
                && (figureOnTheWay.type === FigureTypeEnum.KING || figureOnTheWay.type === FigureTypeEnum.PAWN)
            ) {
                this.unavailableMoves.push({ column, row });
                return true;
            }

            if (figureOnTheWay && this.diagonalAttackers.includes(figureOnTheWay.type)) {
                if (figureOnTheWay.type === FigureTypeEnum.KING || figureOnTheWay.type === FigureTypeEnum.PAWN) {
                    return false;
                }
                this.unavailableMoves.push({ column, row });
                return true;
            }

            rowDiff += 1;
        }

        return false;
    }

    verifyDiagonalToBottomLeftCheck(
        emulatedFigures: IFigure[],
        kingColumn: ColumnNames,
        kingRow: number,
        column: ColumnNames = null,
        row: number = null,
    ): boolean {
        let rowDiff = 1;
        for (let iColumn = kingColumn - 1; iColumn >= 1; iColumn -= 1) {
            if (kingRow - rowDiff < 1) {
                return false;
            }

            const figureOnTheWay = emulatedFigures
                .find((f) => f.column === iColumn && f.row === kingRow - rowDiff);

            if (figureOnTheWay
                && (figureOnTheWay.color === this.currentColor || !this.diagonalAttackers.includes(figureOnTheWay.type))
            ) {
                return false;
            }

            if (kingColumn - iColumn === 1
                && figureOnTheWay
                && (figureOnTheWay.type === FigureTypeEnum.KING || figureOnTheWay.type === FigureTypeEnum.PAWN)
            ) {
                this.unavailableMoves.push({ column, row });
                return true;
            }

            if (figureOnTheWay && this.diagonalAttackers.includes(figureOnTheWay.type)) {
                if (figureOnTheWay.type === FigureTypeEnum.KING || figureOnTheWay.type === FigureTypeEnum.PAWN) {
                    return false;
                }
                this.unavailableMoves.push({ column, row });
                return true;
            }

            rowDiff += 1;
        }

        return false;
    }

    verifyDiagonalToBottomRightCheck(
        emulatedFigures: IFigure[],
        kingColumn: ColumnNames,
        kingRow: number,
        column: ColumnNames = null,
        row: number = null,
    ): boolean {
        let rowDiff = 1;
        for (let iColumn = kingColumn + 1; iColumn <= GameConstants.COLUMNS_COUNT; iColumn += 1) {
            if (kingRow - rowDiff < 1) {
                return false;
            }

            const figureOnTheWay = emulatedFigures
                .find((f) => f.column === iColumn && f.row === kingRow - rowDiff);

            if (figureOnTheWay
                && (figureOnTheWay.color === this.currentColor || !this.diagonalAttackers.includes(figureOnTheWay.type))
            ) {
                return false;
            }

            if (iColumn - kingColumn === 1
                && figureOnTheWay
                && (figureOnTheWay.type === FigureTypeEnum.KING || figureOnTheWay.type === FigureTypeEnum.PAWN)
            ) {
                this.unavailableMoves.push({ column, row });
                return true;
            }

            if (figureOnTheWay && this.diagonalAttackers.includes(figureOnTheWay.type)) {
                if (figureOnTheWay.type === FigureTypeEnum.KING || figureOnTheWay.type === FigureTypeEnum.PAWN) {
                    return false;
                }
                this.unavailableMoves.push({ column, row });
                return true;
            }

            rowDiff += 1;
        }

        return false;
    }

    verifyKnightCheck(
        emulatedFigures: IFigure[],
        kingColumn: ColumnNames,
        kingRow: number,
        column: ColumnNames = null,
        row: number = null,
    ): boolean {
        const attackingKnight = emulatedFigures.find((f) => {
            return f.type === FigureTypeEnum.KNIGHT
                && f.color !== this.currentColor
                && (
                    (f.column === kingColumn - 2 && f.row === kingRow + 1)
                    || (f.column === kingColumn - 1 && f.row === kingRow + 2)
                    || (f.column === kingColumn + 1 && f.row === kingRow + 2)
                    || (f.column === kingColumn + 2 && f.row === kingRow + 1)
                    || (f.column === kingColumn + 2 && f.row === kingRow - 1)
                    || (f.column === kingColumn + 1 && f.row === kingRow - 2)
                    || (f.column === kingColumn - 1 && f.row === kingRow - 2)
                    || (f.column === kingColumn - 2 && f.row === kingRow - 1)
                );
        });

        if (attackingKnight) {
            this.unavailableMoves.push({ column, row });
            return true;
        }

        return false;
    }

    verifyCheck(kingColumn: ColumnNames, kingRow: number): boolean {
        return this.verifyDiagonalToBottomLeftCheck(this.figures, kingColumn, kingRow)
            || this.verifyHorizontalToLeftCheck(this.figures, kingColumn, kingRow)
            || this.verifyHorizontalToRightCheck(this.figures, kingColumn, kingRow)
            || this.verifyVerticalToTopCheck(this.figures, kingColumn, kingRow)
            || this.verifyVerticalToBottomCheck(this.figures, kingColumn, kingRow)
            || this.verifyDiagonalToTopLeftCheck(this.figures, kingColumn, kingRow)
            || this.verifyDiagonalToTopRightCheck(this.figures, kingColumn, kingRow)
            || this.verifyDiagonalToBottomLeftCheck(this.figures, kingColumn, kingRow)
            || this.verifyDiagonalToBottomRightCheck(this.figures, kingColumn, kingRow)
            || this.verifyKnightCheck(this.figures, kingColumn, kingRow);
    }

    verifyCheckForCastling(castlingMoveType: CastlingMoveTypeEnum, column: ColumnNames = null, row: number = null): boolean {
        const king: IFigure = this.figures
            .find((f) => f.type === FigureTypeEnum.KING && f.color === this.currentColor);

        const factor: -1 | 1 = castlingMoveType === CastlingMoveTypeEnum.SHORT ? 1 : -1;

        const checkWhileCastling = this.verifyCheck(king.column + 1 * factor, king.row)
            || this.verifyCheck(king.column + 2 * factor, king.row);

        if (checkWhileCastling) {
            this.unavailableMoves.push({ column, row });
            return true;
        }

        return false;
    }

    verifyCheckAllMoves(figures: IFigure[], currentColor: WhiteBlackEnum): boolean {
        this.figures = figures;
        this.currentColor = currentColor;
        const king: IFigure = this.figures
            .find((f) => f.type === FigureTypeEnum.KING && f.color === this.currentColor);

        return this.verifyCheck(king.column, king.row);
    }

    generateFilteredMoves(
        figures: IFigure[],
        dirtyMoves: IFieldPosition[],
        currentColor: WhiteBlackEnum,
        activeFigure: IFigure,
    ): IFieldPosition[] {
        this.currentColor = currentColor;
        this.figures = figures;
        this.unavailableMoves = [];
        console.log(dirtyMoves);

        dirtyMoves.forEach(({ column, row, castlingMoveType }) => {
            if (castlingMoveType) {
                this.verifyCheckForCastling(castlingMoveType, column, row);
            }

            const emulatedFigures: IFigure[] = this.figures.map((figure) => {
                if (figure.column === column && figure.row === row) {
                    return {
                        ...figure,
                        column: null,
                        row: null,
                    };
                }

                if (activeFigure.id === figure.id) {
                    return {
                        ...figure,
                        column,
                        row,
                    };
                }
                return figure;
            });

            const king = emulatedFigures
                .find(({ type, color }) => type === FigureTypeEnum.KING && color === currentColor);

            const { column: kingColumn, row: kingRow } = king;
            const a = this.verifyHorizontalToLeftCheck(emulatedFigures, kingColumn, kingRow, column, row);
            const b = this.verifyHorizontalToRightCheck(emulatedFigures, kingColumn, kingRow, column, row);
            const c = this.verifyVerticalToTopCheck(emulatedFigures, kingColumn, kingRow, column, row);
            const d = this.verifyVerticalToBottomCheck(emulatedFigures, kingColumn, kingRow, column, row);
            const e = this.verifyDiagonalToTopLeftCheck(emulatedFigures, kingColumn, kingRow, column, row);
            const f = this.verifyDiagonalToTopRightCheck(emulatedFigures, kingColumn, kingRow, column, row);
            const g = this.verifyDiagonalToBottomLeftCheck(emulatedFigures, kingColumn, kingRow, column, row);
            const h = this.verifyDiagonalToBottomRightCheck(emulatedFigures, kingColumn, kingRow, column, row);
            const i = this.verifyKnightCheck(emulatedFigures, kingColumn, kingRow, column, row);
            console.log(a, b, c, d, e, f, g, h, i);
        });

        console.log('all', dirtyMoves);
        console.log('unavailable', this.unavailableMoves);
        const filteredMoves = dirtyMoves
            .filter((possibleMove) => {
                return !this.unavailableMoves.some((unavailableMove) => {
                    return unavailableMove.column === possibleMove.column && unavailableMove.row === possibleMove.row;
                });
            });
        console.log('filtered', filteredMoves);
        return filteredMoves;
    }

}
