package team.gif.gearscout.images;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.SequenceGenerator;
import org.hibernate.annotations.JavaType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import org.hibernate.type.SqlTypes;
import org.hibernate.type.descriptor.java.ByteArrayJavaType;

@Entity
@Table(name = "image_content")
public class ImageContentEntity {
	
	@Id
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	@GeneratedValue(
		strategy = GenerationType.SEQUENCE,
		generator = "image_content_seq"
	)
	@SequenceGenerator(
		name = "image_content_seq",
		allocationSize = 1
	)
	private Long id;
	
	@Lob
//	@Type(type="org.hibernate.type.BinaryType")
	@JdbcTypeCode(SqlTypes.VARBINARY)
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
