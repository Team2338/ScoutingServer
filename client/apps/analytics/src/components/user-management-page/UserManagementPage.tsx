import { IUserInfo, LoadStatus } from '@gearscout/models';
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
			{
				users.map((user: IUserInfo) => (
					<div key={ user.id }>
						<div className="username">{ user.username }</div>
						<div className="email">{ user.email }</div>
						<div className="role">{ user.role }</div>
					</div>
				))
			}
		</main>
	);
}
