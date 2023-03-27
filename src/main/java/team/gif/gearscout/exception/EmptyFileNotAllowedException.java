package team.gif.gearscout.exception;

public class EmptyFileNotAllowedException extends RuntimeException {
	
	public EmptyFileNotAllowedException() {
		super("File contents must not be empty.");
	}
	
}
