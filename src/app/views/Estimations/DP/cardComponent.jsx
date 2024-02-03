import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'

import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { yearMonthParse, dateParse, yearParse } from 'utils'

import {
    CardTitle,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress, { CircularProgressProps, } from '@mui/material/CircularProgress';
import {
    Grid, Dialog
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import CardView from './CardView'

class CardComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            openDetails: false,
            name: null,
            count: null,
            colour: null,
            progress: 10,
            total: null
        }
    }

    componentDidMount() {
        // this.loadEstimation()
        console.log('chhhdhfdsjhs', this.props.count)
        let inc_count = 0
        if (this.props.count == null || this.props.count == undefined || this.props.count == [] || this.props.count.length == 0) {
            inc_count = 0
        } else {
            inc_count = this.props.count
        }

        this.setState({
            name: this.props.name,
            count: inc_count,
            colour: this.props.colour,
            total: this.props.total
        })

    }



    render() {
        const { classes } = this.props


        let value = ((Number(this.state.count) / Number(this.state.total)) * 100) || 0
        return (
            < Fragment >
                {/* <MainContainer> */}

                {/* <React.Fragment> */}
                {console.log('this.state.count', this.state.count, this.state.total, value)}
                <Box sx={{ minWidth: 200 }} className='m-1 p-1'>
                    <Card>
                        <CardContent onClick={() => { this.setState({ openDetails: true }) }} style={{paddingBottom:8,padding:8,  border: '1px solid whtie', borderRadius: '5px', background: this.state.colour }}>

                            <Grid container>
                                <Grid item style={{borderColor:'#ebebeb',borderRightStyle:'solid',padding:'7px',borderWidth:'1px'}}>
                                    <Grid display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                        container
                                        style={{height:'100%'}}
                                    >
                                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                            <CircularProgress variant="determinate" value={value || 0} />
                                            <Box
                                                sx={{
                                                    top: 0,
                                                    left: 0,
                                                    bottom: 0,
                                                    right: 0,
                                                    position: 'absolute',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    component="div"
                                                    color="text.secondary"
                                                >{`${Math.round(value ? value : 0)}%`}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Grid item className='ml-2'>

                                    <Typography className='mt-2' color="text.secondary" component="div" style={{ fontWeight: 'bold' }}>
                                        {this.state.name}
                                    </Typography>
                                    <Typography  variant="h5" >
                                        {this.state.count}
                                    </Typography>


                                </Grid>


                            </Grid>






                        </CardContent>
                    </Card>
                </Box>
                {/* </React.Fragment> */}

                {/* </MainContainer> */}



                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.openDetails}
                    onClose={() => {
                        this.setState({
                            openDetails: false,
                        })
                    }}
                >
                    <MuiDialogTitle disableTypography="disableTypography">
                        <CardTitle title={this.props.name + " Warehouses"} />{' '}
                        {/* <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ dialog_for_select_warehouse: false }) }}>
                            <CloseIcon />
                        </IconButton>
 */}
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <CardView EstimationData={this.props.estimationData} status={this.props.status} name={this.props.name}></CardView>
                    </div>
                </Dialog>


            </Fragment>
        )
    }
}

export default (CardComponent)