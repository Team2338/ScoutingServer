import { LoadStatus } from '@gearscout/models';

export function getNextStatusOnLoad(previousStatus: LoadStatus): LoadStatus {
	if (
		previousStatus === LoadStatus.success
		|| previousStatus === LoadStatus.loadingWithPriorSuccess
		|| previousStatus === LoadStatus.failedWithPriorSuccess
	) {
		return LoadStatus.loadingWithPriorSuccess;
	}

	return LoadStatus.loading;
}

export function getNextStatusOnFail(previousStatus: LoadStatus): LoadStatus {
	if (previousStatus === LoadStatus.loadingWithPriorSuccess) {
		return LoadStatus.failedWithPriorSuccess;
	}

	return LoadStatus.failed;
}
