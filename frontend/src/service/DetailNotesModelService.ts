import { DetailNote, DetailNoteQuestion, DetailNoteQuestionResponse } from '../models';

class DetailNotesModelService {

	convertResponsesToModels = (notes: DetailNoteQuestionResponse[]): DetailNote[] => {
		if (!notes || notes.length === 0) {
			return [];
		}

		const robotNumberToNotes: Map<number, DetailNote> = new Map();
		for (const note of notes) {
			const robotNumber: number = note.robotNumber;
			if (!robotNumberToNotes.has(robotNumber)) {
				robotNumberToNotes.set(robotNumber, this.generateEmptyNote(note));
			}

			robotNumberToNotes.get(robotNumber)
				.questions
				.push(this.generateQuestion(note));
		}

		// Collect map contents into array
		const results: DetailNote[] = [];
		robotNumberToNotes.forEach((note: DetailNote) => {
			results.push(note);
		});

		return results;
	};

	generateEmptyNote = (note: DetailNoteQuestionResponse): DetailNote => {
		return {
			eventCode: note.eventCode,
			gameYear: note.gameYear,
			robotNumber: note.robotNumber,
			questions: []
		};
	};

	generateQuestion = (note: DetailNoteQuestionResponse): DetailNoteQuestion => {
		return {
			id: note.id,
			question: note.question,
			answer: note.answer,
			creator: note.creator,
			timeCreated: note.timeCreated
		};
	};

	getUniqueQuestionNames = (notes: DetailNoteQuestionResponse[]): string[] => {
		const names: string[] = notes.map(note => note.question);
		const uniqueNames: Set<string> = new Set(names);
		const results: string[] = [];
		uniqueNames.forEach((name: string) => results.push(name));
		return results;
	};

}

const service = new DetailNotesModelService();
export default service;
