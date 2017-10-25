import cx from 'classnames';

const SyncStatus = ( { className, status } ) => {

	const { text } = status;

	const classes = cx(
		'sync-status',
		className
	);

	return (
		<div className={classes}>
			syncStatus: {text}
		</div>
	);

};

export default SyncStatus;
