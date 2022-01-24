package team.gif.gearscout.exception;

public class MatchNotFoundException extends RuntimeException {
	
	public MatchNotFoundException(Long matchId) {
		super("Could not find match " + matchId);
	}
	
}
