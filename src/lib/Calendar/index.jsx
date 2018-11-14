import React from 'react';
import PropTypes from 'prop-types';
import Velocity from 'velocity-animate';
import { VelocityTransitionGroup } from 'velocity-react';
import { daysInMonth, firstDayOfWeek, getMonthViewCells, getYearViewCells } from './dateMethods';

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const MONTH_SHORT_NAMES = ["January","February","March","April","May","June","July","August","Septemb","October","Novemb","Decemb"]

function roundedDate(date) {
	const rounded = new Date(date)
	rounded.setHours(0)
	rounded.setMinutes(0)
	return rounded
}

export default class Calendar extends React.Component
{
	static defaultProps = {
		startOfWeek: 	1
	}

	static propTypes = {
		startOfWeek: 	PropTypes.number,
		selectedDate: 	PropTypes.instanceOf(Date),
		minDate: 		PropTypes.instanceOf(Date),
		maxDate: 		PropTypes.instanceOf(Date),
		/** On single date select */
		onChange: 		PropTypes.func,
		/** On date range select */
		onRangeChange: 	PropTypes.func,
	}

	static animations = {
		prev: {
			enter: { left: ["0%", "-100%"] },
			leave: { left: "100%" }
		},
		next: {
			enter: { left: ["0%", "100%"] },
			leave: { left: "-100%" }
		},
		yearMenu: {
			enter: { top: ["0%", "-100%"] },
			leave: { top: "100%" }
		},
		monthMenu: {
			enter: { top: ["0%", "100%"] },
			leave: { top: "-100%" }
		},
		fade: {
			enter: "fadeIn",
			leave: "fadeOut"
		}
	}

	constructor(props)
	/* expects as props:
	@	selectedDate
	@	rangeStart
	@	rangeEnd
	@ 	onRangeChange
	@ 	startOfWeek
	*/
	{
		super(props)

		this.state = {
			//...this.getDateState(props.selectedDate, {}),
			//yearMenu: false,
			animationType: "yearMenu"
		}
	}

	__getDateState(date, prevState = this.state) {
		const { minDate, maxDate, startOfWeek } = this.props

		const nextDate = new Date(date)
		nextDate.setHours(0)
		nextDate.setMinutes(0)

		const monthViewKey = nextDate.getYear() + "_" + nextDate.getMonth()

		if (monthViewKey !== prevState.monthViewKey)
		{
			return {
				openDate: nextDate,
				yearMenu: false,
				monthViewKey,
				monthViewCells: getMonthViewCells(nextDate, minDate, maxDate, startOfWeek)
			}
		}
		else {
			return {
				openDate: nextDate
			}
		}
	}

	static getDerivedStateFromProps(props, state) {
		const { selectedDate, startDate, endDate } = props

		const nextDate = roundedDate(props.selectedDate !== state.selectedDate
			? 	props.selectedDate
			:	state.openDate)

		const monthViewKey = nextDate.getYear() + "_" + nextDate.getMonth()

		if (!state.yearMenu && monthViewKey !== state.monthViewKey)
		{
			const { minDate, maxDate, startOfWeek } = props

			return {
				openDate: nextDate,
				monthViewCells: getMonthViewCells(nextDate, minDate, maxDate, startOfWeek),
				monthViewKey,
				rangeStart: roundedDate(props.startDate),
				rangeEnd: roundedDate(props.endDate),
				selectedDate: props.selectedDate,
				animationType: "fade"
			}
		}

		if (state.yearMenu) {
			const { minDate, maxDate } = props

			return {
				yearViewCells: getYearViewCells(nextDate, minDate, maxDate),
				openDate: nextDate,
				rangeStart: roundedDate(props.startDate),
				rangeEnd: roundedDate(props.endDate),
				selectedDate: props.selectedDate,
			}
		}

		return {
			openDate: nextDate,
			rangeStart: roundedDate(props.startDate),
			rangeEnd: roundedDate(props.endDate),
			selectedDate: props.selectedDate,
		}
	}

	getMonthState(nextDate) {
		const monthViewKey = nextDate.getYear() + "_" + nextDate.getMonth()

		if (monthViewKey !== this.state.monthViewKey)
		{
			const { minDate, maxDate, startOfWeek } = this.props

			return {
				openDate: nextDate,
				yearMenu: false,
				monthViewKey,
				monthViewCells: getMonthViewCells(nextDate, minDate, maxDate, startOfWeek)
			}
		}
		else {
			return {
				openDate: nextDate
			}
		}

		//return {
		//	openDate: 		nextDate,
		//	yearMenu: 		false,
		//	monthViewKey: 	monthViewKey,
		//	monthViewCells:	monthViewKey !== prevState.monthViewKey
		//		? 	getMonthViewCells(nextDate, minDate, maxDate, startOfWeek)
		//		: 	this.state.monthViewCells
		//}
	}

	render() {

		const { selectedDate } = this.props
		const { openDate, 
				rangeStart, 
				rangeEnd, 
				paintStart, 
				paintEnd, 
				animating, 
				monthViewKey, 
				monthViewCells, 
				yearViewCells, 
				yearMenu, 
				animationType } = this.state

		return (
			<div className="calendar-container">
				<VelocityTransitionGroup
					component="div"
					enter={{
						animation: Calendar.animations[animationType].enter,
						duration: 400
					}}
					leave={{
						animation: 	Calendar.animations[animationType].leave,
						duration: 	400,
						begin: 		this.startAnimating,
						complete: 	this.endAnimating
					}}
					runOnMount={true}
					>
					{yearMenu
					?	<YearView
							key={openDate.getYear()}
							openDate={openDate}
							onMonthSelect={this.onMonthSelect}
							onPrev={this.onPrevYear}
							onNext={this.onNextYear}
							cells={yearViewCells}
							/>
					: 	<MonthView
							key={monthViewKey}
							openDate={openDate}
							onYearMenu={this.onYearMenu}
							onPrev={this.onPrevMonth}
							onNext={this.onNextMonth}
							selectedDate={selectedDate}
							cells={monthViewCells}
							onCellMouseDown={this.onCellMouseDown}
							onCellMouseEnter={paintStart ? this.onCellMouseEnter : undefined}
							onCellMouseUp={this.onCellMouseUp}
							paintClassName={paintStart ? this.paintClassName : undefined}
							rangeClassName={paintStart ? undefined : this.rangeClassName}
							/>
					}
				</VelocityTransitionGroup>
				{animating ? <div className="calendar-mask"/> : null}
			</div>
		)
	}

	startAnimating = () => {
		this.setState({
			animating: true
		})
	}

	endAnimating = () => {
		this.setState({
			animating: false
		})
	}

	rangeClassName = (dateData) => {
		const { rangeStart, rangeEnd } = this.state
		const date = new Date(dateData.ds)

		if (date >= rangeStart && date <= rangeEnd)
		{
			return "range"
		}

		return ""
	}

	paintClassName = (dateData) => {
		const { paintStart, paintEnd } = this.state
		const date = new Date(dateData.ds)

		if (date >= Math.min(paintStart, paintEnd) && date <= Math.max(paintStart, paintEnd))
		{
			return "paint"
		}

		return ""
	}

	onCellMouseDown = (e) => {
		const date = new Date(e.currentTarget.dataset.datestr)

		this.setState({
			paintStart: date,
			paintEnd: 	date
		})
	}

	onCellMouseEnter = (e) => {
		this.setState({
			paintEnd: new Date(e.currentTarget.dataset.datestr)
		})
	}

	onCellMouseUp = (e) => {
		const { paintStart, paintEnd } = this.state

		if (!paintStart || !paintEnd) return

		if (this.props.onChange && paintStart.getTime() === paintEnd.getTime())
		{
			if (this.detectDoubleClick())
				this.props.onRangeChange(paintStart, paintStart)
			else
				this.props.onChange(paintStart)
		}
		else if (this.props.onRangeChange)
		{
			if (paintStart < paintEnd)
				this.props.onRangeChange(paintStart, paintEnd)
			else
				this.props.onRangeChange(paintEnd, paintStart)
		}

		this.setState({
			paintStart: null,
			paintEnd: null,
		})
	}

	detectDoubleClick() {
		const t = new Date().getTime()
		const dblclicked = (t - this.lastMouseUp < 300)

		this.lastMouseUp = t

		return dblclicked
	}

	onPrevYear = () => {
		const nextDate = new Date(this.state.openDate)
		nextDate.setYear(nextDate.getFullYear() - 1)

		this.setState({
			openDate: nextDate,
			animationType: "prev"
		})
	}

	onNextYear = () => {
		const nextDate = new Date(this.state.openDate)
		nextDate.setYear(nextDate.getFullYear() + 1)

		this.setState({
			openDate: nextDate,
			animationType: "next"
		})
	}

	onPrevMonth = () => {
		const nextDate = new Date(this.state.openDate)
		nextDate.setMonth(nextDate.getMonth() - 1)

		this.setState({
			...this.getMonthState(nextDate),
			animationType: "prev"
		})
	}

	onNextMonth = () => {
		const nextDate = new Date(this.state.openDate)
		nextDate.setMonth(nextDate.getMonth() + 1)

		this.setState({
			...this.getMonthState(nextDate),
			animationType: "next"
		})
	}

	onYearMenu = () => {
		this.setState({
			yearMenu: true,
			animationType: "yearMenu"
		})
	}

	onMonthSelect = (month) => {
		const nextDate = new Date(this.state.openDate)
		nextDate.setMonth(month)

		this.setState({
			...this.getMonthState(nextDate),
			animationType: "monthMenu"
		})
	}

	onDateSelect = (date) => {
		const selDate = new Date(this.state.openDate)
		selDate.setDate(date)

		this.props.onSelect(selDate)
	}
}

function YearView(props) {
	const { openDate, cells, onPrev, onNext, onYearMenu, onMonthSelect } = props

	return (
		<table className="calendar-view calendar-year-view">
		<tbody>
			<tr className="head-row">
				<td onClick={onPrev} className="prev sel">
					&lt;&lt;
				</td>
				<td className="year">
					{openDate.getFullYear()}
				</td>
				<td onClick={onNext} className="next sel">
					&gt;&gt;
				</td>
			</tr>
			{cells.map((monthRow, mr) =>
				<tr key={mr}>
				{monthRow.map((month, m) =>
					<td key={m} 
						className={"month " + (month.disabled ? "disabled" : "sel")}
						onClick={month.disabled ? undefined : () => onMonthSelect(month.m)}>
						{month.disabled
							? 	<React.Fragment>
									{/*<div className="disabled-line top-left"/>*/}
									<div className="disabled-line top-right"/>
								</React.Fragment>
							: 	undefined
						}
						{MONTH_SHORT_NAMES[month.m]}
					</td>
				)}
				</tr>
			)}
		</tbody>
		</table>
	)
}

function splitArray(a, len) {
	const ret = []
	for (let i = 0; i < a.length; i += len)
		ret.push(a.slice(i, i+len))
	return ret
}

function MonthView(props) {
	const { openDate, onPrev, onNext, onYearMenu, onCellMouseDown, onCellMouseEnter, onCellMouseUp, selectedDate, cells, rangeClassName, paintClassName } = props
	const selectedDateId = openDate.toDateString()

	return (
		<table className={"calendar-view calendar-month-view"}>
		<tbody>
			<tr className="head-row month-row">
				<td onClick={onPrev} className="prev sel">
					&lt;&lt;
				</td>
				<td colSpan={5} onClick={onYearMenu} className="sel">
					{MONTH_NAMES[openDate.getMonth()]}
					&nbsp;
					{openDate.getFullYear()}
				</td>
				<td onClick={onNext} className="next sel">
					&gt;&gt;
				</td>
			</tr>
			<tr className="head-row weekday-row">
				<th>Mon</th>
				<th>Tue</th>
				<th>Wed</th>
				<th>Thu</th>
				<th>Fri</th>
				<th>Sat</th>
				<th>Sun</th>
			</tr>
			{cells.map((week, w) =>
				<tr key={w}>
					{week.map((day, d) => 
						<td key={d} 
							data-datestr={day.ds}
							className={
								"day"
								+ (day.relMonth === 0 && !day.disabled ? " sel" : "")
								+ (day.relMonth !== 0 ? " not-this-month" : "")
								+ (day.disabled ? " disabled"
									: 	(rangeClassName ? " " + rangeClassName(day) : "")
									+ 	(paintClassName ? " " + paintClassName(day) : ""))
							}
							onMouseDown={
									day.disabled ? undefined :
									day.relMonth < 0
								? 	onPrev
								: 	day.relMonth > 0 
								? 	onNext
								: 	onCellMouseDown
							}
							onMouseUp={day.disabled ? undefined : onCellMouseUp}
							onMouseEnter={day.disabled ? undefined : onCellMouseEnter}
							>
							{day.disabled
								? 	<React.Fragment>
										{/*<div className="disabled-line top-left"/>*/}
										<div className="disabled-line top-right"/>
									</React.Fragment>
								: 	undefined
							}
							{day.d}
						</td>
					)}
				</tr>
			)}
		</tbody>
		</table>
	)
}