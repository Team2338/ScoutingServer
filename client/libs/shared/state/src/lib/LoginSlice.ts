import {
	ILoginState,
	ITokenModel,
	IUserInfo,
	LoginErrors,
	LoginStatus
} from '@gearscout/models';
import {
	createAction,
	createReducer
} from '@reduxjs/toolkit';

const initialState: ILoginState = {
	loginStatus: LoginStatus.none,
	error: null,
	role: null,
	tokenString: null,
	token: null,
	user: null
};

export const loginStart = createAction('login/login-start');
export const loginSuccess = createAction<{
	user: IUserInfo,
	token: ITokenModel,
	tokenString: string
}>('login/login-success');
export const loginFailed = createAction<LoginErrors>('login/login-failed');
export const logoutSuccess = createAction('login/logout-success');
export const clearLoginError = createAction('login/clear-error');

export const loginSlice = createReducer(initialState, builder => {
	builder
		.addCase(loginStart, (state: ILoginState) => {
			state.loginStatus = LoginStatus.loggingIn;
			state.error = null;
		})
		.addCase(loginSuccess, (state: ILoginState, action) => {
			state.loginStatus = LoginStatus.loggedIn;
			state.user = action.payload.user;
			state.role = action.payload.user.role;
			state.token = action.payload.token;
			state.tokenString = action.payload.tokenString;
		})
		.addCase(loginFailed, (state: ILoginState, action) => {
			state.loginStatus = LoginStatus.logInFailed;
			state.error = action.payload;
		})
		.addCase(logoutSuccess, () => {
			return initialState;
		})
		.addCase(clearLoginError, (state: ILoginState) => {
			state.error = null;
		});
});
