import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-navbar',
	standalone: true,
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.css',
	imports: [RouterLink]
})
export class NavbarComponent { }
