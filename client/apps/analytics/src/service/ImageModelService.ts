import { ImageInfo, ImageInfoResponse } from '../models';

class ImageModelService {

	createImageInfo = (metadata: ImageInfoResponse[]): ImageInfo[] => {
		return metadata.map((info: ImageInfoResponse): ImageInfo => {
			const url: string = info.imageId
				? `${import.meta.env.VITE_APP_SERVER_URL}/v2/images/${info.imageId}`
				: null;

			return {
				robotNumber: info.robotNumber,
				url: url,
				creator: info.creator,
				timeCreated: info.timeCreated
			};
		});
	};

}

const service = new ImageModelService();
export default service;
