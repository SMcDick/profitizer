import React from 'react';
import Cookies from "universal-cookie"
import { Redirect } from "react-router-dom"

class Logout extends React.PureComponent {
    removeAuth = async () => {
        const cookies = new Cookies();
        await cookies.remove('auth')
        const { updateAuth } = this.props;
        updateAuth();
    }
    render(){
        this.removeAuth()
        return <Redirect to="/" />
    }
}

export default Logout