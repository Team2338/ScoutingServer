package team.gif.gearscout.shared;

import java.util.Arrays;
import java.util.List;

public class UserRoles {
	public static final String SUPERADMIN = "SUPERADMIN";
	public static final String ADMIN = "ADMIN";
	public static final String VERIFIED_USER = "VERIFIED_MEMBER";
	public static final String UNVERIFIED_USER = "UNVERIFIED_MEMBER";
	public static final List<String> ALL = Arrays.asList(SUPERADMIN, ADMIN, VERIFIED_USER, UNVERIFIED_USER);
}
