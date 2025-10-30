import { Component, Input } from "@angular/core";
import { trigger, state, style, animate, transition } from "@angular/animations";

enum DropdownState {
	closed = "closed",
	open = "open",
}

@Component({
	selector: "app-info-dropdown",
	standalone: true,
	imports: [],
	templateUrl: "./info-dropdown.component.html",
	styleUrl: "./info-dropdown.component.scss",
	animations: [
		trigger("rotatedState", [
			state("closed", style({ transform: "rotate(0)" })),
			state("open", style({ transform: "rotate(-180deg)" })),
			transition("open => closed", animate("200ms ease-in")),
			transition("closed => open", animate("200ms ease-in"))
		]),
		trigger("dropdownState", [
			state("closed", style({ height: 0, overflow: "hidden" })),
			state("open", style({ height: "*", overflow: "hidden" })),
			transition("open => closed", animate("200ms ease-in")),
			transition("closed => open", animate("200ms ease-in"))
		]),
	],
})
export class InfoDropdownComponent {
	@Input() title: string = "Header title";

	DS = DropdownState;
	state: DropdownState = DropdownState.closed;
	rotate(): void {
		this.state = (this.state === DropdownState.closed) ? DropdownState.open : DropdownState.closed;
	}
}
