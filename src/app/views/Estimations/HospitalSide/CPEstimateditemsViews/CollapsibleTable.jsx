import React, { Component } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

class CollapsibleTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [
        { id: 1, name: 'John', age: 25 },
        { id: 2, name: 'Jane', age: 30 },
        // ... other rows
      ],
      openRows: {} // Keeps track of open/collapsed state for each row
    };
  }

  handleRowToggle = (rowId) => {
    this.setState((prevState) => ({
      openRows: {
        //...prevState.openRows,
        [rowId]: !prevState.openRows[rowId]
      }
    }));
  };

  render() {
    const { rows, openRows } = this.state;

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => this.handleRowToggle(row.id)}
                    >
                      {openRows[row.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.age}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell  style={{ padding: 0, paddingTop: 0 }} colSpan={3}>
                    <Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
                      {/* Content you want to show when row is expanded */}
                      <div>Additional information for {row.name}</div>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default CollapsibleTable;
