package team.gif.gearscout.images;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import team.gif.gearscout.exception.EmptyFileNotAllowedException;
import team.gif.gearscout.exception.ImageTypeInvalidException;

import javax.transaction.Transactional;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ImageService {
	
	private static final List<String> VALID_CONTENT_TYPES = List.of(
		MediaType.IMAGE_JPEG_VALUE,
		MediaType.IMAGE_PNG_VALUE
	);
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
	
	
	public void validateImage(MultipartFile file)
		throws ImageTypeInvalidException, EmptyFileNotAllowedException
	{
		if (!VALID_CONTENT_TYPES.contains(file.getContentType())) {
			throw new ImageTypeInvalidException(file.getContentType(), VALID_CONTENT_TYPES);
		}
		
		if (file.isEmpty()) {
			throw new EmptyFileNotAllowedException();
		}
	}
	
	
	public String getChecksum(ImageContentEntity image) {
		try {
			byte[] hash = MessageDigest
				.getInstance("MD5")
				.digest(image.getContent());
			return new BigInteger(1, hash).toString(16);
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException("This should be impossible", e);
		}
	}
	
	
	public ImageInfoEntity saveImage(
		Integer teamNumber,
		Integer gameYear,
		Integer robotNumber,
		String eventCode,
		String secretCode,
		String creator,
		String timeCreated,
		byte[] content,
		String contentType
	) {
		imageInfoRepository.findImageForRobot(
			teamNumber,
			gameYear,
			robotNumber,
			eventCode,
			secretCode
		).ifPresent(imageInfo -> {
			imageInfoRepository.delete(imageInfo);
			imageContentRepository.deleteById(imageInfo.getImageId());
		});
		
		ImageContentEntity imageContentEntity = imageContentRepository.save(
			new ImageContentEntity(content, secretCode, contentType)
		);
		
		ImageInfoEntity createdImage = new ImageInfoEntity(
			teamNumber,
			gameYear,
			eventCode,
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
		String eventCode,
		String secretCode
	) {
		Optional<ImageInfoEntity> optionalInfo = imageInfoRepository
			.findImageForRobot(
				teamNumber,
				gameYear,
				robotNumber,
				eventCode,
				secretCode
			);
		
		ImageInfoEntity info = optionalInfo.orElse(new ImageInfoEntity());
		info.setIsPresent(optionalInfo.isPresent());
		
		return info;
	}
	
	
	public Optional<ImageContentEntity> getImageContent(
		Long imageId,
		String secretCode
	) {
		return imageContentRepository
			.findImageContentForRobot(imageId, secretCode);
	}
	
	
	public List<ImageInfoEntity> getImageInfoForEvent(
		Integer teamNumber,
		Integer gameYear,
		String eventCode,
		String secretCode
	) {
		return imageInfoRepository.findImagesForEvent(
			teamNumber,
			gameYear,
			eventCode,
			secretCode
		);
	}
	
}