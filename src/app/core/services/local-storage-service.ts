import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    static getItem(key: string): string {
        return localStorage.getItem(key);
    }

    static removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    static setItem(key: string, value: any): void {
        localStorage.setItem(key, value);
    }
}
