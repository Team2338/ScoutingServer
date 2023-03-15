import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { AppState, LoadStatus } from '../models';
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
