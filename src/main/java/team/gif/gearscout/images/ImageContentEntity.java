package team.gif.gearscout.images;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

@Entity
@Table(name = "image_content")
public class ImageContentEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private Long id;
	
	@Lob
	@Type(type="org.hibernate.type.BinaryType")
	@Column(name = "content", nullable = false)
	private byte[] content;
	
	@Column(name = "secretCode", nullable = false)
	private String secretCode;
	
	@Column(name = "content_type", nullable = false)
	private String contentType;
	
	public ImageContentEntity() {}
	
	public ImageContentEntity(byte[] content, String secretCode, String contentType) {
		this.content = content;
		this.secretCode = secretCode;
		this.contentType = contentType;
	}
	
	public Long getId() {
		return id;
	}
	
	public byte[] getContent() {
		return content;
	}
	
	public String getSecretCode() {
		return secretCode;
	}
	
	public String getContentType() {
		return contentType;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setContent(byte[] content) {
		this.content = content;
	}
	
	public void setSecretCode(String secretCode) {
		this.secretCode = secretCode;
	}
	
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	
}