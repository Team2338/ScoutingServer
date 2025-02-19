import './UserManagementPage.scss';
import { IUserInfo, LoadStatus, UserRole } from '@gearscout/models';
import { MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslator } from '../../service/TranslateService';
import { getUsers, updateUserRole, useAppDispatch, useAppSelector } from '../../state';

export default function UserManagementPage() {

	const translate = useTranslator();
	const dispatch = useAppDispatch();

	const currentUser: IUserInfo = useAppSelector(state => state.loginV2.user);
	const loadStatus: LoadStatus = useAppSelector(state => state.userManagement.loadStatus);
	const users: IUserInfo[] = useAppSelector(state => state.userManagement.users);

	useEffect(() => {
		dispatch(getUsers());
	}, [dispatch]);

	const roleOptions = useMemo(() => [UserRole.unverifiedMember, UserRole.verifiedMember, UserRole.admin]
		.map((role: UserRole) => (
			<MenuItem
				key={ role }
				value={ role }
			>
				{ role }
			</MenuItem>
		)), []);


	if (loadStatus === LoadStatus.none || loadStatus === LoadStatus.loading) {
		return <main className="page user-management-page">Loading...</main>;
	}

	if (loadStatus === LoadStatus.failed) {
		return <main className="page user-management-page">Failed to retrieve users!</main>;
	}

	return (
		<main className="page user-management-page">
			<div className="wrapper">
				<h1 className="title">{ translate('USER_MANAGEMENT') }</h1>
				<div className="legend">
					<div>Admin - can modify data</div>
					<div>Verified User - can see list of events</div>
					<div>Unverified User - no privileges</div>
				</div>
				<TableContainer id="table-container">
					<Table aria-label={ translate('USERS') }>
						<TableHead>
							<TableRow>
								<TableCell>{ translate('USERNAME') }</TableCell>
								<TableCell>{ translate('EMAIL') }</TableCell>
								<TableCell id="role-column-title">{ translate('ROLE') }</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								users.map((user: IUserInfo) => (
									<TableRow key={ user.userId }>
										<TableCell>{ user.username }</TableCell>
										<TableCell>{ user.email }</TableCell>
										<TableCell>
											{
												(user.userId === currentUser.userId || user.role === UserRole.superAdmin)
													? (
														<span className="readonly-role">{ user.role }</span>
													) : (
														<Select
															id={ 'role-selector__' + user.userId}
															variant="filled"
															label={ null }
															labelId="role-column-title"
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
