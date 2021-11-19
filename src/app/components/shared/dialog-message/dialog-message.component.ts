import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IButton } from '../../../models/interfaces/button.interface';
import { ButtonActionEnum } from '../../../models/enum/button-action.enum';

@Component({
    selector: 'app-dialog-message',
    templateUrl: './dialog-message.component.html',
    styleUrls: ['./dialog-message.component.scss'],
})
export class DialogMessageComponent implements OnInit {
    title: string;
    message: string;
    buttons: IButton[];

    constructor(
        private dialogRef: MatDialogRef<DialogMessageComponent>,
    ) {
    }

    ngOnInit(): void {
    }

    close(): void {
        this.dialogRef.close();
    }

    emitAction(action: ButtonActionEnum): void {
      this.dialogRef.close(action);
    }
}
