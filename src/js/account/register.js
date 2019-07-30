import React from 'react';
import Form from '../form';
import { Segment, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

import { ErrorHandler } from "../shared"

import { requester } from "../utilities/apiUtils";
import { ROOT } from "../config";

const fields = [
	{ name: "username", label: "Username", type: "text", className: "flex-child__100 pad10", allowLP: true, required: true },
    { name: "password", label: "Password", type: "password", className: "flex-child__100 pad10", allowLP: true, required: true },
    { name: "password_confirm", label: "Confirm", type: "password", className: "flex-child__100 pad10", allowLP: true, required: true },
    { name: "email", label: "Email", type: "email", className: "short flex-child__100 pad10", allowLP: true, required: true }
]

class Register extends React.Component {
    state = {
        errors: []
    }
    handleError = e => console.log( e )
    handleSubmit = async (e, url, id, method, saveDetails) => {
        e.preventDefault()
        const { updateAuth } = this.props;
        if (saveDetails['password'] !== saveDetails['password_confirm']) {
            return this.setState({ errors: ["Passwords do not match"] })
        } else {
            delete saveDetails['password_confirm']
        }

        const response = await requester({ url: ROOT + url, body: saveDetails });
        if( response instanceof Error ){
            this.setState({ errors: [response.response ? response.response.message : response.message || response.error.message] })
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
                <Header content="Register" />
                { errors.length > 0 && <ErrorHandler errors={errors} /> }
                <Form
                    fields={fields}
                    details={{username: "", password: "", password_confirm: "", email: "" }}
                    url="register"
                    handleError={this.handleError}
                    handleSubmit={this.handleSubmit}
                />
                <Segment secondary>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </Segment>
            </Segment>
        )
    }
}

export default Register;