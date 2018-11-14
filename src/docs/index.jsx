import React from "react";
import ReactDOM from "react-dom";

import DateRangeSelector from "../../lib/DateRangeSelector.js";

class Demo extends React.Component {

	constructor(props)
	{
		super(props)
	}

	componentDidCatch(error, info)
	{
		console.error("Demo Error")
		console.error(error, info)
	}

	render()
	{
		return (
			<div>
				<DateRangeSelector 
					min={1514757600000}
					max={1546293600000}
					start={1514757600000}
					end={1546293600000}
					step={3600000}
					/>
			</div>
		)
	}
}

ReactDOM.render(<Demo />, document.getElementById("app"));
