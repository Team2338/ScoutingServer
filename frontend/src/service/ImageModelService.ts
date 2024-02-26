import { ImageInfo, ImageInfoResponse } from '../models';

class ImageModelService {

	createImageInfo = (metadata: ImageInfoResponse[]): ImageInfo[] => {
		return metadata.map((info: ImageInfoResponse): ImageInfo => {
			const url = info.present
				? `${import.meta.env.VITE_APP_SERVER_URL}/v1/images/${info.imageId}`
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
