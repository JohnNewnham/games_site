import { Component } from '@angular/core';

interface ChaseQuestion {
	question: string;
	correctAnswer: string;
	altAnswer1: string;
	altAnswer2: string;
	altAnswer3: string;
}

enum BoardTile {
	Red = "Red",
	Chaser = "Chaser",
	LBlue = "LBlue",
	Player = "Player",
	DBlue = "DBlue",
}

@Component({
	selector: 'app-chase',
	standalone: true,
	imports: [],
	templateUrl: './chase.component.html',
	styleUrl: './chase.component.scss'
})
export class ChaseComponent {
	questions: ChaseQuestion[] = [
		{
			question: "Which one of these anime weren't referred to as being part of the 'Big 3' Shounen anime in the 2000s-early 2010s?",
			correctAnswer: "Dragonball",
			altAnswer1: "Naruto",
			altAnswer2: "One Piece",
			altAnswer3: "Bleach",
		}
	]
	selectedQuestion: ChaseQuestion = this.questions[0];

	board: BoardTile[] = [
		BoardTile.Red,
		BoardTile.Chaser,
		BoardTile.LBlue,
		BoardTile.Player,
		BoardTile.DBlue,
		BoardTile.DBlue,
		BoardTile.DBlue
	];

	chaserPosition: number = 0; // 0 is off the board
	playerPosition: number = 4; // 4 is middle, 4/7. Reach 8 to win

	getImageRef(tile: BoardTile): string {
		switch (tile) {
			case BoardTile.Red: return "images/red.png";
			case BoardTile.Chaser: return "images/the_chaser_1.png";
			case BoardTile.LBlue: return "images/light_blue.png";
			case BoardTile.Player: return "images/contestant.png";
			case BoardTile.DBlue: return "images/dark_blue.png";
			default: return "Invalid enum.";
		}
	}
}
