import React from "react"
import ReactDOM from "react-dom"
import "./scss/style.css"
import App from "./App"
import { unregister } from "./registerServiceWorker"

ReactDOM.render(<App />, document.getElementById("root"))
unregister()
