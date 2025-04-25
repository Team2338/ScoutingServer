package team.gif.gearscout.images.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.JdbcTypeCode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "image_content")
public class ImageContentEntity {
	
	@Id
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	@Lob
	@JdbcTypeCode(SqlTypes.VARBINARY)
	@Column(name = "content", nullable = false)
	private byte[] content;
	
	@Column(name = "content_type", nullable = false)
	private String contentType;
	
	public ImageContentEntity() {}
	
	public ImageContentEntity(byte[] content, String contentType) {
		this.content = content;
		this.contentType = contentType;
	}
	
	public UUID getId() {
		return id;
	}
	
	public byte[] getContent() {
		return content;
	}
	
	public String getContentType() {
		return contentType;
	}
	
	public void setId(UUID id) {
		this.id = id;
	}
	
	public void setContent(byte[] content) {
		this.content = content;
	}
	
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	
}
