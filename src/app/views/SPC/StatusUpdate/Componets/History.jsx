import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import { Card, CardContent, Divider, Grid, Icon, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { dateTimeParse } from 'utils';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    root: {
        margin: "10px 0",
        minWidth: 275,
    },
});

export default function History({ data }) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false, bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };



    return (
        <div>
            <div className='flex items-center' onClick={toggleDrawer('right', true)}>
                <Typography className='text-12 text-black font-normal my-2 cursor-pointer mr-2'>{"Last Update at " + dateTimeParse(data.length > 0 ? data[0].updatedAt : new Date())}</Typography>

                <IconButton color="primary" aria-label="upload picture" component="span" onClick={toggleDrawer('right', true)}>
                    <Icon color="primary">access_time</Icon>
                </IconButton>

            </div>


            <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
                <div style={{ width: 600, padding: "20px " }}>
                    <div style={{ display: 'flex', width: "100%", justifyContent: "space-between", alignItems: 'center' }}>
                        <div style={{ display: 'flex', }}>
                            <Icon className='text-primary mr-2'>access_time</Icon>
                            <Typography className='text-primary font-bold text-18' >Status Change History</Typography>
                        </div>
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={toggleDrawer('right', false)}>
                            <CloseIcon />
                        </IconButton>

                    </div>


                    <Divider className='my-2' />

                    <div>

                        {data.length > 0 ?
                            <Grid container spacing={2}>

                                {data.map((element, index) =>

                                    <Grid key={index} item xs={12}>
                                        <Card className={classes.root} variant="outlined">
                                            <CardContent>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    {"Updated On " + dateTimeParse(element.updatedAt)}
                                                </Typography>
                                                <Typography variant="body2" component="p" className='mt-2' gutterBottom>


                                                    {'Status Updated To ⏭️'}
                                                </Typography>
                                                <span className='bg-green text-white px-2 py-1 border-radius-4 mb-4 mt-2 '>{element.data.status}</span>
                                                {element.Employee &&
                                                    <Typography className={[classes.pos, "my-3"]} color="textSecondary">
                                                        {"By " + (element.Employee.name) + " ( " + element.Employee.designation + " )"}
                                                    </Typography>
                                                }

                                                <Typography variant="body2" component="p">
                                                    {"Remarks"}
                                                </Typography>
                                                <Typography className={classes.pos} color="textSecondary">
                                                    {(element.spc_remark ?? "No Added Remarks")}
                                                </Typography>


                                            </CardContent>

                                        </Card>
                                    </Grid>
                                )}


                            </Grid>
                            : <Grid container spacing={2} justifyContent='center' alignItems='center'>
                                <Card className={classes.root} variant="outlined" >
                                    <CardContent>

                                        <Typography variant="body2" component="p" className='mt-2' gutterBottom>


                                            {'There is No updated history at this moment.'}
                                        </Typography>



                                    </CardContent>

                                </Card>
                            </Grid>
                        }

                    </div>
                </div>

            </Drawer>
        </div>
    );
}
