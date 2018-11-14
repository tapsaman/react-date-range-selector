import React from "react"
import PropTypes from "prop-types"

import Slider from "./Slider"

export default class DateRangeSelector extends React.Component {
	
	static propTypes = {
		min: 			PropTypes.number.isRequired,
		max: 			PropTypes.number.isRequired,
		//start: 			PropTypes.number.isRequired,
		//end: 			PropTypes.number.isRequired,
		step:			PropTypes.number,
		onChange:		PropTypes.func,
		//marks: 			PropTypes.arrayOf(PropTypes.object),
		showSlider:		PropTypes.bool,

		start: 			validateStartEnd,
		end: 			validateStartEnd,
		controlled: 	PropTypes.bool,
		sliderProps:	PropTypes.object,

		marks: 			PropTypes.arrayOf(
			PropTypes.exact({
				date: 		PropTypes.number,
				start: 		PropTypes.number,
				end: 		PropTypes.number,
				tooltip: 	PropTypes.string,
				color: 		PropTypes.string
			}))
	}

	static defaultProps = {
		showSlider:		true
	}

	constructor(props)
	{
		super(props)

		this.state = { 
			start: 	props.start || props.min,
			end: 	props.end 	|| props.max
		}
	}

	render()
	{
		const { showSlider, min, max, step, sliderProps } = this.props
		const { start, end } = this.state

		return (
			<div className="drs-container">
				{showSlider
					?	<Slider
							min={min}
							max={max}
							start={start}
							end={end}
							step={step}
							onChange={this.sliderChange}
							formatValue={formatDate}
							controlled={true}
							{...sliderProps}
							/>
					:	null
				}
			</div>
		)
	}

	// slider change wanha
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

	sliderChange = (start, end) => {
		this.setState({
			start, end
		})
	}
}

function validateStartEnd(props, propName, componentName)
{
	if (typeof props[propName] !== "number")
	{
		return new Error("Invalid prop `" + propName + "` supplied to `"
			+ componentName + "`. Expected a number.")
	}
	if (props.controlled && props[propName] === undefined)
	{
		return new Error("Prop '" + propName + "' required when '" + componentName
			+ "' is in 'controlled' mode.")
	}
}

function formatDate(dateMs) {
	const d = new Date(dateMs)
	return d.toLocaleDateString() + " " + d.toLocaleTimeString()
}