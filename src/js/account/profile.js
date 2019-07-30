import React from "react";
import { Segment, Header, Dimmer, Loader } from "semantic-ui-react";
import Cookies from "universal-cookie";
import jwt from "jsonwebtoken"

import { API_ROOT } from "../config";
import { requester } from "../utilities/apiUtils";
import { ErrorHandler, Form } from "../shared";

const fields = [
    { name: "username", label: "Username", type: "text", required: true, autoComplete: "username" },
    { name: "email", label: "Email", type: "email", required: true }
]

class Profile extends React.Component {
    constructor(props){
        super(props)
        const cookies = new Cookies();
        const { id } = jwt.decode(cookies.get('auth'))
        this.state = {
            userDetails: fields.reduce((obj, field) => ({ ...obj, [field.name]: "" }), {}),
            errors: [],
            updated: false,
            id,
            loaded: false
        }
    }
    componentDidMount(){
        const { id } = this.state;
        const url = API_ROOT + 'users/' + id
        requester({ url, method: 'GET' })
            .then( user => {
                this.setState({ userDetails: user.data, loaded: true })
            })
    }
    handleError = e => console.log( 'hey' )
    handleSubmit = async (e, url, id, method, saveDetails) => {
        e.preventDefault()
        const response = await requester({ url: API_ROOT + url, body: saveDetails });
        if (response instanceof Error) {
            this.setState({ errors: [response.response ? response.response.message : response.message || response.error.message], updated: false })
        } else {
            this.setState({ errors: [], updated: true })
        }
    }
    render(){
        const { userDetails, errors, updated, id, loaded } = this.state;
        return (
            <Segment>
                <Dimmer active={!loaded} inverted>
                    <Loader size="large" />
                </Dimmer>
                <Header as="h1" content="Profile" />
                {errors.length > 0 && <ErrorHandler errors={errors} />}
                {updated && <ErrorHandler errors={["Profile Updated"]} positive negative={false} />}
                <Form 
                    fields={fields}
                    details={userDetails}
                    url={"users/" + id}
                    handleError={this.handleError}
                    handleSubmit={this.handleSubmit}
                /> 
            </Segment>
        )
    }
}

export default Profile