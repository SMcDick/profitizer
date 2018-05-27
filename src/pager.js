import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Pager extends Component {
    constructor( props ){
        super( props )
    }

    render(){
        console.log( this.props.meta )
        return(
            <div>
                <p onClick={ ( e ) =>  this.props.handleMeta( 'hey' ) }>Page: { this.props.meta.page }</p>
                <p>Pages: { this.props.meta.pages }</p>
                <p>Per page: { this.props.meta.limit }</p>
                <p>Total Records: { this.props.meta.records }</p>
            </div>
        )
    }
}

Pager.propTypes = {
    meta: PropTypes.object,
    handleMeta: PropTypes.func
}

export default Pager
