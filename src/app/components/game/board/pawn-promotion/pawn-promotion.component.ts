import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FigureTypeEnum } from '../../../../models/enum/figure-type.enum';
import { GameConstants } from '../../../../models/constants/game-constants';
import { WhiteBlackEnum } from '../../../../models/enum/white-black.enum';


@Component({
    selector: 'app-pawn-promotion',
    templateUrl: './pawn-promotion.component.html',
    styleUrls: ['./pawn-promotion.component.scss'],
})
export class PawnPromotionComponent {
    GameConstants = GameConstants;
    promotionFiguresNames: string[] = ['queen', 'rook', 'bishop', 'knight'];
    promotionFiguresTypes: FigureTypeEnum[] = [FigureTypeEnum.QUEEN, FigureTypeEnum.ROOK, FigureTypeEnum.BISHOP, FigureTypeEnum.KNIGHT];
    currentColor: string;

    constructor(
        private dialogRef: MatDialogRef<PawnPromotionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            currentColor: WhiteBlackEnum,
        },
    ) {
        this.currentColor = WhiteBlackEnum.getStringValue(this.data.currentColor);
    }

    chooseFigure(figureType: FigureTypeEnum): void {
        this.dialogRef.close(figureType);
    }
}
