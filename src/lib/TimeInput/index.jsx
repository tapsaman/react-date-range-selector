import React from 'react';
import PropTypes from 'prop-types';

import ContinuousButton from 'components/ContinuousButton';

export default class TimeInput extends React.Component
{
	constructor(props)
	/* expects as props:
	@ 	date
	@ 	minDate
	@ 	maxDate
	@ 	onChange
	@ 	amPmMode
	*/
	{
		super(props)
	}

	render() {
		const { date, minDate, maxDate, amPmMode } = this.props
		return (
			<table className={"time-input" + (amPmMode ? "am-pm":"")}>
			<tbody>
				<tr>
					<td>
						<ContinuousButton className="unit-button left" event={this.plusHour}>
							<i className="fa fa-chevron-up"/>
						</ContinuousButton>
					</td>
					<td/>
					<td>
						<ContinuousButton className="unit-button right" event={this.plusMinute}>
							<i className="fa fa-chevron-up"/>
						</ContinuousButton>
					</td>
				</tr>

				<tr>
					<td>
					<TimeUnitInput
						min={0}
						max={23}
						value={date.getHours()}
						onChange={this.onHourChange}
						className={"left"}
						/>
					</td>
					<td className="colon">:</td>
					<td>
					<TimeUnitInput
						min={0}
						max={59}
						value={date.getMinutes()}
						onChange={this.onMinuteChange}
						className={"right"}
						/>
					</td>
				</tr>

				<tr>
					<td>
						<ContinuousButton className="unit-button left" event={this.minusHour}>
							<i className="fa fa-chevron-down"/>
						</ContinuousButton>
					</td>
					<td/>
					<td>
						<ContinuousButton className="unit-button right" event={this.minusMinute}>
							<i className="fa fa-chevron-down"/>
						</ContinuousButton>
					</td>

				</tr>
			</tbody>
			</table>
		)
	}

	minusHour = () => {
		const nextDate = new Date(this.props.date)
		nextDate.setHours(nextDate.getHours() - 1)

		this.change(nextDate)
	}

	plusHour = () => {
		const nextDate = new Date(this.props.date)
		nextDate.setHours(nextDate.getHours() + 1)

		this.change(nextDate)
	}

	minusMinute = () => {
		const nextDate = new Date(this.props.date)
		nextDate.setMinutes(nextDate.getMinutes() - 1)

		this.change(nextDate)
	}

	plusMinute = () => {
		const nextDate = new Date(this.props.date)
		nextDate.setMinutes(nextDate.getMinutes() + 1)

		this.change(nextDate)
	}

	onHourChange = (value) => {
		const nextDate = new Date(this.props.date)
		nextDate.setHours(value)

		this.change(nextDate)
	}

	onMinuteChange = (value) => {
		const nextDate = new Date(this.props.date)
		nextDate.setMinutes(value)

		this.change(nextDate)
	}

	change(nextDate) {
		if (nextDate >= this.props.minDate && nextDate <= this.props.maxDate)
			this.props.onChange(nextDate)
	}
}

TimeInput.defaultProps = {
	date: 		new Date(),
	minDate: 	new Date(0),
	maxDate: 	new Date(),
	amPmMode: 	false
}

TimeInput.propTypes = {
	date: 		PropTypes.instanceOf(Date),
	minDate: 	PropTypes.instanceOf(Date),
	maxDate: 	PropTypes.instanceOf(Date),
	onChange: 	PropTypes.func,
	amPmMode: 	PropTypes.bool
}


class TimeUnitInput extends React.Component
{
	constructor(props)
	/* expects as props:
	@	value
	@	min
	@	max
	*/
	{
		super(props)

		this.state = {
			value: props.value
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			value: nextProps.value
		})
	}

	render() {
		return (
			<input type="text" className={"unit-input" + (this.props.className ? " "+this.props.className : "")}
				value={this.state.value}
				onChange={this.inputChange}
				onBlur={this.change}
				/>
		)
	}

	inputChange = (e) => {
		const { min, max } = this.props
		const value = e.currentTarget.value.replace(/[a-z]/gi, "")

		this.setState({
			value: Math.max(min, Math.min(max, value))
		})
	}

	change = () => {
		const { min, max, onChange } = this.props
		const value = this.state.value

		if (isNaN(value) || value < min || value > max)
			this.setState({ value: this.props.value })
		else
			onChange(value)
	}
}