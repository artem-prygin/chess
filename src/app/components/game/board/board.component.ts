import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as gameActions from '../../../store/game.actions';
import * as gameSelectors from '../../../store/game.selectors';
import { GameConstants } from '../../../models/constants/game-constants';
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
import { PawnPromotionComponent } from './pawn-promotion/pawn-promotion.component';
import { IMove } from '../../../models/interfaces/move.interface';
import { FigureImageUtil } from '../../../core/utils/figure-image.util';
import { DialogMessageComponent } from '../../shared/dialog-message/dialog-message.component';
import { ButtonActionEnum } from '../../../models/enum/button-action.enum';

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
    lastMove: IMovesHistory;
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
            this.store.select(gameSelectors.selectActiveFigures)
                .subscribe((figures) => {
                    this.figures = figures;
                }),
        );

        this.sub$.add(
            this.store.select(gameSelectors.selectLastMove)
                .subscribe((lastMove) => {
                    this.lastMove = lastMove;
                }),
        );

        this.sub$.add(
            this.store.select(gameSelectors.selectCurrentTurn)
                .subscribe(async (currentTurn) => {
                    if (!this.gameStarted || !this.lastMove) {
                        this.currentTurnColor = currentTurn;
                        this.gameStarted = true;
                        return;
                    }

                    const isMate = this.lastMove.isMate;

                    if (isMate) {
                        console.log('mate');
                        const dialogRef = this.dialog.open(DialogMessageComponent);
                        dialogRef.componentInstance.title = 'Checkmate!';
                        dialogRef.componentInstance.message = `${WhiteBlackEnum.getStringValue(this.currentTurnColor).toUpperCase()} WIN`;
                        dialogRef.componentInstance.buttons = [
                            { color: 'warn', text: 'Reset game', action: ButtonActionEnum.RESET_GAME },
                        ];
                        const resAction = await dialogRef.afterClosed().toPromise();
                        if (resAction === ButtonActionEnum.RESET_GAME) {
                            await this.resetGame();
                        }
                        this.currentTurnColor = WhiteBlackEnum.WHITE;
                        return;
                    }

                    const isStaleMate = this.lastMove.isStaleMate;
                    if (isStaleMate) {
                        console.log('stalemate');
                        const dialogRef = this.dialog.open(DialogMessageComponent);
                        dialogRef.componentInstance.title = 'Stalemate!';
                        dialogRef.componentInstance.message = 'Stalemate!';
                        return;
                    }

                    const isCheck = this.lastMove.isCheck;
                    if (isCheck) {
                        console.log('check');
                    }

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
        this.dirtyPossibleMoves = this.generateDirtyPossibleMoves(figure, this.figures);
        this.filteredMoves = this.verifyCheckService
            .generateFilteredMoves(this.figures, this.dirtyPossibleMoves, this.currentTurnColor, this.activeFigure);
    }

    generateDirtyPossibleMoves(figure: IFigure, figures: IFigure[]): IMove[] {
        switch (figure.type) {
            case FigureTypeEnum.PAWN:
                return this.pawnService.generatePossibleMoves(figure, figures, this.lastMove);
            case FigureTypeEnum.ROOK:
                return this.rookService.generatePossibleMoves(figure, figures);
            case FigureTypeEnum.BISHOP:
                return this.bishopService.generatePossibleMoves(figure, figures);
            case FigureTypeEnum.QUEEN:
                return this.queenService.generatePossibleMoves(figure, figures);
            case FigureTypeEnum.KNIGHT:
                return this.knightService.generatePossibleMoves(figure, figures);
            case FigureTypeEnum.KING:
                return this.kingService.generatePossibleMoves(figure, figures, this.lastMove);
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

    addMoveCheckMateInfo(move: IMove, promotedType?: FigureTypeEnum): void {
        const emulatedFigures = this.figures.map((figure) => {
            if (this.activeFigure.id === figure.id) {
                return {
                    ...figure,
                    column: move.column,
                    row: move.row,
                    type: promotedType || figure.type,
                };
            }

            if (figure.column === move.column && figure.row === move.row && this.activeFigure.id !== figure.id) {
                return {
                    ...figure,
                    active: false,
                };
            }

            return figure;
        }).filter(({ active }) => active);

        const oppositeColor = this.currentTurnColor === WhiteBlackEnum.WHITE
            ? WhiteBlackEnum.BLACK
            : WhiteBlackEnum.WHITE;

        move.isCheck = this.verifyCheckService.verifyCheckAllMoves(emulatedFigures, oppositeColor);
        const hasAvailableMoves = emulatedFigures
            .filter(({ color }) => color === oppositeColor)
            .some((figure) => {
                const dirtyMoves = this.generateDirtyPossibleMoves(figure, emulatedFigures);
                const moves = this.verifyCheckService
                    .generateFilteredMoves(emulatedFigures, dirtyMoves, oppositeColor, figure);
                return moves.length > 0;
            });
        move.isStaleMate = !move.isCheck && !hasAvailableMoves;
        move.isMate = move.isCheck && !hasAvailableMoves;
    }

    async moveFigure(column: number, row: number): Promise<void> {
        const move = this.getMove(column, row);
        if (!move) {
            this.setActiveFigure(column, row);
            return;
        }

        if (move.isPawnPromotionMove) {
            const dialog = this.dialog.open(PawnPromotionComponent, {
                disableClose: true,
                data: { currentColor: this.currentTurnColor },
            });
            const pawnPromotedType: FigureTypeEnum = await dialog.afterClosed().toPromise();

            if (!pawnPromotedType) {
                return;
            }

            this.addMoveCheckMateInfo(move, pawnPromotedType);
            this.store.dispatch(gameActions.makePawnPromotionMove({ pawn: this.activeFigure, move, pawnPromotedType }));
            this.resetActiveData();
            return;
        }

        this.addMoveCheckMateInfo(move);

        if (move.isEnPassantMove) {
            this.store.dispatch(gameActions.makeEnPassantMove({ pawn: this.activeFigure, move }));
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

    async resetGame(confirm = false): Promise<void> {
        if (confirm) {
            const dialogRef = this.dialog.open(DialogMessageComponent);
            dialogRef.componentInstance.title = 'Are you sure you want to reset game?';
            dialogRef.componentInstance.buttons = [
                { color: 'warn', text: 'Reset game', action: ButtonActionEnum.RESET_GAME },
            ];
            const resAction = await dialogRef.afterClosed().toPromise();
            if (resAction === ButtonActionEnum.RESET_GAME) {
                this.store.dispatch(gameActions.resetGame());
                this.resetActiveData();
                this.gameStarted = false;
            }
            return;
        }

        this.store.dispatch(gameActions.resetGame());
        this.resetActiveData();
        this.gameStarted = false;
    }

    undoMove(): void {
        this.store.dispatch(gameActions.undoMove());
        this.resetActiveData();
    }
}
