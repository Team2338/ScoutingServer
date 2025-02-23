import './UserManagementPage.scss';
import { IUserInfo, LoadStatus, UserRole } from '@gearscout/models';
import {
	Button,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslator } from '../../service/TranslateService';
import { getUsers, updateUserRole, useAppDispatch, useAppSelector } from '../../state';
import { ErrorOutline } from '@mui/icons-material';


const RoleHierarchy: Record<UserRole, number> = {
	[UserRole.guest]: -1,
	[UserRole.unverifiedMember]: 0,
	[UserRole.verifiedMember]: 10,
	[UserRole.admin]: 20,
	[UserRole.superAdmin]: 30
};

export default function UserManagementPage() {
	const translate = useTranslator();
	const dispatch = useAppDispatch();

	const currentUser: IUserInfo = useAppSelector(state => state.loginV2.user);
	const loadStatus: LoadStatus = useAppSelector(state => state.userManagement.loadStatus);
	const users: IUserInfo[] = useAppSelector(state => state.userManagement.users);

	useEffect(() => {
		dispatch(getUsers());
	}, [dispatch]);

	const sortedUsers: IUserInfo[] = useMemo(() => (
		users.toSorted((a: IUserInfo, b: IUserInfo) => (
			(RoleHierarchy[b.role] - RoleHierarchy[a.role])
			|| a.username.localeCompare(b.username)
		))
	), [users]);

	const roleOptions = useMemo(() => [UserRole.unverifiedMember, UserRole.verifiedMember, UserRole.admin]
		.map((role: UserRole) => (
			<MenuItem
				key={ role }
				value={ role }
			>
				{ translate(role) }
			</MenuItem>
		)), [translate]);


	if (loadStatus === LoadStatus.none || loadStatus === LoadStatus.loading) {
		return <main className="page user-management-page">{ translate('LOADING') }</main>;
	}

	if (loadStatus === LoadStatus.failed) {
		return (
			<main className="page user-management-page">
				<div className="wrapper error-wrapper">
					<ErrorOutline id="error-icon" />
					<span>{ translate('FAILED_TO_LOAD_USERS') }</span>
					<Button
						className="retry-button"
						variant="contained"
						disableElevation={ true }
						onClick={ () => dispatch(getUsers()) }
					>
						{ translate('RETRY') }
					</Button>
				</div>
			</main>
		);
	}

	return (
		<main className="page user-management-page">
			<div className="wrapper">
				<h1 className="title">{ translate('USER_MANAGEMENT') }</h1>
				<div className="legend">
					<div>{ translate(UserRole.admin) }</div>
					<span>&nbsp;- { translate('CAN_MODIFY_DATA') }</span>
					<div>{ translate(UserRole.verifiedMember) }</div>
					<span>&nbsp;- { translate('CAN_SEE_EVENT_LIST') }</span>
					<div>{ translate(UserRole.unverifiedMember) }</div>
					<span>&nbsp;- { translate('NO_PRIVILEGES') }</span>
				</div>
				<TableContainer id="table-container">
					<Table aria-label={ translate('USERS') }>
						<TableHead>
							<TableRow>
								<TableCell className="column-title">{ translate('USERNAME') }</TableCell>
								<TableCell className="column-title">{ translate('EMAIL') }</TableCell>
								<TableCell id="role-column-title" className="column-title">{ translate('ROLE') }</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								sortedUsers.map((user: IUserInfo) => (
									<TableRow key={ user.userId }>
										<TableCell>{ user.username }</TableCell>
										<TableCell>{ user.email }</TableCell>
										<TableCell>
											{
												(user.userId === currentUser.userId || user.role === UserRole.superAdmin)
													? (
														<span className="readonly-role">{ translate(user.role) }</span>
													) : (
														<Select
															id={ 'role-selector__' + user.userId}
															variant="filled"
															label={ null }
															labelId="role-column-title"
															fullWidth={ true }
															value={ user.role }
															onChange={ (event) => dispatch(updateUserRole(user.userId, event.target.value as UserRole)) }
														>
															{ roleOptions }
														</Select>
													)
											}
										</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</main>
	);
}
