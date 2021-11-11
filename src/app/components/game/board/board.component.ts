import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as gameActions from '../../../store/game.actions';
import * as gameSelectors from '../../../store/game.selectors';
import { GameConstants } from '../../../models/constants/game-constants';
import { distinctUntilChanged } from 'rxjs/operators';
import { IFigure } from '../../../models/interfaces/figure.interface';
import { FigureTypeEnum } from '../../../models/enum/figure-type.enum';
import { WhiteBlackEnum } from '../../../models/enum/white-black.enum';
import { Subscription } from 'rxjs';
import { IFieldPosition } from '../../../models/interfaces/field-position.interface';
import { PawnService } from '../../../core/services/pawn-service';
import { IMovesHistory } from '../../../models/interfaces/moves-history.interface';
import { RookService } from '../../../core/services/rook-service';
import { BishopService } from '../../../core/services/bishop-service';
import { QueenService } from '../../../core/services/queen-service';
import { KnightService } from '../../../core/services/knight-service';
import { KingService } from '../../../core/services/king-service';
import { VerifyCheckService } from '../../../core/services/verify-check.service';
import { MatDialog } from '@angular/material/dialog';
import { PawnPromotionComponent } from '../pawn-promotion/pawn-promotion.component';
import { IMove } from '../../../models/interfaces/move.interface';
import { FigureImageUtil } from '../../../core/utils/figure-image.util';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
    sub$ = new Subscription();
    GameConstants = GameConstants;
    currentTurnColor: WhiteBlackEnum = WhiteBlackEnum.WHITE;
    figures: IFigure[];
    activeFigure: IFigure;
    activeField: IFieldPosition;
    dirtyPossibleMoves: IMove[] = [];
    filteredMoves: IMove[] = [];
    ROWS = GameConstants.ROWS;
    COLUMNS = GameConstants.COLUMNS;
    moves: IMovesHistory[] = [];
    gameStarted: boolean;

    constructor(
        private store: Store,
        private pawnService: PawnService,
        private rookService: RookService,
        private bishopService: BishopService,
        private queenService: QueenService,
        private knightService: KnightService,
        private kingService: KingService,
        private verifyCheckService: VerifyCheckService,
        private dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.sub$.add(
            this.store.select(gameSelectors.selectActiveFigures).pipe(
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
            ).subscribe((figures) => {
                this.figures = figures;
            }),
        );

        this.sub$.add(
            this.store.select(gameSelectors.selectMoves).pipe(
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
            ).subscribe((moves) => {
                this.moves = moves;
            }),
        );

        this.sub$.add(
            this.store.select(gameSelectors.selectCurrentTurn).pipe(
                distinctUntilChanged((a, b) => a === b),
            ).subscribe((currentTurn) => {
                console.log('switch turn');
                this.currentTurnColor = currentTurn;

                if (!this.gameStarted) {
                    this.gameStarted = true;
                    return;
                }

                const isCheck = this.moves.length > 0 && this.moves[this.moves.length - 1].isCheck;
                const isMate = this.moves.length > 0 && this.moves[this.moves.length - 1].isMate;

                if (isCheck) {
                    console.log('check');
                }

                if (isMate) {
                    console.log('mate');
                }
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

        const color: string = WhiteBlackEnum.getStringValue(figure.color);
        return FigureImageUtil.getFigureImage(figure, color, GameConstants.FIGURE_IMAGE_BG_LINK);
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
        this.filteredMoves = this.verifyCheckService
            .generateFilteredMoves(this.figures, this.dirtyPossibleMoves, this.currentTurnColor, this.activeFigure);
    }

    generatePossibleMoves(figure: IFigure): IMove[] {
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

    getMove(column: number, row: number): IMove {
        return this.filteredMoves
            .find((move) => move.column === column && move.row === row);
    }

    async moveFigure(column: number, row: number): Promise<void> {
        const move = this.getMove(column, row);
        if (!move) {
            this.setActiveFigure(column, row);
            return;
        }

        const emulatedFigures = this.figures.map((figure) => {
            if (this.activeFigure.id === figure.id) {
                return {
                    ...figure,
                    column: move.column,
                    row: move.row,
                };
            }
            return figure;
        });

        const oppositeColor = this.currentTurnColor === WhiteBlackEnum.WHITE
            ? WhiteBlackEnum.BLACK
            : WhiteBlackEnum.WHITE;

        move.isMate = !emulatedFigures
            .filter(({ color }) => color === oppositeColor)
            .some((figure) => {
                const dirtyMoves = this.generatePossibleMoves(figure);
                const moves = this.verifyCheckService
                    .generateFilteredMoves(emulatedFigures, dirtyMoves, oppositeColor, figure);
                console.log(dirtyMoves, moves);
                return moves.length > 0;
            });
        move.isCheck = move.isMate || this.verifyCheckService.verifyCheckAllMoves(emulatedFigures, oppositeColor);

        if (move.isPawnPromotionMove) {
            const dialog = this.dialog.open(PawnPromotionComponent, {
                disableClose: true,
                data: { currentColor: this.currentTurnColor },
            });
            const promotedType: FigureTypeEnum = await dialog.afterClosed().toPromise();

            if (!promotedType) {
                return;
            }

            this.store.dispatch(gameActions.makePawnPromotionMove({ pawn: this.activeFigure, move, promotedType }));
            this.resetActiveData();
            return;
        }

        if (move.castlingMoveType) {
            this.store.dispatch(gameActions.makeCastling({ king: this.activeFigure, move }));
            this.resetActiveData();
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
