import { IForm, IFormQuestion, IUser } from '../models';
import { ICreateDetailNoteRequest, IDetailNoteQuestion } from '../models/src/RequestModels';

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

}

const service = new FormModelService();
export default service;
