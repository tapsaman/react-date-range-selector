import React from 'react';
import PropTypes from 'prop-types';

function perc(min, max, value) {
	return ((value - min) * 100) / (max - min)
}

export default class Slider extends React.Component {
	
	constructor(props)
	/* expects as props:
	@	min			| number
	@	max			| number
	@	start 		| number
	@ 	end 		| number
	@	controlled 	| bool
	@	marks 		| object array
	*/
	{
		super(props)

		this.state = { 
			start: 		props.start,
			end: 		props.end,
			startPerc: 	perc(props.min, props.max, props.start),
			endPerc: 	perc(props.min, props.max, props.end)
		}
	}

	render()
	{
		const { start, end, startPerc, endPerc } = this.state 

		return (
			<div className="drs-slider-container">
				<div className="drs-slider" ref={el => this.slider = el}>
					<Track startPerc={startPerc} endPerc={endPerc} onClick={this.startMoveBoth}/>
					<Handle value={start} perc={startPerc} onClick={this.startMoveStart} />
					<Handle value={end} perc={endPerc}  onClick={this.startMoveEnd} bottom={true} />
				</div>
			</div>
		)
	}

	onMouseDown(e) {
		if (e.button !== 0) { return; }
		const position = getMousePosition(this.props.vertical, e);
		this.onStart(position);
		this.addDocumentEvents('mouse');
		
		e.stopPropagation();
  		e.preventDefault();
	}

	addDocumentEvents(type) {
		if (type === 'touch') {
			// just work for chrome iOS Safari and Android Browser
			this.onTouchMoveListener = addEventListener(document, 'touchmove', this.onTouchMove.bind(this));
			this.onTouchUpListener = addEventListener(document, 'touchend', this.end.bind(this, 'touch'));
		} 
		else if (type === 'mouse') {
			this.onMouseMoveListener = document.addEventListener('mousemove', this.onMouseMove);
			//this.onMouseUpListener = document.addEventListener('mouseup', this.end);
		}
	}

	removeEvents(type) {
		if (type === 'touch') {
			this.onTouchMoveListener.remove();
			this.onTouchUpListener.remove();
		} 
		else if (type === 'mouse') {
			this.onMouseMoveListener.remove();
			this.onMouseUpListener.remove();
		}
	}

	startMoveStart = () => {
		this.addDocumentEvents("mouse")
		this.setState({
			moving: "start"
		})
	}

	onMouseMove = (e) => {
		if (!this.state.moving || !this.slider)
			return

		//const coords = relativeCoords(e, this.slider)

		const bounds = this.slider.getBoundingClientRect()

		this.setState({
			startPerc: Math.max(0, perc(bounds.left, bounds.right, e.clientX))
		})
	}
}

function relativeCoords ( event, container ) {
	const bounds = container.getBoundingClientRect();
	const x = event.clientX - bounds.left;
	const y = event.clientY - bounds.top;
	return { left: x, top: y };
}

function Track(props) {
	const { startPerc, endPerc, onClick } = props

	return (
		<div className="drs-slider-track" 
			style={{
				left: startPerc + "%",
				width: (endPerc - startPerc) + "%"
			}}
			onClick={onClick}
			/>
	)
}

function Handle(props) {
	const { perc, value, bottom, onClick, moving } = props

	return (
		<div className={"drs-slider-handle" + (bottom ? " bottom":" top") + (moving ? " moving":"")}
			style={{
				left: perc + "%"
			}}
			onClick={onClick}
			>
			<div className="drs-slider-handle-tooltip">
				{value}
			</div>
		</div>
	)
}

Slider.propTypes = {
	min: 			PropTypes.number.isRequired,
	max: 			PropTypes.number.isRequired,
	start: 			PropTypes.number.isRequired,
	end: 			PropTypes.number.isRequired,
	marks: 			PropTypes.arrayOf(PropTypes.object),
}