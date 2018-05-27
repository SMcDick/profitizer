import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Pager extends Component {
    constructor( props ){
        super( props )
    }

    render(){
        let page = this.props.meta.page
        let pages = this.props.meta.pages
        let next = page < pages ? page + 1 : null
        let prev = page > 1 ? page - 1 : null
        return(
            <div>
                <p>Page: { this.props.meta.page }</p>
                { prev &&
                    <Link to={{
                        pathname: this.props.routerProps.location.pathname,
                        search: `?page=${ prev }`
                    }}>Prev Page</Link>
                }
                { next &&
                    <Link to={{
                        pathname: this.props.routerProps.location.pathname,
                        search: `?page=${ next }`
                    }}>Next Page</Link>
                }
                <p>Pages: { this.props.meta.pages }</p>
                <p>Per page: { this.props.meta.limit }</p>
                <p>Total Records: { this.props.meta.records }</p>
            </div>
        )
    }
}

Pager.propTypes = {
    meta: PropTypes.object,
    handleMeta: PropTypes.func,
    routerProps: PropTypes.object
}

export default Pager
