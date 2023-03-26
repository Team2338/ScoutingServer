package team.gif.gearscout.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team.gif.gearscout.model.ImageContentEntity;
import team.gif.gearscout.model.ImageInfoEntity;
import team.gif.gearscout.repository.ImageContentRepository;
import team.gif.gearscout.repository.ImageInfoRepository;

import javax.transaction.Transactional;
import java.util.Base64;
import java.util.Optional;

@Service
@Transactional
public class ImageService {
	
	private final ImageInfoRepository imageInfoRepository;
	private final ImageContentRepository imageContentRepository;
	
	@Autowired
	public ImageService(
		ImageInfoRepository imageInfoRepository,
		ImageContentRepository imageContentRepository
	) {
		this.imageInfoRepository = imageInfoRepository;
		this.imageContentRepository = imageContentRepository;
	}
	
	
	public ImageInfoEntity saveImage(
		Integer teamNumber,
		Integer gameYear,
		Integer robotNumber,
		String secretCode,
		String creator,
		String timeCreated,
		byte[] content
	) {
		imageInfoRepository.findImageForRobot(
			teamNumber,
			robotNumber,
			gameYear,
			secretCode
		).ifPresent(imageInfo -> {
			imageInfoRepository.delete(imageInfo);
			imageContentRepository.deleteById(imageInfo.getImageId());
		});
		
		String encodedContent = Base64.getEncoder().encodeToString(content);
		ImageContentEntity imageContentEntity = imageContentRepository.save(
			new ImageContentEntity(encodedContent, secretCode)
		);
		
		ImageInfoEntity createdImage = new ImageInfoEntity(
			teamNumber,
			gameYear,
			secretCode,
			robotNumber,
			creator,
			imageContentEntity.getId(),
			timeCreated
		);
		
		return imageInfoRepository.save(createdImage);
	}
	
	
	public ImageInfoEntity getImageInfo(
		Integer teamNumber,
		Integer gameYear,
		Integer robotNumber,
		String secretCode
	) {
		Optional<ImageInfoEntity> optionalInfo = imageInfoRepository
			.findImageForRobot(
				teamNumber,
				gameYear,
				robotNumber,
				secretCode
			);
		
		ImageInfoEntity info = optionalInfo.orElse(new ImageInfoEntity());
		info.setIsPresent(info.isPresent());
		
		return info;
	}
	
	
	public Optional<byte[]> getImageContent(
		Long imageId,
		String secretCode
	) {
		return imageContentRepository
			.findImageContentForRobot(imageId, secretCode)
			.map(ImageContentEntity::getContent)
			.map(content -> Base64.getDecoder().decode(content));
	}
	
}
