import { initialState } from './game.state';
import { WhiteBlackEnum } from '../models/enum/white-black.enum';
import { FigureTypeEnum } from '../models/enum/figure-type.enum';
import { ColumnNames } from '../models/enum/column-names.enum';
import { createReducer, on } from '@ngrx/store';
import * as gameActions from './game.actions';
import { LocalStorageService } from '../core/services/local-storage-service';
import { IMovesHistory } from '../models/interfaces/moves-history.interface';
import { IFigure } from '../models/interfaces/figure.interface';
import { CastlingMoveTypeEnum } from '../models/enum/castling-move-type.enum';
import { IFieldPosition } from '../models/interfaces/field-position.interface';


export const GameReducer = createReducer(
    JSON.parse(LocalStorageService.getItem('game')) || initialState,
    on(gameActions.moveFigure, (state, { figure, move }) => {
        const { id, type, column: prevColumn, row: prevRow } = figure;
        const { column: currentColumn, row: currentRow, isCheck, isMate, isStaleMate } = move;

        const eatenFigure: IFigure = [...state.figures]
            .find((f) => f.column === currentColumn && f.row === currentRow);

        const figures: IFigure[] = [...state.figures].map((f) => {
            if (f.id === eatenFigure?.id) {
                return {
                    ...f,
                    column: null,
                    row: null,
                    active: false,
                };
            }

            if (f.id === figure.id) {
                return {
                    ...f,
                    column: currentColumn,
                    row: currentRow,
                    movesCount: f.movesCount > 0 ? f.movesCount + 1 : 1
                };
            }

            return f;
        });

        const currentTurn: WhiteBlackEnum = switchTurn(state.currentTurn);
        const moveNumber: number = state.moves.length > 0
            ? state.moves[state.moves.length - 1].moveNumber + 1
            : 1;
        const prevPosition: IFieldPosition[] = [{ figureID: id, column: prevColumn, row: prevRow, figureType: type }];
        const currentPosition: IFieldPosition[] = [{ figureID: id, column: currentColumn, row: currentRow, figureType: type }];
        if (eatenFigure) {
            prevPosition.push({ figureID: eatenFigure.id, column: currentColumn, row: currentRow });
            currentPosition.push({ figureID: eatenFigure.id, column: null, row: null });
        }
        const newMove: IMovesHistory = {
            moveNumber,
            prevPosition,
            currentPosition,
            isCheck,
            isMate,
            isStaleMate,
        };
        const moves: IMovesHistory[] = [...state.moves, newMove];
        const gameInfo = { currentTurn, moves, figures };
        LocalStorageService.setItem('game', JSON.stringify(gameInfo));
        return gameInfo;
    }),
    on(gameActions.makePawnPromotionMove, (state, { pawn, move, pawnPromotedType }) => {
        const { id, column: prevColumn, row: prevRow } = pawn;
        const { column: currentColumn, row: currentRow, isCheck, isMate, isStaleMate } = move;

        const eatenFigure: IFigure = [...state.figures]
            .find((f) => f.column === currentColumn && f.row === currentRow);

        const figures: IFigure[] = [...state.figures].map((f) => {
            if (f.id !== pawn.id && f.id !== eatenFigure?.id) {
                return f;
            }

            if (f.id === eatenFigure?.id) {
                return {
                    ...f,
                    column: null,
                    row: null,
                    active: false,
                };
            }

            if (f.id === pawn.id) {
                return {
                    ...f,
                    type: pawnPromotedType,
                    column: currentColumn,
                    row: currentRow,
                    movesCount: f.movesCount > 0 ? f.movesCount + 1 : 1
                };
            }
        });

        const currentTurn: WhiteBlackEnum = switchTurn(state.currentTurn);
        const moveNumber: number = state.moves[state.moves.length - 1].moveNumber + 1;
        const prevPosition: IFieldPosition[] = [{ figureID: id, column: prevColumn, row: prevRow }];
        const currentPosition: IFieldPosition[] = [{ figureID: id, column: currentColumn, row: currentRow }];
        if (eatenFigure) {
            prevPosition.push({ figureID: eatenFigure.id, column: currentColumn, row: currentRow });
            currentPosition.push({ figureID: eatenFigure.id, column: null, row: null });
        }
        const newMove: IMovesHistory = {
            moveNumber,
            prevPosition,
            currentPosition,
            isCheck,
            isMate,
            isStaleMate,
            isPawnPromotionMove: true,
        };

        const moves: IMovesHistory[] = [...state.moves, newMove];
        const gameInfo = { currentTurn, moves, figures };
        LocalStorageService.setItem('game', JSON.stringify(gameInfo));
        return gameInfo;
    }),
    on(gameActions.makeEnPassantMove, (state, { pawn, move }) => {
        const { id, column: prevColumn, row: prevRow } = pawn;
        const { column: currentColumn, row: currentRow, isCheck, isMate, isStaleMate } = move;

        const eatenPawn: IFigure = [...state.figures]
            .find((f) => f.column === currentColumn && f.row === prevRow);

        const figures: IFigure[] = [...state.figures].map((f) => {
            if (f.id !== pawn.id && f.id !== eatenPawn?.id) {
                return f;
            }

            if (f.id === eatenPawn?.id) {
                return {
                    ...f,
                    column: null,
                    row: null,
                    active: false,
                };
            }

            if (f.id === pawn.id) {
                return {
                    ...f,
                    column: currentColumn,
                    row: currentRow,
                    movesCount: f.movesCount > 0 ? f.movesCount + 1 : 1
                };
            }
        });

        const currentTurn: WhiteBlackEnum = switchTurn(state.currentTurn);
        const moveNumber: number = state.moves[state.moves.length - 1].moveNumber + 1;
        const prevPosition: IFieldPosition[] = [
            { figureID: id, column: prevColumn, row: prevRow },
            { figureID: eatenPawn.id, column: eatenPawn.column, row: eatenPawn.row },
        ];
        const currentPosition: IFieldPosition[] = [
            { figureID: id, column: currentColumn, row: currentRow },
            { figureID: eatenPawn.id, column: null, row: null },
        ];
        const newMove: IMovesHistory = {
            moveNumber,
            prevPosition,
            currentPosition,
            isCheck,
            isMate,
            isStaleMate,
            isEnPassantMove: true,
        };
        const moves: IMovesHistory[] = [...state.moves, newMove];
        const gameInfo = { currentTurn, moves, figures };
        LocalStorageService.setItem('game', JSON.stringify(gameInfo));
        return gameInfo;
    }),
    on(gameActions.makeCastling, (state, { king, move }) => {
        const { id, column: prevColumn, row: prevRow } = king;
        const { column: currentColumn, row: currentRow, castlingMoveType, isCheck, isMate, isStaleMate } = move;

        const rookColumn = castlingMoveType === CastlingMoveTypeEnum.SHORT
            ? ColumnNames.H
            : ColumnNames.A;
        const rook = [...state.figures]
            .find((f) => f.type === FigureTypeEnum.ROOK
                && f.color === state.currentTurn
                && !f.movesCount
                && f.column === rookColumn);

        const figures: IFigure[] = [...state.figures].map((f) => {
            if (f.id !== king.id && f.id !== rook.id) {
                return f;
            }

            if (f.id === king.id) {
                return {
                    ...f,
                    column: currentColumn,
                    row: currentRow,
                    movesCount: f.movesCount > 0 ? f.movesCount + 1 : 1
                };
            }

            if (f.id === rook.id) {
                return {
                    ...f,
                    column: castlingMoveType === CastlingMoveTypeEnum.SHORT
                        ? rook.column - 2
                        : rook.column + 3,
                    row: rook.row,
                    movesCount: f.movesCount > 0 ? f.movesCount + 1 : 1
                };
            }
        });

        const currentTurn: WhiteBlackEnum = switchTurn(state.currentTurn);
        const moveNumber: number = state.moves[state.moves.length - 1].moveNumber + 1;
        const prevPosition: IFieldPosition[] = [
            { figureID: id, column: prevColumn, row: prevRow },
            { figureID: rook.id, column: rook.column, row: rook.row },
        ];
        const currentPosition: IFieldPosition[] = [
            { figureID: id, column: currentColumn, row: currentRow },
            {
                figureID: rook.id,
                column: figures.find((f) => f.id === rook.id).column,
                row: rook.row,
            },
        ];
        const newMove: IMovesHistory = {
            moveNumber,
            prevPosition,
            currentPosition,
            isCheck,
            isMate,
            isStaleMate,
            castlingMoveType,
        };
        const moves: IMovesHistory[] = [...state.moves, newMove];
        const gameInfo = { currentTurn, moves, figures };
        LocalStorageService.setItem('game', JSON.stringify(gameInfo));
        return gameInfo;
    }),
    on(gameActions.undoMove, (state) => {
        const lastMove: IMovesHistory = [...state.moves].pop();
        if (!lastMove) {
            return state;
        }

        const previousMovedFiguresIDs = lastMove.prevPosition.map((f) => f.figureID);
        const figures: IFigure[] = [...state.figures].map((f) => {
            if (previousMovedFiguresIDs.includes(f.id)) {
                const prevPositionInfo = lastMove.prevPosition
                    .find((position) => position.figureID === f.id);
                return {
                    ...f,
                    column: prevPositionInfo.column,
                    row: prevPositionInfo.row,
                    type: lastMove.isPawnPromotionMove
                        ? FigureTypeEnum.PAWN
                        : f.type,
                    active: true,
                    movesCount: f.movesCount > 1
                        ? f.movesCount - 1
                        : null,
                };
            }

            return f;
        });

        const moves: IMovesHistory[] = [...state.moves].slice(0, -1);
        const currentTurn: WhiteBlackEnum = switchTurn(state.currentTurn);
        const gameInfo = { currentTurn, moves, figures };
        LocalStorageService.setItem('game', JSON.stringify(gameInfo));
        return gameInfo;
    }),
    on(gameActions.resetGame, () => {
        LocalStorageService.removeItem('game');
        return initialState;
    }),
);

const switchTurn = (currentTurn: WhiteBlackEnum): WhiteBlackEnum => {
    return currentTurn === WhiteBlackEnum.WHITE
        ? WhiteBlackEnum.BLACK
        : WhiteBlackEnum.WHITE;
};
