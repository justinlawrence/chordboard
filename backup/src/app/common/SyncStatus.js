import React from 'react';
import cx from 'classnames';

const SyncStatus = ( { className, status } ) => {

	const { text } = status;

	const classes = cx(
		'sync-status',
		className
	);

	let statusClass = 'icon ';
	let statusText = '';

	if (text === 'paused') {
		statusClass += 'has-text-success';
		statusText = 'online';
	} else {
		statusClass += 'has-text-warning';
		statusText = 'offline';
	}

	return (
		<div className={classes} title={text}>
			<span className={statusClass}>
			  <i className="fa fa-circle"></i>
			</span>
			{statusText}
		</div>

	);

};

export default SyncStatus;
