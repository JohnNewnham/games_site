import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-button1',
    standalone: true,
    imports: [],
    templateUrl: './button1.component.html',
    styleUrl: './button1.component.scss'
})
export class Button1Component {

    @Output() buttonPressed = new EventEmitter();
    myBool: boolean = true;

    onClick(): void {
        this.buttonPressed.emit();
    }
}
