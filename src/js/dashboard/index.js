import React, { Component } from "react"

import TopLeft from "./topLeft"
import TopRight from "./topRight"
import BottomLeft from "./bottomLeft"

class Dashboard extends Component {
	render() {
		return (
			<section>
				<h1>Sales Report</h1>
				<div className="flex-parent pad10">
					<div className="pad10 flex-child__50">
						<TopLeft />
					</div>
					<div className="pad10 flex-child__50">
						<TopRight />
					</div>
				</div>
				<div className="flex-parent pad10">
					<div className="pad10 flex-child__50">
						<BottomLeft />
					</div>
					<div className="pad10 flex-child__50">
						<TopRight />
					</div>
				</div>
				{/*

					<div className="flex-parent pad10">
						<div className="pad10 flex-child__50">
							<Bar data={chartData} options={{}} />
						</div>
						<div className="pad10 flex-child__50">
							<Pie data={chartData} options={{}} />
						</div>
					</div>

					*/}
			</section>
		)
	}
}

export default Dashboard
