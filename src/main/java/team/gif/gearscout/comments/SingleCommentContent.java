package team.gif.gearscout.comments;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SingleCommentContent {

	@NotNull(message = "Field 'topic' must not be null")
	@Size(min = 1, max = 32, message = "Field 'topic' must have length between 1 - 32")
	private String topic;

	@NotNull(message = "Field 'content' must not be null")
	@Size(min = 1, max = 1024, message = "Field 'content' must have length between 1 - 1024")
	private String content;

	public String getTopic() {
		return topic;
	}

	public String getContent() {
		return content;
	}

	public void setTopic(String topic) {
		this.topic = topic;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
