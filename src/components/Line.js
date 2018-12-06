import React from "react";

const Line = ( { text, wordSize } ) =>
	<div style={{ fontSize: `${wordSize}px` }}>{text}</div>;

export default Line;
