import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfoDropdownComponent } from '../info-dropdown/info-dropdown.component';

interface Question {
	question: string;
	answer1: string;
	answer2?: string;
	answer3?: string;
	answer4?: string;
	enabled?: boolean;
	answered?: boolean;
}

interface DeletedQuestion {
	question: Question;
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
	questions: Question[] = [
		{
			question: "Question 1",
			answer1: "Answer 1",
			answer2: "Answer 2",
			answer3: "Answer 3",
			answer4: "Answer 4",
			enabled: true,
			answered: false
		},
		{
			question: "Question 2",
			answer1: "Answer 1",
			answer2: "Answer 2",
			answer3: "Answer 3",
			answer4: "Answer 4",
			enabled: false,
			answered: false
		}
	];

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
		this.questions[index].enabled = !this.questions[index].enabled;
	}

	test(): void {
		console.log("TEST", this.questions);
	}
}
