package team.gif.gearscout.comments;

import javax.validation.constraints.Size;

public class SingleCommentContent {

	@Size(min = 1, max = 32)
	private String topic;

	@Size(min = 1, max = 1024)
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
