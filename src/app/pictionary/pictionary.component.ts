import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

enum EnabledTab {
	Questions = "Questions",
	Pictionary = "Pictionary",
}

enum ItemType {
	Character = "Character",
	Show = "Show",
}

enum WhatEnabled {
	Characters = "Characters",
	Shows = "Shows",
	All = "All",
}

class PictionaryItem {
	type: ItemType;
	showName: string;
	characterName?: string;
	imageUrl?: string;
	enabled: boolean;
	guessed: boolean;

	constructor(type: ItemType, showName: string, characterName?: string, imageUrl?: string, enabled: boolean = true, guessed: boolean = false) {
		this.type = type;
		this.showName = showName;
		this.characterName = (this.type === ItemType.Character) ? characterName : undefined;
		this.imageUrl = imageUrl;
		this.enabled = enabled;
		this.guessed = guessed;
	}
}

@Component({
	selector: 'app-pictionary',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './pictionary.component.html',
	styleUrl: './pictionary.component.scss'
})
export class PictionaryComponent implements OnInit {
	ET = EnabledTab;
	enabledTab = EnabledTab.Questions;

	WE = WhatEnabled;
	whatEnabled = WhatEnabled.All;

	allowGuessed = false;

	item1: PictionaryItem = new PictionaryItem(ItemType.Character, "My Hero Academia", "All Might", "https://static.wikia.nocookie.net/bokunoheroacademia/images/c/cd/Toshinori_Yagi_Golden_Age_Hero_Costume_%28Anime%29.png");
	item2: PictionaryItem = new PictionaryItem(ItemType.Show, "Noragami", undefined, "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.crunchyroll.com%2Fseries%2FG6WEV3WM6%2Fnoragami%3Fsrsltid%3DAfmBOorAun43tTaxZkSGBeHOMFMg4uOl9Hnuh9rDCO_6u_U2UrW3caiz&psig=AOvVaw28qyPYzwSxS27CSlVHlM9u&ust=1761675900666000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCIjBoqWAxZADFQAAAAAdAAAAABAE");

	questions: PictionaryItem[] = [this.item1, this.item2];
	questionsEnabled: PictionaryItem[] = [];
	questionsUnguessed: PictionaryItem[] = [];

	ngOnInit(): void {
		this.updateQuestionLists();
	}

	updateQuestionLists(): void {
		this.questionsEnabled = this.questions
			.filter(question => question.enabled == true)
			.filter(question => {
				switch (this.whatEnabled) {
					case WhatEnabled.Characters: return question.type == ItemType.Character;
					case WhatEnabled.Shows: return question.type == ItemType.Show;
					default: return true;
				}
			});

		this.questionsUnguessed = this.questionsEnabled
			.filter(question => !question.guessed);
	}

	setTab(tab: EnabledTab): void {
		this.enabledTab = tab;
	}

	setWhatEnabled(enabled: WhatEnabled): void {
		this.whatEnabled = enabled;
		this.updateQuestionLists();
	}

	setAllowGuessed(allowGuessed: boolean): void {
		this.allowGuessed = allowGuessed;
	}

	toggleQuestion(index: number): void {
		this.questions[index].enabled = !this.questions[index].enabled;
		this.updateQuestionLists();
	}

	toggleGuessed(index: number): void {
		this.questions[index].guessed = !this.questions[index].guessed;
		this.updateQuestionLists();
	}
}
