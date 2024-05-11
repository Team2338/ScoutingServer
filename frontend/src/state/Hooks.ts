import { useEffect, useState } from 'react';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, LoadStatus, LoginStatus } from '../models';
import { getAllData } from './Effects';
import type { AppDispatch } from './Store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const useDataInitializer = () => {
	const dispatch = useAppDispatch();
	const matchLoadStatus: LoadStatus = useAppSelector(state => state.matches.loadStatus);

	useEffect(
		() => {
			if (matchLoadStatus === LoadStatus.none) {
				dispatch(getAllData());
			}
		},
		[dispatch, matchLoadStatus]
	);
};

export const useDebounce = <T>(value: T, delay: number): T => {
	// State and setters for debounced value
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
	useEffect(
		() => {
			// Update debounced value after delay
			const handler = setTimeout(
				() => {
					setDebouncedValue(value);
				},
				delay
			);
			// Cancel the timeout if value changes (also on delay change or unmount)
			// This is how we prevent debounced value from updating if value is changed ...
			// .. within the delay period. Timeout gets cleared and restarted.
			return () => {
				clearTimeout(handler);
			};
		},
		[value, delay] // Only re-call effect if value or delay changes
	);

	return debouncedValue;
};

export const useIsLoggedInSelector = (): boolean => {
	const loginStatus: LoginStatus = useAppSelector(state => state.loginV2.loginStatus);

	return (loginStatus === LoginStatus.guest || loginStatus === LoginStatus.loggedIn);
};

export const useUsernameSelector = (): string => {
	return useAppSelector(state => state.loginV2.user?.username);
};
