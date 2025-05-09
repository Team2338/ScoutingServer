package team.gif.gearscout.matches.preprocessor;

import team.gif.gearscout.matches.model.CreateMatchRequest;

public interface MatchPreprocessor {

	void process(CreateMatchRequest match);

}
