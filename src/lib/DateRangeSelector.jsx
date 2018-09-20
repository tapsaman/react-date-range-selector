import React from 'react';
import PropTypes from 'prop-types';

import Slider from './Slider';

export default class DateRangeSelector extends React.Component {
	
	constructor(props)
	/* expects as props:
	@	min			| number
	@	max			| number
	@	start 		| number
	@ 	end 		| number
	@	controlled 	| bool
	@	marks 		| object array
	@ 	onChange	| onChange
	*/
	{
		super(props)

		this.state = { 
			start: 	props.start || props.min,
			end: 	props.end 	|| props.max
		}
	}

	render()
	{
		const { slider, min, max } = this.props
		const { start, end } = this.state

		return (
			<div className="drs-container">
				{slider
					?	<Slider
							min={min}
							max={max}
							start={start}
							end={end}
							onChange={this.change}
							/>
					:	null
				}
			</div>
		)
	}

	change = (start, end) => {
		const { controlled, onChange } = this.props
		
		if (controlled) {
			this.setState({
				start, end
			})
		}
		if (onChange) {
			onChange(start, end)
		}
	}
}

DateRangeSelector.defaultProps = {
	slider: 		true
}

DateRangeSelector.propTypes = {
	min: 			PropTypes.number.isRequired,
	max: 			PropTypes.number.isRequired,
	start: 			validateStartEnd,
	end: 			validateStartEnd,
	controlled: 	PropTypes.bool,
	slider: 		PropTypes.bool,
	marks: 			PropTypes.arrayOf(PropTypes.exact({
						date: 		PropTypes.number,
						start: 		PropTypes.number,
						end: 		PropTypes.number,
						tooltip: 	PropTypes.string,
						color: 		PropTypes.string
					})),
	onChange: 		PropTypes.func
}

function validateStartEnd(props, propName, componentName)
{
	if (typeof props[propName] !== "number")
	{
		return new Error('Invalid prop `' + propName + '` supplied to' +
        	' `' + componentName + '`. Expected a number.')
	}
	if (props.controlled && props[propName] === undefined)
	{
		return new Error("Prop '" + propName + "' required when '" + componentName
			+ "' is in 'controlled' mode.")
	}
}