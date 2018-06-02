import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'

class OrderNav extends Component {
    render(){
        let pathCheck = this.props.routerProps.match.path === '/inventory/remaining'
        let type = pathCheck ? 'Remaining' : 'All'
        let link = pathCheck ? '' : '/all'
        return (
            <ul>
                <li><Link to="/inventory/create">Create New Item</Link></li>
                <li><Link to={ "/inventory" + link }>View { type } Items</Link></li>
            </ul>
        );
    }
}

OrderNav.propTypes = {
    routerProps: PropTypes.object
}

export default OrderNav
