import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Typography } from '@mui/material';
import Box from '@material-ui/core/Box';

import { Grid } from '@material-ui/core';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 15,
    borderRadius: 10,
    width: '100%',
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: (props) => {
      const { value } = props;
      if (value < 30) {
        return "#21bf02"; // Green color
      } else if (value < 70) {
        return "#ed8e09"; // Orange color
      } else {
        return "#ed1109"; // Red color
      }
    },
  },
}))(LinearProgress);




const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function CustomizedProgressBars({ value }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>

      

<Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <BorderLinearProgress variant="determinate" value={value} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          value,
        )}%`}</Typography>
      </Box>
    </Box>

    </div>
  );
}




