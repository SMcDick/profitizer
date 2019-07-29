import React from "react"
import ReactDOM from "react-dom"
import App from "./js/App"
import { unregister } from "./registerServiceWorker"

import 'semantic-ui-css/semantic.min.css'
import "./scss/style.css"

ReactDOM.render(<App />, document.getElementById("root"))
unregister()
