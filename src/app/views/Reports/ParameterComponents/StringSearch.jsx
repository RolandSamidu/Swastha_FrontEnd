import React, { Component } from 'react';
import { TextValidator } from 'react-material-ui-form-validator';

class StringSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInput: null

        };
    }

    render() {
        const { onChange, placeholder, name, validators, errorMessages } = this.props;
        console.log(validators, errorMessages)
        return (
            <TextValidator
                className=" w-full"
                label={placeholder}
                // placeholder={placeholder}
                name={name}
                // InputLabelProps={{
                //     shrink: true,
                // }}
                type="text"
                variant="outlined"
                size="small"
                onChange={(e, value) => {
                    let userInput = e.target.value
                    onChange(userInput)
                    this.setState({
                        userInput: userInput
                    })
                }}
                validators={validators}
                errorMessages={errorMessages}
            />
        );
    }
}

export default StringSearch;
