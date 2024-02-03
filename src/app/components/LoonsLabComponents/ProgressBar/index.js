import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Typography } from '@mui/material';

const BorderLinearProgress = withStyles((theme,value) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
   // backgroundColor: value>80?'red':'#1a90ff',
  },
  
}))(LinearProgress);




const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function CustomizedProgressBars({value}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      
      <BorderLinearProgress   variant="determinate" value={value} />
      <Typography variant="body2" color="textSecondary">{`${Math.round(
          value,
        )}%`}</Typography>
    </div>
  );
}




