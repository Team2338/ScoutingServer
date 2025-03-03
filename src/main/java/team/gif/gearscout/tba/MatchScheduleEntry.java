package team.gif.gearscout.tba;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.*;

import org.json.*;

import java.util.Optional;
import java.util.ArrayList;

public class MatchScheduleEntry implements Comparable<MatchScheduleEntry> {
    private static final Logger logger = LogManager.getLogger(MatchScheduleEntry.class);

    int matchNumber;
    int red1;
    int red2;
    int red3;
    int blue1;
    int blue2;
    int blue3;

    public MatchScheduleEntry(int matchNumber, int red1, int red2, int red3, int blue1, int blue2, int blue3) {
        this.matchNumber = matchNumber;
        this.red1 = red1;
        this.red2 = red2;
        this.red3 = red3;
        this.blue1 = blue1;
        this.blue2 = blue2;
        this.blue3 = blue3;
    }

    public static MatchScheduleEntry fromTbaJson(JSONObject json) {
        if (!json.getString("comp_level").equals("qm")) {
            return null;
        }

        JSONObject alliances = json.getJSONObject("alliances");
        JSONArray redTeamKeys = alliances.getJSONObject("red")
            .getJSONArray("team_keys");
        ArrayList<Integer> redTeams = getTeamNumbers(redTeamKeys);

        JSONArray blueTeamKeys = alliances.getJSONObject("blue")
            .getJSONArray("team_keys");
        ArrayList<Integer> blueTeams = getTeamNumbers(blueTeamKeys);

        int matchNumber = json.optInt("match_number", 0);

        return new MatchScheduleEntry(matchNumber,
            redTeams.size() > 0 ? redTeams.get(0) : 0,
            redTeams.size() > 1 ? redTeams.get(1) : 0,
            redTeams.size() > 2 ? redTeams.get(2) : 0,
            blueTeams.size() > 0 ? blueTeams.get(0) : 0,
            blueTeams.size() > 1 ? blueTeams.get(1) : 0,
            blueTeams.size() > 2 ? blueTeams.get(2) : 0
        );
    }

    private static ArrayList<Integer> getTeamNumbers(JSONArray teamKeys) {
        ArrayList<Integer> result = new ArrayList();
        for (int i = 0; i < teamKeys.length(); ++i) {
            String val = teamKeys.optString(i, "frc0").substring(3);
            result.add(Integer.parseInt(val));
        }
        return result;
    }

    @JSONPropertyName("matchNumber")
    public int getMatchNumber() {
        return matchNumber;
    }

    @JSONPropertyName("red1")
    public int getRed1() {
        return red1;
    }

    @JSONPropertyName("red2")
    public int getRed2() {
        return red2;
    }

    @JSONPropertyName("red3")
    public int getRed3() {
        return red3;
    }

    @JSONPropertyName("blue1")
    public int getBlue1() {
        return blue1;
    }

    @JSONPropertyName("blue2")
    public int getBlue2() {
        return blue2;
    }

    @JSONPropertyName("blue3")
    public int getBlue3() {
        return blue3;
    }

    @Override
    public int compareTo(MatchScheduleEntry b) {
        return Integer.compare(getMatchNumber(), b.getMatchNumber());
    }
}
