import React from "react";

const getTextFromChildren = children => {
    let label = "";

    React.Children.map(children, child => {
        if (typeof child === "string") {
            label += child;
        }
    });

    return label;
};

export default getTextFromChildren;