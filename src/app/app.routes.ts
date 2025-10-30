import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MakeQuestionsComponent } from './make-questions/make-questions.component';
import { ChaseComponent } from './chase/chase.component';
import { PictionaryComponent } from './pictionary/pictionary.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "questions",
        component: MakeQuestionsComponent
    },
    {
        path: "chase",
        component: ChaseComponent
    },
    {
        path: "pictionary",
        component: PictionaryComponent
    },
];
