import {
	ITokenModel,
	UserRole
} from './auth.model';
import { IUserInfo } from './response.model';

export enum LoginStatus {
	none = 'none',
	loggedIn = 'loggedIn',
	loggingIn = 'loggingIn',
	logInFailed = 'logInFailed'
}

export enum LoadStatus {
	none = 'none',
	loading = 'loading',
	loadingWithPriorSuccess = 'reloading',
	success = 'success',
	failed = 'failed',
	failedWithPriorSuccess = 'failed reload'
}

export interface ILoginState {
	loginStatus: LoginStatus;
	error: LoginErrors;
	role: UserRole;
	token: ITokenModel;
	tokenString: string;
	user: IUserInfo;
}

export enum LoginErrors { // TODO: use translation keys
	unauthorized = 'You are not authorized to use this app yet',
	unknown = 'Oops, something went wrong'
}
