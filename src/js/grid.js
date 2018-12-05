import React, { Component } from "react"
import { Link } from "react-router-dom"
import PropType from "prop-types"
import Moment from "moment"
import { ScrollSync, Table, Column } from "react-virtualized"

import util from "./utils"

const { func, number, object, node, string, array, bool, oneOfType } = PropType

class Grid extends Component {
	// TODO add loader and allow grid to be more dynamic
	// TODO consider removing react-virtualized or at least sticky columns
	constructor() {
		super()
		this._handleWindowResize = util.debounce(this._handleWindowResize.bind(this), 250)
		this.state = {
			width: window.outerWidth,
			scrollable: null,
			rowHeight: 28,
			availableHeight: 600,
			tableWidth: {
				sticky: window.outerWidth * 0.4,
				base: window.outerWidth * 0.6,
				natural: window.outerWidth * 0.6
			}
		}
		this._isMounted = false
		this.gridRef = React.createRef()
	}
	componentDidMount() {
		this._isMounted = true
		window.addEventListener("resize", this._handleWindowResize)
		this._handleWindowResize()
	}
	componentWillUnmount() {
		this._isMounted = false
		window.removeEventListener("resize", this._handleWindowResize)
	}

	getTableWidth = ({ width, isSticky }) => {
		let { fields, defaultColWidth } = this.props
		return fields.reduce((total, col) => {
			let colWidth = col.width ? col.width : defaultColWidth
			if (isSticky ? col.sticky : !col.sticky) {
				return total + util.checkForPct(colWidth, width)
			}
			return total
		}, 0)
	}

	_handleWindowResize() {
		// TODO figure out how to unmount and remount similar component with new data
		// EX: going from Expenses to Restaurants
		const el = this.gridRef.current
		const { fullHeight, data } = this.props
		if (this._isMounted && el != null) {
			let pageHeight = window.outerHeight
			let offset = el.getBoundingClientRect().top
			let availableHeight = pageHeight - offset

			let rows = el.getElementsByClassName("item__row")
			let rowHeight = rows.size > 1 ? rows[1].clientHeight : 30
			let minHeight = rowHeight * 20
			if (availableHeight < minHeight) availableHeight = minHeight
			if (fullHeight) availableHeight = data.length * rowHeight + rowHeight

			let width = el.offsetWidth
			let tableWidth = {
				sticky: this.getTableWidth({ width, isSticky: true }),
				base: this.getTableWidth({ width })
			}
			tableWidth.available = width - tableWidth.sticky
			if (tableWidth.base < tableWidth.available) tableWidth.base = tableWidth.available
			let totalTableWidth = tableWidth.sticky + tableWidth.base

			let scrollable = null
			if (width < totalTableWidth) {
				scrollable = "scrollable"
			}

			this.setState({ availableHeight, rowHeight, scrollable, width, tableWidth })
		}
	}
	getScrollable = () => {
		const { scrollable } = this.state
		return scrollable ? ` ${scrollable}` : ""
	}

	render() {
		const { fields, mods, className } = this.props
		if (fields) {
			return (
				<div className={"grid__outer" + util.getClasses(className)}>
					<div className={util.getMods(mods, "item__grid") + this.getScrollable()} ref={this.gridRef}>
						<GridBody {...this.props} {...this.state} />
					</div>
				</div>
			)
		}
		return (
			<div
				className={util.getMods(mods, "item__grid") + util.getClasses(className) + this.getScrollable()}
				ref={this.gridRef}>
				{this.props.children}
			</div>
		)
	}
}
Grid.propTypes = {
	children: node,
	className: string,
	mods: string,
	layout: object,
	data: array,
	fields: array,
	link: object,
	fullHeight: bool,
	defaultColWidth: number
}
Grid.defaultProps = {
	defaultColWidth: 80
}

class GridBody extends Component {
	constructor(props) {
		super(props)
		this.gridConStart = Moment()
	}
	componentDidMount() {}
	componentWillUnmount() {}
	renderGridItem({ field, cellData, url, rowData }) {
		let val = cellData
		return (
			<GridItem
				key={field.name}
				className={field.className}
				mods={field.mods}
				format={field.format}
				url={url}
				id={rowData.Id}
				clickHandler={this.props.clickHandler}>
				{val}
			</GridItem>
		)
	}
	groupColumns = isSticky => {
		const { fields } = this.props
		let columns = fields.filter(field => {
			return isSticky ? field.sticky : !field.sticky
		})
		return this.getColumns({ columns })
	}
	getColumns = ({ columns }) => {
		const { link, tableWidth, width, defaultColWidth } = this.props
		return columns.map(field => {
			let colWidth = field.width ? util.checkForPct(field.width, width) : defaultColWidth
			return (
				<Column
					key={field.name}
					label={field[field.heading !== undefined ? "heading" : "name"]}
					dataKey={field.name}
					width={colWidth}
					flexGrow={tableWidth.base === tableWidth.available && !field.sticky ? 1 : 0}
					cellRenderer={({ cellData, rowData }) => {
						let url = link ? "/" + link.name + "/" + rowData[link.id] : null
						return this.renderGridItem({ field, cellData, rowData, url })
					}}
					headerRenderer={({ dataKey, label }) => {
						return (
							<GridItem key={dataKey} text={label} mods={field.mods} className={field.className}>
								{label}
							</GridItem>
						)
					}}
				/>
			)
		})
	}
	renderTable = ({ scrollTop, onScroll, isSticky }) => {
		const { availableHeight, rowHeight, data, tableWidth } = this.props
		return (
			<Table
				scrollTop={scrollTop}
				onScroll={onScroll}
				width={isSticky ? tableWidth.sticky : tableWidth.base}
				height={availableHeight}
				headerHeight={rowHeight}
				rowHeight={rowHeight}
				rowCount={data.length}
				rowGetter={({ index }) => data[index]}
				rowClassName={({ index }) => (index % 2 === 0 ? "item__row item__row--stripe" : "item__row")}
				headerStyle={{ fontWeight: "bold", borderBottom: "2px solid #808080" }}>
				{this.groupColumns(isSticky)}
			</Table>
		)
	}
	render() {
		const { tableWidth } = this.props
		return (
			<ScrollSync>
				{({ onScroll, scrollTop }) => (
					<div className="Table" style={{ display: "flex" }}>
						<div className="LeftColumn">
							{this.renderTable({
								scrollTop,
								onScroll,
								isSticky: true
							})}
						</div>
						<div className="RightColumn" style={{ paddingLeft: tableWidth.sticky }}>
							{this.renderTable({
								scrollTop,
								onScroll,
								isSticky: false
							})}
						</div>
					</div>
				)}
			</ScrollSync>
		)
	}
}

GridBody.propTypes = {
	fields: array,
	data: array,
	link: oneOfType([string, object]),
	availableHeight: number,
	rowHeight: number,
	width: number,
	tableWidth: object,
	style: object,
	clickHandler: func,
	defaultColWidth: number
}

class GridItem extends Component {
	onClick = () => {
		const { clickHandler, id } = this.props
		if (clickHandler) {
			return clickHandler(id)
		}
		return null
	}
	renderItem = () => {
		const { mods, format, className } = this.props
		let text = this.props.children
		switch (format) {
			case "money":
				text = <Money>{text}</Money>
				break
			case "positiveMoney":
				text = <StyledMoney positive>{text}</StyledMoney>
				break
			case "negativeMoney":
				text = <StyledMoney>{text}</StyledMoney>
				break
			case "date":
				text = <DateFormatter>{text}</DateFormatter>
				break
			case "truncate":
				text = <Truncate>{text}</Truncate>
				break
			case "title":
				text = (
					<span title={text} className="item__detail--title">
						{text}
					</span>
				)
				break
			case "check":
				text = <Icon type={Number(text)} />
				break
			case "links":
				text = <Links data={text} />
				break
			default:
				break
		}
		return (
			<span className={util.getMods(mods, "item__detail") + util.getClasses(className)} onClick={this.onClick}>
				{text}
			</span>
		)
	}
	render() {
		const { url } = this.props
		return url ? <Link to={url}>{this.renderItem()}</Link> : this.renderItem()
	}
}

GridItem.propTypes = {
	text: oneOfType([number, string]),
	format: string,
	mods: string,
	style: object,
	url: string,
	children: oneOfType([string, number, array]),
	clickHandler: func,
	id: number,
	className: string
}

class Links extends Component {
	render() {
		const { data } = this.props
		return data.map((item, idx) => (
			<span key={item.id}>
				{idx > 0 && ", "}
				<Link to={item.url}>{item.id}</Link>
			</span>
		))
	}
}
Links.propTypes = {
	data: array
}
class StyledMoney extends Component {
	render() {
		const { children, positive } = this.props
		let className = {}
		let compare = positive ? Number(children) > 0 : Number(children) < 0
		if (Number(children) !== 0 && !Number.isNaN(children)) {
			className = { className: compare ? "positive-text" : "negative-text" }
		}
		return <span {...className}>{util.formatMoney(children)}</span>
	}
}
StyledMoney.propTypes = {
	children: oneOfType([string, number]),
	positive: bool
}
class Money extends Component {
	render() {
		const { children } = this.props
		return util.formatMoney(children)
	}
}
Money.propTypes = {
	children: oneOfType([string, number])
}

class DateFormatter extends Component {
	render() {
		return Moment(this.props.children).format("M/D/YYYY")
	}
}
DateFormatter.propTypes = {
	children: oneOfType([string, number])
}
class Truncate extends Component {
	render() {
		return this.props.children.substr(0, 6)
	}
}
Truncate.propTypes = {
	children: oneOfType([string, number])
}
class Icon extends Component {
	render() {
		return <span className={this.props.type ? "icon--check" : "icon--bang"} />
	}
}
Icon.propTypes = {
	type: number
}

export { Grid, GridItem }
