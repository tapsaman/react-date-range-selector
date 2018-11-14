import React from "react"
import PropTypes from "prop-types"

function perc(min, max, value) {
	return ((value - min) * 100) / (max - min)
}

function percValue(min, max, percent) {
	return (max-min) / 100 * percent + min
}

export default class Slider extends React.Component {
	
	static propTypes = {
		min: 			PropTypes.number.isRequired,
		max: 			PropTypes.number.isRequired,
		start: 			PropTypes.number.isRequired,
		end: 			PropTypes.number.isRequired,
		step:			PropTypes.number,
		onChange:		PropTypes.func,
		controlled:		PropTypes.bool,
		container:		PropTypes.oneOfType([PropTypes.instanceOf(HTMLDocument), PropTypes.instanceOf(Element)]),
		// Stylistic
		formatValue:	PropTypes.func,
		startOnTop:		PropTypes.bool,
		marks: 			PropTypes.arrayOf(PropTypes.object)
	}

	static defaultProps = {
		step:			1,
		startOnTop:		true,
		container:		document
	}

	static propsToState(props)
	{
		return {
			start: 		props.start,
			end: 		props.end,
			startPerc: 	perc(props.min, props.max, props.start),
			endPerc: 	perc(props.min, props.max, props.end)
		}
	}

	constructor(props)
	{
		super(props)
		this.state = Slider.propsToState(props)
	}


	componentDidUpdate(prevProps) {
		if (prevProps.start !== this.props.start || prevProps.end !== this.props.end)
		{
			this.setState(Slider.propsToState(this.props))
		}
	}

	componentWillUnmount() {
		this.removeEvents("mouse")
	}

	render()
	{
		const { startOnTop, formatValue } = this.props
		const { start, end, startPerc, endPerc } = this.state

		return (
			<div className="drs-slider-container">
				<div className="drs-slider" ref={el => this.slider = el}>
					<div className="drs-slider-rail" onClick={this.onRailClick}></div>
					<span className={"drs-slider-triangle start-triangle" + (startOnTop ? " top" : " bottom")} />
					<span className={"drs-slider-triangle end-triangle" + (!startOnTop ? " top" : " bottom")} />
					<Track startPerc={startPerc} endPerc={endPerc} onMouseDown={this.startMoveBoth} />
					<Handle value={start} perc={startPerc} onMouseDown={this.startMoveStart} top={startOnTop} formatValue={formatValue} />
					<Handle value={end} perc={endPerc} onMouseDown={this.startMoveEnd} top={!startOnTop} formatValue={formatValue} />
				</div>
			</div>
		)
	}

	//onMouseDown(e) {
	//	if (e.button !== 0) { return }
	//	const position = getMousePosition(this.props.vertical, e)
	//	this.onStart(position)
	//	this.addDocumentEvents("mouse")
	//	
	//	e.stopPropagation()
	//	e.preventDefault()
	//}

	addDocumentEvents(type) {
		if (type === "touch") {
			// just work for chrome iOS Safari and Android Browser
			this.onTouchMoveListener = addEventListener(document, "touchmove", this.onTouchMove.bind(this))
			this.onTouchUpListener = addEventListener(document, "touchend", this.end.bind(this, "touch"))
		} 
		else if (type === "mouse") {
			this.props.container.addEventListener("mousemove", this.onMouseMove)
			this.props.container.addEventListener("mouseup", this.endMove)
			this.props.container.addEventListener("mouseleave", this.endMove)
		}
	}

	removeEvents(type) {
		if (type === "touch") {
			this.onTouchMoveListener.remove()
			this.onTouchUpListener.remove()
		} 
		else if (type === "mouse") {
			this.props.container.removeEventListener("mousemove", this.onMouseMove)
			this.props.container.removeEventListener("mouseup", this.endMove)
			this.props.container.removeEventListener("mouseleave", this.endMove)
		}
	}

	startMoveBoth = (e) => {
		const bounds = this.slider.getBoundingClientRect()

		this.addDocumentEvents("mouse")
		this.setState({
			moving: "both",
			moveOffset: e.clientX - bounds.left
		})
	}

	startMoveStart = () => {
		this.addDocumentEvents("mouse")
		this.setState({
			moving: "start"
		})
	}

	startMoveEnd = () => {
		this.addDocumentEvents("mouse")
		this.setState({
			moving: "end"
		})
	}

	endMove = () => {
		this.removeEvents("mouse")

		if (this.props.onChange)
			this.props.onChange(this.state.start, this.state.end)

		if (!this.props.controlled)
			this.setState({
				moving: null
			})
		else
			this.setState({
				moving: null,
				...Slider.propsToState(this.props)
			})
	}

	onMouseMove = (e) => {
		const { min, max, step } = this.props
		const { moving, start, end } = this.state

		if (!moving || !this.slider)
			return

		const bounds = this.slider.getBoundingClientRect()
		const xPerc = perc(bounds.left, bounds.right, e.clientX)
		const xValue = round((max-min) / 100 * xPerc + min, step, min)

		if (moving === "start") {
			this.setStart(Math.min(end, Math.max(min, xValue)))
		}
		else if (moving === "end") {
			this.setEnd(Math.min(max, Math.max(start, xValue)))
		}
		else if (moving === "both") {

		}

	}

	onRailClick = (e) => {
		const { min, max, step } = this.props
		const { start, end } = this.state

		const bounds = this.slider.getBoundingClientRect()
		const xPerc = perc(bounds.left, bounds.right, e.clientX)
		const xValue = round(percValue(min, max, xPerc), step, min)

		if (xValue < start)
			this.setStart(xValue)
		else if (xValue > end)
			this.setEnd(xValue)
	}

	setStart(value) {
		this.setState({
			start: value,
			startPerc: perc(this.props.min, this.props.max, value)
		})
	}

	setEnd(value) {
		this.setState({
			end: value,
			endPerc: perc(this.props.min, this.props.max, value)
		})
	}
}

function round(number, increment, offset) {
	return Math.round((number - offset) / increment ) * increment + offset
}

function Track(props) {
	const { startPerc, endPerc, ...otherProps } = props

	return (
		<div className="drs-slider-track" 
			style={{
				left: startPerc + "%",
				width: (endPerc - startPerc) + "%"
			}}
			{...otherProps}
			/>
	)
}

function Handle(props) {
	const { perc, value, top, moving, formatValue, ...otherProps } = props

	return (
		<div className={"drs-slider-handle" + (top ? " top":" bottom") + (moving ? " moving":"")}
			style={{
				left: perc + "%"
			}}
			{...otherProps}
			>
			<div className="drs-slider-handle-tooltip">
				{formatValue ? formatValue(value) : value}
			</div>
		</div>
	)
}