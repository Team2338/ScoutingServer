import { Comment, CommentResponse, CommentsForEvent } from '../models';

class CommentService {

	convertResponsesToModels = (responses: CommentResponse[]): CommentsForEvent => {
		const event: CommentsForEvent = {};

		for (const response of responses) {
			if (!Object.hasOwn(event, response.robotNumber)) {
				event[response.robotNumber] = {};
			}

			if (!Object.hasOwn(event[response.robotNumber], response.topic)) {
				event[response.robotNumber][response.topic] = [];
			}

			event[response.robotNumber][response.topic].push(this.convertResponseToModel(response));
		}

		return event;
	};

	private convertResponseToModel = (response: CommentResponse): Comment => {
		return {
			id: response.id,
			robotNumber: response.robotNumber,
			matchNumber: response.matchNumber,
			topic: response.topic,
			content: response.content,
			creator: response.creator,
			timeCreated: response.timeCreated
		};
	};

	getUniqueTopics = (responses: CommentResponse[]): string[] => {
		const topics = new Set<string>();
		for (const response of responses) {
			topics.add(response.topic);
		}

		return [...topics];
	};

}

const service = new CommentService();
export default service;
