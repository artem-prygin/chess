import { ButtonActionEnum } from '../enum/button-action.enum';
import { ThemePalette } from '@angular/material/core';

export interface IButton {
    color: ThemePalette;
    text: string;
    action: ButtonActionEnum;
}
