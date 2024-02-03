import React, { Component } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

const styles = {
  wrapper: { position: 'relative' },
  rangeWrapper: { zIndex: 999, width: 'fit-content', boxShadow: '2px 3px 29px -10px #888888', position: 'absolute' },
  btn: { border: '1px solid rgba(0, 0, 0, 0.23)', marginTop: 5, width: '100%' }
}

class RangePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      isOpen: false
    }
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(ranges) {
    const { onComplete } = this.props;
    this.setState({ startDate: ranges.selection.startDate, endDate: ranges.selection.endDate });
    onComplete({ startDate: ranges.selection.startDate, endDate: ranges.selection.endDate });
    if(ranges.selection.startDate != ranges.selection.endDate) {
      this.setState({isOpen: false});
    }
  }
  render() {
    const selectionRange = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      key: 'selection',
    }
    return <div style={styles.wrapper}>
      {this.state.isOpen ? <div style={styles.rangeWrapper}><DateRangePicker
        ranges={[selectionRange]}
        onChange={this.handleSelect}
      /></div> : <Button style={styles.btn} onClick={()=>{this.setState({isOpen: true})}}>{this.state.startDate.toLocaleDateString("en-US")} - {this.state.endDate.toLocaleDateString("en-US")}</Button>}
    </div>
  }
}

RangePicker.propTypes = {
  onComplete: PropTypes.func.isRequired
};

export default RangePicker;