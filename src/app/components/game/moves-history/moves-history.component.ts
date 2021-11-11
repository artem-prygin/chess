import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import * as gameSelectors from '../../../store/game.selectors';
import { Subscription } from 'rxjs';
import { IMovesHistory } from '../../../models/interfaces/moves-history.interface';


@Component({
    selector: 'app-moves-history',
    templateUrl: './moves-history.component.html',
    styleUrls: ['./moves-history.component.scss'],
})
export class MovesHistoryComponent implements OnInit, OnDestroy {
    sub$ = new Subscription();
    moves: IMovesHistory[];

    constructor(
        private store: Store<AppState>,
    ) {
    }

    ngOnInit(): void {
        this.sub$.add(
            this.store.select(gameSelectors.selectMoves).subscribe((moves) => {
                this.moves = moves;
            }),
        );
    }

    ngOnDestroy(): void {
        this.sub$.unsubscribe();
    }
}
