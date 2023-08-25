import {
	BasicMap,
	ICreateDetailNoteRequest,
	IDetailNoteQuestion,
	IDetailNoteQuestionResponse,
	IForm,
	IFormQuestion,
	IUser,
	LoadStatus
} from '../models';

class FormModelService {

	convertQuestionsToRequest = (user: IUser, robotNumber: number, questions: IFormQuestion[]): ICreateDetailNoteRequest => {
		return {
			robotNumber: robotNumber,
			gameYear: 2023,
			eventCode: user.eventCode,
			questions: questions.map((q: IFormQuestion): IDetailNoteQuestion => ({
				question: q.question,
				answer: q.answer,
				creator: user.username
			}))
		};
	};

	convertQuestionsToFormState = (user: IUser, robotNumber: number, questions: IFormQuestion[]): IForm => {
		return {
			robotNumber: robotNumber,
			error: null,
			loadStatus: null,
			questions: questions
		};
	}


	convertResponseQuestionsToForms = (questions: IDetailNoteQuestionResponse[]): {
		forms: BasicMap<IForm>,
		robots: number[]
	} => {
		const forms: BasicMap<IForm> = {};
		const robotNumbers = [];
		for (const question of questions) {
			if (!forms.hasOwnProperty(question.robotNumber)) {
				forms[question.robotNumber] = {
					loadStatus: LoadStatus.success,
					error: null,
					robotNumber: question.robotNumber,
					questions: []
				};
				robotNumbers.push(question.robotNumber);
			}

			forms[question.robotNumber].questions.push({
				question: question.question,
				answer: question.answer
			});
		}

		return {
			forms: forms,
			robots: robotNumbers
		};
	};

}

const service = new FormModelService();
export default service;
