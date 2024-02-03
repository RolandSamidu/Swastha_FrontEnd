import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Card,
    Grid, IconButton, Input, TextField, Tooltip, Typography,
} from '@material-ui/core'
import 'date-fns'
import {
    MainContainer,
    LoonsSnackbar,
    LoonsTable,
    LoonsCard,
    Button,
    DatePicker,
    CardTitle
} from 'app/components/LoonsLabComponents'

import PropTypes from "prop-types";

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ListIcon from '@mui/icons-material/List';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Link } from 'react-router-dom'

const styleSheet = (theme) => ({})

class PatientNPDrugSummary extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    static propTypes = {
        availabe: PropTypes.number,
        onOrder: PropTypes.number,
        issued: PropTypes.number,
    }

    static defaultProps = {
        availabe: 0,
        onOrder: 0,
        issued: 0,
    }

    render() {
        // let { theme } = this.props
        const {
            availabe,
            onOrder,
            issued,
        } = this.props

        return (
            <Fragment>
                <Grid
                    className='w-full'
                >
                    <>
                        <Grid
                            style={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                            <Grid
                                style={{ display: 'flex-column', justifyContent: 'flex-end' }}
                            >
                                <Grid
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <Typography>Available Prescribe</Typography>
                                </Grid>
                                <Grid
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <AssignmentTurnedInIcon className='text-green' sx={{ width: '3rem', height: '3rem' }} />
                                </Grid>
                                <Grid
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <Typography variant='h4'>{availabe}</Typography>
                                </Grid>
                            </Grid>
                            <Grid
                                style={{ display: 'flex-column', justifyContent: 'flex-end' }}
                            >
                                <Grid
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <Typography>On Order</Typography>
                                </Grid>
                                <Grid
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <AccessTimeFilledIcon className='text-error' sx={{ width: '3rem', height: '3rem', }} />
                                </Grid>
                                <Grid
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <Typography variant='h4'>{onOrder}</Typography>
                                </Grid>
                            </Grid>
                            <Grid
                                style={{ display: 'flex-column', justifyContent: 'flex-end' }}
                            >
                                <Grid
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <Typography>Issued</Typography>
                                </Grid>
                                <Grid
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <ListIcon className='text-dark' sx={{ width: '3rem', height: '3rem', }} />
                                </Grid>
                                <Grid
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <Typography variant='h4'>{issued}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* <Grid
                            container
                            spacing={2}
                            className='flex justify-end'
                        >
                            <Grid
                                item
                            >
                                <Link to=''>
                                    <Tooltip title="">
                                        <CompareArrowsIcon color='warning'/>
                                    </Tooltip>
                                </Link>
                            </Grid>
                            <Grid
                                item
                                >
                                <Link to=''>
                                    <Tooltip title="">
                                        <ControlPointIcon color='primary'/>
                                    </Tooltip>
                                </Link>
                            </Grid>
                        </Grid> */}
                    </>
                </Grid>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(PatientNPDrugSummary)
