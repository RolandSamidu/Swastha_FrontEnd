import React, { Component } from 'react';

import {
    DatePicker,
} from 'app/components/LoonsLabComponents'
import { dateParse } from 'utils'
class DateSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: [],
            date: null
        };
    }


    render() {
        const { onChange, placeholder, required } = this.props;

        return (
            <DatePicker
                label={placeholder}
                required={required}
                className="w-full"
                placeholder={placeholder}
                value={this.state.date}
                onChange={(date) => {
                    onChange(dateParse(date))
                    this.setState({
                        date: dateParse(date)
                    })

                }}
            />
        );
    }
}

export default DateSelect;
