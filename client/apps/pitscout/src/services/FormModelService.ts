import {
	FormQuestions,
	ICreateInspectionRequest,
	IInspectionQuestion,
	IForm,
	IFormQuestions
} from '../models';
import {
	IEventInfo,
	IInspectionQuestionResponse,
	IUserInfo,
	LoadStatus
} from '@gearscout/models';

class FormModelService {

	convertQuestionsToRequest = (data: {
		user: IUserInfo;
		event: IEventInfo;
		robotNumber: number;
		questions: IFormQuestions;
	}): ICreateInspectionRequest => {
		return {
			robotNumber: data.robotNumber,
			gameYear: data.event.gameYear,
			eventCode: data.event.eventCode,
			questions: Object.keys(data.questions)
				.filter((q: FormQuestions) => data.questions[q]?.length > 0) // TODO: eventually we'll want to allow null
				.map((q: FormQuestions): IInspectionQuestion => ({
					question: q,
					answer: data.questions[q],
					creator: data.user.username
				}))
		};
	};

	convertQuestionsToFormState = (robotNumber: number, questions: IFormQuestions): IForm => {
		return {
			robotNumber: robotNumber,
			error: null,
			loadStatus: null,
			questions: questions
		};
	};


	convertResponseQuestionsToForms = (questions: IInspectionQuestionResponse[]): {
		forms: Record<string, IForm>,
		robots: number[]
	} => {
		const forms: Record<number, IForm> = {};
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
