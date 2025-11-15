import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import questionsJSON from "../../../public/questions.json";
import { Observable, Subscription, takeWhile, timer } from "rxjs";

export interface ChaseQuestion {
	question: string;
	correctAnswer: string;
	altAnswer1: string;
	altAnswer2: string;
	altAnswer3: string;
	author?: string;
	createdAt?: string;
}

class SelectedQuestion {
	origin: ChaseQuestion;
	answers: string[];

	constructor(chaseQuestion: ChaseQuestion) {
		this.origin = chaseQuestion;
		this.answers = shuffleArray([
			chaseQuestion.correctAnswer,
			chaseQuestion.altAnswer1,
			chaseQuestion.altAnswer2,
			chaseQuestion.altAnswer3,
		]);
	}
}

enum BoardTile {
	Red = "Red",
	Chaser = "Chaser",
	LBlue = "LBlue",
	Player = "Player",
	DBlue = "DBlue",
}

enum ChaseTurn {
	Player = "Player",
	Chaser = "Chaser",
	Reveal = "Reveal",
	NextQ = "NextQ",
	GameOver = "GameOver",
}

enum FinalChaseTurn {
	Setup = "Setup",
	Player = "Player",
	Intermediate = "Intermediate",
	Chaser = "Chaser",
	GameOver = "GameOver",
}

enum EnabledTab {
	TheChase = "TheChase",
	FinalChase = "FinalChase",
}

function randInt(max: number): number {
	return Math.floor(Math.random() * max);
}

function shuffleArray<T>(array: T[]): T[] {
	// Source - https://stackoverflow.com/questions/60787865/randomize-array-in-angular
	// Posted by Tzimpo
	// Retrieved 2025-11-05, License - CC BY-SA 4.0
	var m = array.length, temp, i;

	while (m) {
		i = Math.floor(Math.random() * m--);
		temp = array[m];
		array[m] = array[i];
		array[i] = temp;
	}

	return array;
}

@Component({
	selector: 'app-chase',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './chase.component.html',
	styleUrl: './chase.component.scss'
})
export class ChaseComponent implements OnInit {
	T = ChaseTurn;
	ET = EnabledTab;

	instruction: string = "Please can the contestant select their answer.";

	questions: ChaseQuestion[] = shuffleArray(questionsJSON.questions);
	selectedQuestion = new SelectedQuestion(this.questions.at(-1)!);
	chasers: string[] = [
		"images/the_chaser_1.png",
		"images/the_chaser_2.png",
		"images/the_chaser_3.png",
	]
	chaserSelected: string = this.chasers[randInt(this.chasers.length)];

	turn: ChaseTurn = ChaseTurn.Player;
	enabledTab: EnabledTab = EnabledTab.TheChase;

	board: BoardTile[] = [];

	chaserPosition: number = 0; // 0 is off the board
	playerPosition: number = 3; // 4 is middle, 4/7. Reach 8 to win

	chaserAnswer: number = 4;
	playerAnswer: number = 4;
	correctAnswer: number = 4;

	ngOnInit(): void {
		this.redrawBoard()
	}

	setTab(tab: EnabledTab): void {
		this.enabledTab = tab;
	}

	// Map the BoardTile enum values to the image file paths.
	getImageRef(tile: BoardTile): string {
		switch (tile) {
			case BoardTile.Red: return "images/red.png";
			case BoardTile.Chaser: return this.chaserSelected;
			case BoardTile.LBlue: return "images/light_blue.png";
			case BoardTile.Player: return "images/contestant.png";
			case BoardTile.DBlue: return "images/dark_blue.png";
			default: return "Invalid enum.";
		}
	}

	// Use playerPosition and chaserPosition to redefine board.
	redrawBoard(): void {
		let tempBoard: BoardTile[] = [
			BoardTile.LBlue, BoardTile.LBlue, BoardTile.LBlue, BoardTile.LBlue, BoardTile.LBlue, BoardTile.LBlue, BoardTile.LBlue,
		]

		if (this.playerPosition < 8) {
			for (let i = 7; i > this.playerPosition; i--) {
				tempBoard[i - 1] = BoardTile.DBlue
			}
			tempBoard[this.playerPosition - 1] = BoardTile.Player;
		}
		if (this.chaserPosition < 8) {
			for (let i = 1; i < this.chaserPosition; i++) {
				tempBoard[i - 1] = BoardTile.Red;
			}
			tempBoard[this.chaserPosition - 1] = BoardTile.Chaser;
		} else {
			tempBoard = [
				BoardTile.Red, BoardTile.Red, BoardTile.Red, BoardTile.Red, BoardTile.Red, BoardTile.Red, BoardTile.Red,
			]
		}

		this.board = tempBoard;
	}

	// Increment playerPosition by 1 and redraw board.
	advancePlayer(): void {
		this.playerPosition++
		this.redrawBoard()
	}

	// Increment chaserPosition by 1 and redraw board.
	advanceChaser(): void {
		this.chaserPosition++
		this.redrawBoard()
	}

	// Reset player/chaserPosition to default and redraw board.
	resetBoard(): void {
		this.chaserSelected = this.chasers[randInt(this.chasers.length)];
		this.chaserPosition = 0;
		this.playerPosition = 3;
		this.nextQuestion();
		this.redrawBoard();
	}

	// To be called when a player selects an answer.
	submitAnswer(index: number): void {
		if (this.turn === ChaseTurn.Player) {
			this.playerAnswer = index;
			this.instruction = "Please can the chaser select their answer.";
			this.turn = ChaseTurn.Chaser;
			return;
		}

		if (this.turn === ChaseTurn.Chaser) {
			this.chaserAnswer = index;
			this.instruction = "Select the button below to reveal the correct answer.";
			this.turn = ChaseTurn.Reveal;
		}
	}

	revealAnswer(): void {
		(this.selectedQuestion.origin.correctAnswer === this.selectedQuestion.answers[this.playerAnswer]) && this.advancePlayer();
		(this.selectedQuestion.origin.correctAnswer === this.selectedQuestion.answers[this.chaserAnswer]) && this.advanceChaser();
		this.correctAnswer = this.selectedQuestion.answers.indexOf(this.selectedQuestion.origin.correctAnswer);
		this.instruction = "Select the button below to go to the next question.";
		this.turn = ChaseTurn.NextQ;

		this.runWinDetection();
	}

	nextQuestion(): void {
		this.chaserAnswer = 4;
		this.playerAnswer = 4;
		this.correctAnswer = 4;
		this.instruction = "Please can the contestant select their answer.";
		this.turn = ChaseTurn.Player;
		this.questions.pop();

		if (this.questions.length === 0) {
			this.questions = shuffleArray(questionsJSON.questions);
		}

		this.selectedQuestion = new SelectedQuestion(this.questions.at(-1)!);
	}

	runWinDetection(): void {
		if (this.chaserPosition >= this.playerPosition) {
			this.instruction = "You have been caught and, for you, the pursuit is over!";
			this.turn = ChaseTurn.GameOver;
		} else if (this.playerPosition >= 8) {
			this.instruction = "You have successfully beaten the chaser!";
			this.turn = ChaseTurn.GameOver;
		}
	}

	// From here on is for the final pursuit.

	contestantHeadstart: number = 1;
	contestantTimer: number = 120;
	chaserTimer: number = 120;
	expected: number = 0;

	second: number = 1000; // Lower to speed up clock for testing purposes.
	source: Observable<number> = timer(this.second, this.second);

	contestantTimerSub: Subscription | null = null;
	chaserTimerSub: Subscription | null = null;

	contestantScore: number = 0;
	chaserScore: number = 0;

	pushbackActive: boolean = false;

	M = Math;
	FCT = FinalChaseTurn;
	fcTurn = FinalChaseTurn.Setup;

	setContestantHeadstart(headstart: number): void {
		this.contestantHeadstart = headstart;
	}

	setContestantTimer(time: number): void {
		this.contestantTimer = time;
	}

	setChaserTimer(time: number): void {
		this.chaserTimer = time;
	}

	fcContestantTurn(): void {
		this.fcNextQuestion();
		this.fcTurn = FinalChaseTurn.Player;
		this.contestantScore = this.contestantHeadstart;
		this.startContestantTimer();
	}

	startContestantTimer(): void {
		this.contestantTimerSub = this.source.pipe(
			takeWhile(_ => this.contestantTimer > 0)
		).subscribe(_ => {
			this.contestantTimer -= 1
			if (this.contestantTimer === 0) {
				this.fcTurn = FinalChaseTurn.Intermediate;
			}
		});
	}

	fcChaserTurn(): void {
		this.fcNextQuestion();
		this.fcTurn = FinalChaseTurn.Chaser;
		this.startChaserTimer();
	}

	startChaserTimer(): void {
		this.chaserTimerSub = this.source.pipe(
			takeWhile(_ => this.chaserTimer > 0)
		).subscribe(_ => {
			this.chaserTimer -= 1
			if (this.chaserTimer === 0) {
				this.fcTurn = FinalChaseTurn.GameOver;
			}
		});
	}

	pauseTimers(): void {
		this.contestantTimerSub && this.contestantTimerSub.unsubscribe();
		this.chaserTimerSub && this.chaserTimerSub.unsubscribe();
	}

	fcCorrectButton(): void {
		switch (this.fcTurn) {
			case FinalChaseTurn.Player:
				this.contestantScore += 1;
				this.fcNextQuestion();
				return;
			case FinalChaseTurn.Chaser:
				this.chaserScore += 1;
				this.fcWinDetection();
				this.fcNextQuestion();
				return;
			default:
				return;
		}
	}

	fcIncorrectButton(): void {
		switch (this.fcTurn) {
			case FinalChaseTurn.Player:
				this.fcNextQuestion();
				return;
			case FinalChaseTurn.Chaser:
				if (this.chaserScore >= 1) {
					this.pauseTimers();
					this.pushbackActive = true;
				} else {
					this.fcNextQuestion();
				}
				return;
			default:
				return;
		}
	}

	fcNextQuestion(): void {
		this.questions.pop();

		if (this.questions.length === 0) {
			this.questions = shuffleArray(questionsJSON.questions);
		}

		this.selectedQuestion = new SelectedQuestion(this.questions.at(-1)!);
	}

	fcWinDetection(): void {
		if (this.chaserScore >= this.contestantScore) {
			this.fcTurn = FinalChaseTurn.GameOver;
		}
	}

	fcPushback(): void {
		this.chaserScore -= 1;
		this.fcContinue();
	}

	fcContinue(): void {
		this.fcNextQuestion();
		this.pushbackActive = false;
		this.startChaserTimer();
	}

	fcReset(): void {
		this.contestantHeadstart = 1;
		this.contestantTimer = 120;
		this.chaserTimer = 120;
		this.expected = 0;

		this.contestantTimerSub?.unsubscribe();
		this.chaserTimerSub?.unsubscribe();

		this.contestantTimerSub = null;
		this.chaserTimerSub = null;

		this.contestantScore = 0;
		this.chaserScore = 0;

		this.pushbackActive = false;

		this.fcTurn = FinalChaseTurn.Setup;
	}


	test(): void {
		this.fcTurn = FinalChaseTurn.Chaser;
		console.log("TEST", this.contestantTimer);
		// console.log("TEST", randInt(3));
		// this.redrawBoard()
	}
}
