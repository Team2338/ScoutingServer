import {
	BasicMap,
	FormQuestions,
	ICreateDetailNoteRequest,
	IDetailNoteQuestion,
	IDetailNoteQuestionResponse,
	IForm,
	IFormQuestions,
	IUser,
	LoadStatus
} from '../models';

class FormModelService {

	convertQuestionsToRequest = (user: IUser, gameYear: number, robotNumber: number, questions: IFormQuestions): ICreateDetailNoteRequest => {
		return {
			robotNumber: robotNumber,
			gameYear: gameYear,
			eventCode: user.eventCode,
			questions: Object.keys(questions).map((q: FormQuestions): IDetailNoteQuestion => ({
				question: q,
				answer: questions[q],
				creator: user.username
			}))
		};
	};

	convertQuestionsToFormState = (user: IUser, robotNumber: number, questions: IFormQuestions): IForm => {
		return {
			robotNumber: robotNumber,
			error: null,
			loadStatus: null,
			questions: questions
		};
	};


	convertResponseQuestionsToForms = (questions: IDetailNoteQuestionResponse[]): {
		forms: BasicMap<IForm>,
		robots: number[]
	} => {
		const forms: BasicMap<IForm> = {};
		const robotNumbers: number[] = [];
		for (const question of questions) {
			if (!Object.hasOwn(forms, question.robotNumber)) {
				forms[question.robotNumber] = {
					loadStatus: LoadStatus.success,
					error: null,
					robotNumber: question.robotNumber,
					questions: {}
				};
				robotNumbers.push(question.robotNumber);
			}

			forms[question.robotNumber].questions[question.question] = question.answer;
		}

		return {
			forms: forms,
			robots: robotNumbers
		};
	};

}

const service = new FormModelService();
export default service;
