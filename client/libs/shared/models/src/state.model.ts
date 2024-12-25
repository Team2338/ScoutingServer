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
