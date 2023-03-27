package team.gif.gearscout.model;

import com.fasterxml.jackson.annotation.JsonProperty;

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
	@Column(name = "content", nullable = false)
	private byte[] content;
	
	@Column(name = "secretCode", nullable = false)
	private String secretCode;
	
	public ImageContentEntity() {}
	
	public ImageContentEntity(byte[] content, String secretCode) {
		this.content = content;
		this.secretCode = secretCode;
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
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setContent(byte[] content) {
		this.content = content;
	}
	
	public void setSecretCode(String secretCode) {
		this.secretCode = secretCode;
	}
	
}
