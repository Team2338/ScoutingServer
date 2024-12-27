import { Inspection, InspectionQuestion } from '../models';
import { IInspectionQuestionResponse } from '@gearscout/models';

class InspectionModelService {

	convertResponsesToModels = (inspections: IInspectionQuestionResponse[]): Inspection[] => {
		if (!inspections || inspections.length === 0) {
			return [];
		}

		const robotNumberToInspections: Map<number, Inspection> = new Map();
		for (const inspection of inspections) {
			const robotNumber: number = inspection.robotNumber;
			if (!robotNumberToInspections.has(robotNumber)) {
				robotNumberToInspections.set(robotNumber, this.generateEmptyInspection(inspection));
			}

			robotNumberToInspections.get(robotNumber)
				.questions
				.push(this.generateQuestion(inspection));
		}

		// Collect map contents into array
		const results: Inspection[] = [];
		robotNumberToInspections.forEach((inspection: Inspection) => {
			results.push(inspection);
		});

		return results;
	};

	generateEmptyInspection = (inspection: IInspectionQuestionResponse): Inspection => {
		return {
			eventCode: inspection.eventCode,
			gameYear: inspection.gameYear,
			robotNumber: inspection.robotNumber,
			questions: []
		};
	};

	generateQuestion = (inspection: IInspectionQuestionResponse): InspectionQuestion => {
		return {
			id: inspection.id,
			question: inspection.question,
			answer: inspection.answer,
			creator: inspection.creator,
			timeCreated: inspection.timeCreated
		};
	};

	getUniqueQuestionNames = (inspections: IInspectionQuestionResponse[]): string[] => {
		const names: string[] = inspections.map(inspection => inspection.question);
		const uniqueNames: Set<string> = new Set(names);
		const results: string[] = [];
		uniqueNames.forEach((name: string) => results.push(name));
		return results;
	};

}

const service = new InspectionModelService();
export default service;
