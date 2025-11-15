import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfoDropdownComponent } from '../info-dropdown/info-dropdown.component';
import questionsJSON from "../../../public/questions.json";
import { ChaseQuestion } from "../chase/chase.component";

// interface Question {
// 	question: string;
// 	answer1: string;
// 	answer2?: string;
// 	answer3?: string;
// 	answer4?: string;
// 	enabled?: boolean;
// 	answered?: boolean;
// }

interface DeletedQuestion {
	question: ChaseQuestion;
	index: number;
}


@Component({
	selector: 'app-make-questions',
	standalone: true,
	imports: [CommonModule, FormsModule, InfoDropdownComponent],
	templateUrl: './make-questions.component.html',
	styleUrl: './make-questions.component.scss'
})
export class MakeQuestionsComponent {
	deletedQuestions: DeletedQuestion[] = [];
	questions: ChaseQuestion[] = questionsJSON.questions;

	removeQuestion(index: number): void {
		this.deletedQuestions.push({
			question: this.questions[index],
			index: index
		} as DeletedQuestion)
		this.questions.splice(index, 1);
	}

	readdQuestion(): void {
		const question: DeletedQuestion | undefined = this.deletedQuestions.pop();
		if (!question) return
		this.questions.splice(question.index, 0, question.question);
	}

	toggleQuestion(index: number): void {
		// this.questions[index].enabled = !this.questions[index].enabled;
	}

	test(): void {
		console.log("TEST", this.questions);
	}
}
