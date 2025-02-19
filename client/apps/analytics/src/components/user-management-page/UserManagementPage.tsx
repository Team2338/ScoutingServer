import './UserManagementPage.scss';
import { IUserInfo, LoadStatus } from '@gearscout/models';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect } from 'react';
import { useTranslator } from '../../service/TranslateService';
import { getUsers, useAppDispatch, useAppSelector } from '../../state';

export default function UserManagementPage() {

	const translate = useTranslator();
	const dispatch = useAppDispatch();

	const loadStatus: LoadStatus = useAppSelector(state => state.userManagement.loadStatus);
	const users: IUserInfo[] = useAppSelector(state => state.userManagement.users);

	useEffect(() => {
		dispatch(getUsers());
	}, [dispatch]);

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
				<TableContainer>
					<Table aria-label={ translate('USERS') }>
						<TableHead>
							<TableRow>
								<TableCell>{ translate('USERNAME') }</TableCell>
								<TableCell>{ translate('EMAIL') }</TableCell>
								<TableCell>{ translate('ROLE') }</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								users.map((user: IUserInfo) => (
									<TableRow key={ user.id }>
										<TableCell>{ user.username }</TableCell>
										<TableCell>{ user.email }</TableCell>
										<TableCell>{ user.role }</TableCell>
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
