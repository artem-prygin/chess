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
    possibleMoves: IFieldPosition[] = [];
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
            this.activeFigure = null;
            this.possibleMoves = [];
            return;
        }

        this.activeFigure = figure;
        this.possibleMoves = this.generatePossibleMoves(figure);
        console.log(this.possibleMoves);
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
        return this.possibleMoves
            .some((move) => move.column === column && move.row === row);
    }

    getMove(column: number, row: number): IFieldPosition {
        return this.possibleMoves
            .find((move) => move.column === column && move.row === row);
    }

    moveFigure(column: number, row: number): void {
        const move = this.getMove(column, row);
        if (!move) {
            this.setActiveFigure(column, row);
            return;
        }

        this.store.dispatch(gameActions.moveFigure({ figure: this.activeFigure, move }));
        this.activeFigure = null;
        this.possibleMoves = [];
    }

    ngOnDestroy(): void {
        this.sub$.unsubscribe();
    }

    resetGame(): void {
        this.store.dispatch(gameActions.resetGame());
    }
}
