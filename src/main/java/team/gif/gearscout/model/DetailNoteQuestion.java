package team.gif.gearscout.model;

import javax.validation.constraints.Size;

public class DetailNoteQuestion {

	@Size(min = 1, max = 32)
	private String question;

	@Size(min = 1, max = 1024)
	private String answer;

	@Size(min = 1, max = 32)
	private String creator;


	public DetailNoteQuestion() {}


	public String getQuestion() {
		return question;
	}

	public String getAnswer() {
		return answer;
	}

	public String getCreator() {
		return creator;
	}


	public void setQuestion(String question) {
		this.question = question;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

}
