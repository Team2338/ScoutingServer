package team.gif.gearscout.v2022.model

import com.fasterxml.jackson.annotation.JsonProperty

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Table
import javax.validation.constraints.Size

@Entity
@Table(name = "matches_2022")
class Match22 {

	public static String getCsvHeader() {
		StringBuilder sb = new StringBuilder()
			.append("robot_num,")
			.append("match_num,")
			.append("scouter,")
			.append("taxi,")
			.append("auto_high_goal,")
			.append("auto_low_goal,")
			.append("auto_miss,")
			.append("teleop_high_goal,")
			.append("teleop_low_goal,")
			.append("teleop_miss,")
			.append("climb")

		return sb.toString()
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	Long id

	@Column(nullable = false)
	Integer teamNumber // Team num of data collector

	@Column(nullable = false)
	String secretCode // For restricting access to team's data

	@Column(nullable = false)
	@Size(min = 1, max = 32)
	String eventCode

	@Column(nullable = false)
	Integer matchNumber

	@Column(nullable = false)
	Integer robotNumber // Team num of robot being scouted

	@Column(nullable = false)
	@Size(min = 1, max = 32)
	String creator // Username of the scouter that created this entry

	@Column(nullable = false)
	String timeCreated

	@Column(nullable = false)
	boolean isHidden

	@Column(nullable = false)
	Integer taxi

	@Column(nullable = false)
	Integer autoHighGoals

	@Column(nullable = false)
	Integer autoLowGoals

	@Column(nullable = false)
	Integer autoMiss

	@Column(nullable = false)
	Integer teleopHighGoals

	@Column(nullable = false)
	Integer teleopLowGoals

	@Column(nullable = false)
	Integer teleopMiss

	@Column(nullable = false)
	Integer climb


	Match22() {}

	Match22(
		NewMatch22 match,
		Integer teamNumber,
		String secretCode,
		String timeCreated
	) {
		this.teamNumber = teamNumber
		this.secretCode = secretCode
		this.eventCode = match.getEventCode()
		this.matchNumber = match.getMatchNumber()
		this.robotNumber = match.getRobotNumber()
		this.creator = match.getCreator()
		this.timeCreated = timeCreated
		this.isHidden = false
		this.taxi = match.getTaxi()
		this.autoHighGoals = match.getAutoHighGoals()
		this.autoLowGoals = match.getAutoLowGoals()
		this.autoMiss = match.getAutoMiss()
		this.teleopHighGoals = match.getTeleopHighGoals()
		this.teleopLowGoals = match.getTeleopLowGoals()
		this.teleopMiss = match.getTeleopMiss()
		this.climb = match.getClimb()
	}


	String toCsv() {
		StringBuilder sb = new StringBuilder()
			.append(robotNumber).append(",")
			.append(matchNumber).append(",")
			.append(creator).append(",")
			.append(taxi).append(",")
			.append(autoHighGoals).append(",")
			.append(autoLowGoals).append(",")
			.append(autoMiss).append(",")
			.append(teleopHighGoals).append(",")
			.append(teleopLowGoals).append(",")
			.append(teleopMiss).append(",")
			.append(climb)

		return sb.toString()
	}
}
