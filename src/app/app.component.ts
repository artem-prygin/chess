import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as gameActions from './store/game.actions';
import * as gameSelectors from './store/game.selectors';
import { GameConstants } from './constants/game-constants';
import { distinctUntilChanged } from 'rxjs/operators';
import { IFigure } from './models/figure.interface';
import { FigureTypeEnum } from './enum/figure-type.enum';
import { WhiteBlackEnum } from './enum/white-black.enum';
import { Subscription } from 'rxjs';
import { IFieldPosition } from './models/field-position.interface';
import { PawnService } from './services/pawn-service';
import { IMovesHistory } from './models/moves-history.interface';
import { RookService } from './services/rook-service';
import { BishopService } from './services/bishop-service';
import { QueenService } from './services/queen-service';
import { KnightService } from './services/knight-service';
import { KingService } from './services/king-service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    GameConstants = GameConstants;
    figures: IFigure[];
    activeFigure: IFigure;
    figureImageLink = 'url(assets/figures/';
    figureImageExtension = '.png';
    currentTurnColor: WhiteBlackEnum = WhiteBlackEnum.WHITE;
    sub$ = new Subscription();
    activeField: IFieldPosition;
    dirtyPossibleMoves: IFieldPosition[] = [];
    filteredMoves: IFieldPosition[] = [];
    ROWS = GameConstants.ROWS;
    COLUMNS = GameConstants.COLUMNS;
    moves: IMovesHistory[];

    constructor(
        private store: Store,
        private pawnService: PawnService,
        private rookService: RookService,
        private bishopService: BishopService,
        private queenService: QueenService,
        private knightService: KnightService,
        private kingService: KingService,
    ) {
    }

    ngOnInit(): void {
        this.store.dispatch(gameActions.testAction());

        this.sub$.add(
            this.store.select(gameSelectors.selectActiveFigures).pipe(
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
            ).subscribe((figures) => {
                this.figures = figures;
            }),
        );

        this.sub$.add(
            this.store.select(gameSelectors.selectCurrentTurn).pipe(
                distinctUntilChanged((a, b) => a === b),
            ).subscribe((currentTurn) => {
                this.currentTurnColor = currentTurn;
                // this.ROWS = currentTurn === WhiteBlackEnum.WHITE
                //     ? GameConstants.ROWS
                //     : [...GameConstants.ROWS].reverse();
                // this.COLUMNS = currentTurn === WhiteBlackEnum.WHITE
                //     ? GameConstants.COLUMNS
                //     : [...GameConstants.COLUMNS].reverse();
            }),
        );

        this.sub$.add(
            this.store.select(gameSelectors.selectMoves).pipe(
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
            ).subscribe((moves) => {
                this.moves = moves;
            }),
        );
    }

    getFigure(column: number, row: number): IFigure {
        return this.figures
            .find((f) => f.column === column && f.row === row);
    }

    getFigureOfCurrentColor(column: number, row: number): boolean {
        const figure = this.getFigure(column, row);
        return !(!figure || figure.color !== this.currentTurnColor);
    }

    getFigureImage(column: number, row: number): string {
        const figure = this.getFigure(column, row);
        if (!figure) {
            return;
        }

        const color = figure.color === WhiteBlackEnum.WHITE
            ? 'white'
            : 'black';

        switch (figure.type) {
            case FigureTypeEnum.PAWN:
                return `${this.figureImageLink}${color}-pawn${this.figureImageExtension}`;
            case FigureTypeEnum.ROOK:
                return `${this.figureImageLink}${color}-rook${this.figureImageExtension}`;
            case FigureTypeEnum.KNIGHT:
                return `${this.figureImageLink}${color}-knight${this.figureImageExtension}`;
            case FigureTypeEnum.BISHOP:
                return `${this.figureImageLink}${color}-bishop${this.figureImageExtension}`;
            case FigureTypeEnum.QUEEN:
                return `${this.figureImageLink}${color}-queen${this.figureImageExtension}`;
            case FigureTypeEnum.KING:
                return `${this.figureImageLink}${color}-king${this.figureImageExtension}`;
            default:
                return null;
        }
    }

    isActiveField(column: number, row: number): boolean {
        return this.activeField?.column === column && this.activeField?.row === row;
    }

    setActiveFigure(column: number, row: number): void {
        const figure = this.getFigure(column, row);
        if (!figure || figure.color !== this.currentTurnColor) {
            this.resetActiveData();
            return;
        }

        this.activeFigure = figure;
        this.dirtyPossibleMoves = this.generatePossibleMoves(figure);
        this.filteredMoves = this.generateFilteredMoves();
    }

    generateFilteredMoves(): IFieldPosition[] {
        const unavailableMoves: IFieldPosition[] = [];
        this.dirtyPossibleMoves.forEach(({ column, row }) => {
            const emulatedFigures: IFigure[] = this.figures.map((figure) => {
                if (this.activeFigure.id === figure.id) {
                    return {
                        ...figure,
                        column,
                        row,
                    };
                }
                return figure;
            });

            const king = emulatedFigures
                .find(({ type, color }) => type === FigureTypeEnum.KING && color === this.currentTurnColor);

            const { column: kingColumn, row: kingRow } = king;

            // horizontal to left
            const horizontalAttackers = [FigureTypeEnum.QUEEN, FigureTypeEnum.ROOK, FigureTypeEnum.KING];
            for (let iColumn = kingColumn - 1; iColumn >= 1; iColumn -= 1) {
                const figureOnTheWay = emulatedFigures
                    .find((f) => f.column === iColumn && f.row === kingRow);

                if (figureOnTheWay
                    && (figureOnTheWay.color === this.currentTurnColor || !horizontalAttackers.includes(figureOnTheWay.type))
                ) {
                    break;
                }

                if (kingColumn - iColumn === 1
                    && figureOnTheWay
                    && figureOnTheWay.type === FigureTypeEnum.KING
                ) {
                    unavailableMoves.push({ column, row });
                    break;
                }

                if (figureOnTheWay && horizontalAttackers.includes(figureOnTheWay.type)) {
                    if (figureOnTheWay.type === FigureTypeEnum.KING) {
                        break;
                    }
                    unavailableMoves.push({ column, row });
                    break;
                }
            }

            // horizontal to right
            for (let iColumn = kingColumn + 1; iColumn <= GameConstants.COLUMNS_COUNT; iColumn += 1) {
                const figureOnTheWay = emulatedFigures
                    .find((f) => f.column === iColumn && f.row === kingRow);

                if (figureOnTheWay && (figureOnTheWay.color === this.currentTurnColor)) {
                    break;
                }

                if (iColumn - kingColumn === 1
                    && figureOnTheWay
                    && figureOnTheWay.color !== this.currentTurnColor
                    && figureOnTheWay.type === FigureTypeEnum.KING
                ) {
                    unavailableMoves.push({ column, row });
                    break;
                }

                if (figureOnTheWay
                    && figureOnTheWay.color !== this.currentTurnColor
                    && (figureOnTheWay.type === FigureTypeEnum.QUEEN || figureOnTheWay.type === FigureTypeEnum.ROOK)
                ) {
                    unavailableMoves.push({ column, row });
                    break;
                }
            }

            // diagonal top to left
            const diagonalAttackers = [FigureTypeEnum.QUEEN, FigureTypeEnum.BISHOP, FigureTypeEnum.KING];
            let index = 1;
            for (let iColumn = kingColumn - 1; iColumn >= 1; iColumn -= 1) {
                const figureOnTheWay = emulatedFigures
                    .find((f) => f.column === iColumn && f.row === kingRow + index);

                if (figureOnTheWay
                    && (figureOnTheWay.color === this.currentTurnColor || !diagonalAttackers.includes(figureOnTheWay.type))
                ) {
                    break;
                }

                if (kingColumn - iColumn === 1
                    && figureOnTheWay
                    && figureOnTheWay.type === FigureTypeEnum.KING
                ) {
                    unavailableMoves.push({ column, row });
                    break;
                }

                if (figureOnTheWay && diagonalAttackers.includes(figureOnTheWay.type)) {
                    if (figureOnTheWay.type === FigureTypeEnum.KING) {
                        break;
                    }
                    unavailableMoves.push({ column, row });
                    break;
                }

                index += 1;
            }

            // diagonal top to right
            index = 1;
            for (let iColumn = kingColumn + 1; iColumn <= GameConstants.COLUMNS_COUNT; iColumn += 1) {
                const figureOnTheWay = emulatedFigures
                    .find((f) => f.column === iColumn && f.row === kingRow + index);

                if (figureOnTheWay && figureOnTheWay.color === this.currentTurnColor) {
                    break;
                }

                if (iColumn - kingColumn === 1
                    && figureOnTheWay
                    && figureOnTheWay.color !== this.currentTurnColor
                    && figureOnTheWay.type === FigureTypeEnum.KING
                ) {
                    unavailableMoves.push({ column, row });
                    break;
                }

                if (figureOnTheWay
                    && figureOnTheWay.color !== this.currentTurnColor
                    && (figureOnTheWay.type === FigureTypeEnum.QUEEN || figureOnTheWay.type === FigureTypeEnum.BISHOP)
                ) {
                    unavailableMoves.push({ column, row });
                    break;
                }

                index += 1;
            }
        });

        console.log('all', this.dirtyPossibleMoves);
        console.log('unavailable', unavailableMoves);
        const filteredMoves = this.dirtyPossibleMoves
            .filter((possibleMove) => {
                return !unavailableMoves.some((unavailableMove) => {
                    return unavailableMove.column === possibleMove.column && unavailableMove.row === possibleMove.row;
                });
            });
        console.log('filtered', filteredMoves);
        return filteredMoves;
    }

    generatePossibleMoves(figure: IFigure): IFieldPosition[] {
        switch (figure.type) {
            case FigureTypeEnum.PAWN:
                return this.pawnService.generatePossibleMoves(figure, this.figures, this.moves);
            case FigureTypeEnum.ROOK:
                return this.rookService.generatePossibleMoves(figure, this.figures);
            case FigureTypeEnum.BISHOP:
                return this.bishopService.generatePossibleMoves(figure, this.figures);
            case FigureTypeEnum.QUEEN:
                return this.queenService.generatePossibleMoves(figure, this.figures);
            case FigureTypeEnum.KNIGHT:
                return this.knightService.generatePossibleMoves(figure, this.figures);
            case FigureTypeEnum.KING:
                return this.kingService.generatePossibleMoves(figure, this.figures);
            default:
                return [];
        }
    }

    isPossibleMove(column: number, row: number): boolean {
        return this.filteredMoves
            .some((move) => move.column === column && move.row === row);
    }

    getMove(column: number, row: number): IFieldPosition {
        return this.filteredMoves
            .find((move) => move.column === column && move.row === row);
    }

    moveFigure(column: number, row: number): void {
        const move = this.getMove(column, row);
        if (!move) {
            this.setActiveFigure(column, row);
            return;
        }

        this.store.dispatch(gameActions.moveFigure({ figure: this.activeFigure, move }));
        this.resetActiveData();
    }

    ngOnDestroy(): void {
        this.sub$.unsubscribe();
    }

    resetActiveData(): void {
        this.activeFigure = null;
        this.filteredMoves = [];
        this.dirtyPossibleMoves = [];
    }

    resetGame(): void {
        this.store.dispatch(gameActions.resetGame());
        this.resetActiveData();
    }

    undoMove(): void {
        this.store.dispatch(gameActions.undoMove());
        this.resetActiveData();
    }
}
