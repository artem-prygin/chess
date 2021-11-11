import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import * as gameSelectors from '../../../store/game.selectors';
import { IFigure } from '../../../models/interfaces/figure.interface';
import { Observable } from 'rxjs';
import { FigureImageUtil } from '../../../core/utils/figure-image.util';
import { GameConstants } from '../../../models/constants/game-constants';
import { WhiteBlackEnum } from '../../../models/enum/white-black.enum';


@Component({
    selector: 'app-taken-figures',
    templateUrl: './taken-figures.component.html',
    styleUrls: ['./taken-figures.component.scss'],
})
export class TakenFiguresComponent {
    takenWhiteFigures$: Observable<IFigure[]> = this.store.select(gameSelectors.selectTakenFigures(WhiteBlackEnum.WHITE));
    takenBlackFigures$: Observable<IFigure[]> = this.store.select(gameSelectors.selectTakenFigures(WhiteBlackEnum.BLACK));
    FigureImageUtil = FigureImageUtil;
    GameConstants = GameConstants;
    WhiteBlackEnum = WhiteBlackEnum;

    constructor(
        private store: Store<AppState>,
    ) {
    }
}
