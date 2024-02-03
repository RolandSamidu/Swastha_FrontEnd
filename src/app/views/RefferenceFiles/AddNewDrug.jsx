import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid, IconButton, Input, TextField, Tooltip, Typography,
} from '@material-ui/core'
import 'date-fns'
import {
    MainContainer,
    LoonsSnackbar,
    LoonsTable,
    LoonsCard,
    Button,
    DatePicker
} from 'app/components/LoonsLabComponents'
import { Link } from 'react-router-dom'
import { Autocomplete} from '@mui/material'

import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import moment from 'moment'
import PatientNPDrugSummary from './PatientNPDrugSummary'

const styleSheet = (theme) => ({})

class AddNewDrug extends Component {
    constructor(props) {
        super(props)
        this.state = {

            page : 0,
            rowsPerPage : 0,

            
            loaded : true,

            columns : [
                {
                    name: 'index',
                    label: 'No.',
                    options: {
                        filter : false,
                        customBodyRenderLite : (dataIndex) => (
                            <Grid>
                                <TextValidator
                                    className=" w-full"
                                    name="index"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    value={this.state.data[dataIndex].index}
                                    // onChange={(e)=>{
                                    //     let temp = this.state.data
                                    //     temp[dataIndex].index = e.target.value
                                    //     this.setState({data:temp})
                                    // }}
                                    disabled={
                                        false
                                    }
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'This field is required',
                                    ]}
                                />
                            </Grid>
                        )
                    }
                },
                {
                    name: 'drugName',
                    label: 'Drug Name',
                    options: {
                        filter : false,
                        customBodyRenderLite : (dataIndex) => (
                            <Grid>
                                <TextValidator
                                    className=" w-full"
                                    name="index"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    value={this.state.data[dataIndex].drugName} 
                                    onChange={(e)=>{
                                        let temp = this.state.data
                                        // console.log('data',this.state.data)
                                        temp[dataIndex].drugName = e.target.value
                                        this.setState({data:temp})
                                    }}
                                    disabled={
                                        false
                                    }
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'This field is required',
                                    ]}
                                />
                            </Grid>
                        )
                    }
                },
                {
                    name: 'dose',
                    label: 'Dose',
                    options: {
                        filter : false,
                        customBodyRenderLite : (dataIndex) => (
                            <Grid
                                item
                            >
                                <TextValidator
                                    className=" w-full"
                                    name="duration"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    value={this.state.data[dataIndex].dose}
                                    onChange={(e)=>{
                                        let temp = this.state.data
                                        temp[dataIndex].dose = e.target.value
                                        this.setState({data:temp})
                                    }}
                                    disabled={
                                        false
                                    }
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'This field is required',
                                    ]}
                                />
                            </Grid>
                        )
                    }
                },
                {
                    name: '',
                    label: '',
                    options: {
                        filter : false,
                        customBodyRenderLite : (dataIndex) => (
                            <Grid>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    size='small'
                                    disableClearable
                                    options={['mg','g','l','ml']}
                                    getOptionLabel={(option) => option}
                                    value={this.state.data[dataIndex].measurement}
                                    disabled={
                                        this.state.isUpdate
                                    }
                                    name="projectStatus"
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            // className=" w-full"
                                            value={
                                                this.state.data[dataIndex].measurement
                                            }
                                            disabled={
                                                this.state.isUpdate
                                            }
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            validators={[
                                                'required',
                                            ]}
                                            errorMessages={[
                                                'This field is required',
                                            ]}
                                        />
                                    )}
                                    onChange={(e, newValue) => {
                                        if(newValue !== null){
                                            this.setState({
                                                formData: {
                                                    ...this.state.formData,
                                                    projectStatus: newValue.value
                                                },
                                            })
                                        }
                                    }}
                                />
                            </Grid>
                        )
                    }
                },

                {
                    name: 'frequency',
                    label: 'Freq',
                    options: {
                        filter : false,
                        customBodyRenderLite : (dataIndex) => (
                            <Grid>
                                <TextValidator
                                    className=" w-full"
                                    name="frequency"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    value={this.state.data[dataIndex].frequency}
                                    onChange={(e)=>{
                                        let temp = this.state.data
                                        temp[dataIndex].frequency = e.target.value
                                        this.setState({data:temp})
                                    }}
                                    disabled={
                                        false
                                    }
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'This field is required',
                                    ]}
                                />
                            </Grid>
                        )
                    }
                },
                {
                    name: 'duration',
                    label: 'Duration',
                    options: {
                        filter : false,
                        customBodyRenderLite : (dataIndex) => (
                            <Grid>
                                <TextValidator
                                    className=" w-full"
                                    name="duration"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    value={this.state.data[dataIndex].duration}
                                    onChange={(e)=>{
                                        let temp = this.state.data
                                        temp[dataIndex].duration = e.target.value
                                        this.setState({data:temp})
                                    }}
                                    disabled={
                                        false
                                    }
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'This field is required',
                                    ]}
                                />
                            </Grid>
                        )
                    }
                },
                {
                    name: 'quantity',
                    label: 'Quantity',
                    options: {
                        filter : false,
                        customBodyRenderLite : (dataIndex) => (
                            <Grid>
                                <TextValidator
                                    className=" w-full"
                                    name="duration"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    value={this.state.data[dataIndex].quantity}
                                    onChange={(e)=>{
                                        let temp = this.state.data
                                        temp[dataIndex].quantity = e.target.value
                                        this.setState({data:temp})
                                    }}
                                    disabled={
                                        false
                                    }
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'This field is required',
                                    ]}
                                />
                            </Grid>
                        )
                    }
                },
                {
                    name: 'expectedTreatmentDate',
                    label: 'Expected Treatement Date',
                    options: {
                        filter : false,
                        customBodyRenderLite : (dataIndex) => (
                            <Grid
                                sx={{width:'50px'}}
                            >
                                <DatePicker 
                                    className='w-full'
                                    name="expectedTreatmentDate"
                                    sx={{height:'50px'}}
                                    // views={['year','month']}
                                    value={this.state.data[dataIndex].expectedTreatmentDate}
                                    onChange={
                                        (date) => {
                                            let newDate = moment(date).format('yyyy-MM-DD')
                                            let temp = this.state.data
                                            temp[dataIndex].expectedTreatmentDate = newDate
                                            this.setState({data:temp})
                                        }
                                    }
                                    
                                    format="MM/dd/yyyy"
                                    // minDate=''
                                    // maxDate=''
                                />
                            </Grid>
                        )
                    }
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <Grid className="w-full">
                                    <div className="flex">
                                        <Tooltip title="edit">
                                            {/* <Link to={'/expense/reviewexpense/'+(this.state.expenseData[dataIndex].id)}> */}
                                                <IconButton size="small" aria-label="review">
                                                    <EditOutlinedIcon className="text-secondary" />
                                                </IconButton>
                                            {/* </Link> */}
                                        </Tooltip>
                                        <Tooltip title="delete">
                                            {/* <Link to={'/expense/reviewexpense/'+(this.state.expenseData[dataIndex].id)}> */}
                                                <IconButton size="small" aria-label="review">
                                                    <DeleteOutlineIcon className="text-error" />
                                                </IconButton>
                                            {/* </Link> */}
                                        </Tooltip>
                                        <Tooltip title="save">
                                            {/* <Link to={'/expense/reviewexpense/'+(this.state.expenseData[dataIndex].id)}> */}
                                                <IconButton size="small" aria-label="review">
                                                    <SaveIcon color='primary' />
                                                </IconButton>
                                            {/* </Link> */}
                                        </Tooltip>
                                        <Tooltip title="comment">
                                            {/* <Link to={'/expense/reviewexpense/'+(this.state.expenseData[dataIndex].id)}> */}
                                                <IconButton size="small" aria-label="review">
                                                    <AddCommentOutlinedIcon color="success" />
                                                </IconButton>
                                            {/* </Link> */}
                                        </Tooltip>
                                        <Tooltip title="add">
                                            {/* <Link to={'/expense/reviewexpense/'+(this.state.expenseData[dataIndex].id)}> */}
                                                <IconButton size="small" aria-label="review">
                                                    <AddCircleOutlineIcon className="text-muted" />
                                                </IconButton>
                                            {/* </Link> */}
                                        </Tooltip>
                                    </div>
                                </Grid>
                            );
                        }
                    }
                },
            ],

            data : [
                {
                    index : 1,
                    drugName:'',
                    dose:'',
                    measurement:'',
                    frequency:'',
                    duration:'',
                    quantity:'',
                    expectedTreatmentDate:null
                }
            ]
        }
    }

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        this.setState({laoded:false})
        this.setState({laoded:true})
    }


    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>

                <MainContainer>
                    <Grid>
                        <LoonsCard>
                            <Grid>
                                <Typography>Latest Physician Order</Typography>
                                <Typography>Clinic Name 2</Typography>
                                <Typography variant='caption' className='text-muted'>2022-02-02</Typography>
                            </Grid>
                            <ValidatorForm>
                                {this.state.loaded ? 
                                    <LoonsTable
                                        id={"orderNewDrug"}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: false,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: this.state.rowsPerPage,
                                            page: this.state.page,
                                            rowsPerPageOptions: [5,10,15,20,30,50,100],
                                            selectableRows:true,
                                            onTableChange: (action, tableSate) => {
                                                console.log(action,tableSate)
                                                switch(action){
                                                    case 'changePage':
                                                        // this.setState({page:tableSate.page},()=>{
                                                        //     this.showTableData()
                                                        // })
                                                        // console.log('page',this.state.page);
                                                        break;
                                                        case 'changeRowsPerPage':
                                                            this.setState({
                                                                rowsPerPage:tableSate.rowsPerPage,
                                                                page:0,
                                                            },()=>{
                                                                // this.showTableData()
                                                            })
                                                        break;
                                                    default:
                                                        console.log('action not handled');
                                                }
                                            }
                                        
                                        }}
                                        
                                    ></LoonsTable>
                                : null
                                }
                            </ValidatorForm>

                            <Grid
                                className='py-5'
                                container
                                spacing={2}
                            >
                                <Grid
                                    item
                                >
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        startIcon='add'
                                        onClick={()=>{
                                            let index = this.state.data.length
                                            let temp = {
                                                index : index+1,
                                                drugName:'',
                                                dose:'',
                                                measurement:'',
                                                frequency:'',
                                                duration:'',
                                                quantity:'',
                                                expectedTreatmentDate:null
                                            }

                                            let tempdata = this.state.data
                                            tempdata.push(temp)
                                            this.setState({data:tempdata})
                                        }}
                                    >
                                        Add another drug
                                    </Button>
                                </Grid>
                                <Grid
                                    item
                                >
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        startIcon='send'
                                    >
                                        Send for director approval
                                    </Button>
                                </Grid>
                            </Grid>
                        </LoonsCard>
                    </Grid>

                    <PatientNPDrugSummary
                        availabe={5}
                        onOrder={4}
                        issued={3}                
                    />


                </MainContainer>
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
                

            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(AddNewDrug)
