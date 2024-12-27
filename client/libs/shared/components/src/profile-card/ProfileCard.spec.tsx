import { render } from '@testing-library/react';
import { ProfileCard } from './ProfileCard';
import {
	IEventInfo,
	IUserInfo,
	UserRole
} from '@gearscout/models';

describe('ProfileCard', () => {

	const mockUser: IUserInfo = {
		id: 0,
		username: 'Patrick',
		teamNumber: 9999,
		role: UserRole.verifiedMember,
		email: 'mock@email.com'
	};

	const mockEvent: IEventInfo = {
		teamNumber: 9999,
		gameYear: 2024,
		eventCode: 'mock event code',
		secretCode: 'secret',
		matchCount: null,
		inspectionCount: null
	};

	it('should render without event info', () => {
		const { baseElement } = render(<ProfileCard user={ mockUser }/>);
		expect(baseElement).toBeTruthy();
	});

	it('should render when event info is null', () => {
		const { baseElement } = render(<ProfileCard user={ mockUser } selectedEvent={ null }/>);
		expect(baseElement).toBeTruthy();
	});

	it('should render when event info is null', () => {
		const { baseElement } = render(<ProfileCard user={ mockUser } selectedEvent={ mockEvent }/>);
		expect(baseElement).toBeTruthy();
	});
});
