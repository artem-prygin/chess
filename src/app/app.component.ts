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

    constructor(
        private store: Store,
        private pawnService: PawnService,
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
                console.log(currentTurn);
                setTimeout(() => {
                    this.ROWS = currentTurn === WhiteBlackEnum.WHITE
                        ? GameConstants.ROWS
                        : [...GameConstants.ROWS].reverse();

                    console.log(this.ROWS);
                }, 1000);
                this.currentTurnColor = currentTurn;
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
        if (figure.type !== FigureTypeEnum.PAWN && figure.type !== FigureTypeEnum.KNIGHT) {
            return [];
        }

        if (figure.type === FigureTypeEnum.PAWN) {
            return this.pawnService.generatePossibleMoves(figure, this.figures);
        }

        if (figure.type === FigureTypeEnum.KNIGHT) {
            return [
                {
                    column: figure.column + 1,
                    row: figure.color === WhiteBlackEnum.WHITE ? figure.row + 2 : figure.row - 2,
                },
                {
                    column: figure.column - 1,
                    row: figure.color === WhiteBlackEnum.WHITE ? figure.row + 2 : figure.row - 2,
                },
            ];
        }
    }

    isPossibleMove(column: number, row: number): boolean {
        return this.possibleMoves
            .some((move) => move.column === column && move.row === row);
    }

    moveFigure(column: number, row: number): void {
        const isPossibleMove = this.isPossibleMove(column, row);
        if (!isPossibleMove) {
            this.setActiveFigure(column, row);
            return;
        }

        this.store.dispatch(gameActions.moveFigure({ figure: this.activeFigure, column, row }));
        this.activeFigure = null;
        this.possibleMoves = [];
    }

    ngOnDestroy(): void {
        this.sub$.unsubscribe();
    }
}
