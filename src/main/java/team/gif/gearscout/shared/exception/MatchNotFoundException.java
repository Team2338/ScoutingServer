package team.gif.gearscout.shared.exception;

public class MatchNotFoundException extends RuntimeException {
	
	public MatchNotFoundException(Long matchId) {
		super("Could not find match " + matchId);
	}
	
}
