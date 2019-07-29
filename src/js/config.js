let backendHost
// const apiVersion = "v1"

const hostname = window && window.location && window.location.hostname

if (hostname === "profiteer.nfshost.com") {
	backendHost = "https://profiteer.nfshost.com"
} else if (hostname === "staging.realsite.com") {
	backendHost = "https://staging.api.realsite.com"
} else if (/^qa/.test(hostname)) {
	backendHost = `https://api.${hostname}`
} else {
	backendHost = process.env.REACT_APP_BACKEND_HOST || "http://localhost:7555"
}

export const API_ROOT = `${backendHost}/v2/`
export const ROOT = `${backendHost}/`
