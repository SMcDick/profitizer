import React from 'react';
import Form from './form';
import { Segment, Header } from "semantic-ui-react";
import Cookies from "universal-cookie";

import { ErrorHandler } from "./shared"

import { requester } from "./utilities/apiUtils";
import { ROOT } from "./config";

const fields = [
	{ name: "username", type: "text", className: "short pad10", allowLP: true, required: true },
	{ name: "password", type: "password", className: "short pad10", allowLP: true, required: true }
]

class Login extends React.Component {
    state = {
        errors: []
    }
    handleError = e => console.log( e )
    handleSubmit = async (e, url, id, method, saveDetails) => {
        e.preventDefault()
        const { updateAuth } = this.props;
        const response = await requester({ url: ROOT + url, body: saveDetails });
        if( response.error ){
            this.setState({ errors: [response.error.message] })
        } else if ( !response.auth ){
            this.setState({ errors: [response.data.message] })
        } else {
            const cookies = new Cookies()
            cookies.set('auth', response.user.token, { path: "/" })
            updateAuth();
        }
    }
    render(){
        const { errors } = this.state;
        return (
            <Segment>
                <Header content="Login" />
                { errors.length > 0 && <ErrorHandler errors={errors} /> }
                <Form
                    fields={fields}
                    details={{username: "", password: ""}}
                    url="login"
                    handleError={this.handleError}
                    handleSubmit={this.handleSubmit}
                />
            </Segment>
        )
    }
}

export default Login;