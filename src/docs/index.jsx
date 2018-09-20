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
					min={0}
					max={1000}
					start={900}
					end={1000}
					/>
			</div>
		)
	}
}

ReactDOM.render(<Demo />, document.getElementById("app"));
