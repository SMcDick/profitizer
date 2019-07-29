import React from "react";
import PropTypes from "prop-types";
import { Message } from "semantic-ui-react";

const ErrorHandler = ({ errors, ...rest }) => {
    if (!errors.length) return null;
    return (
        <Message negative {...rest}>
            {errors.map(error => (
                <div key="error">{error}</div>
            ))}
        </Message>
    );
};

const { array } = PropTypes;
ErrorHandler.propTypes = {
    errors: array
};
ErrorHandler.defaultProps = {
    errors: []
};

export default ErrorHandler;