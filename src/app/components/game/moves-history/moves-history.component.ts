import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import * as gameSelectors from '../../../store/game.selectors';
import { Subscription } from 'rxjs';
import { IMovesHistory } from '../../../models/interfaces/moves-history.interface';
import { MatDialogRef } from '@angular/material/dialog';


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
        private dialogRef: MatDialogRef<MovesHistoryComponent>,
    ) {
    }

    ngOnInit(): void {
        this.store.select(gameSelectors.selectMoves).subscribe((moves) => {
            this.moves = moves;
        });
    }

    close(): void {
        this.dialogRef.close({ pisya: true });
    }

    ngOnDestroy(): void {
        this.sub$.unsubscribe();
    }
}
