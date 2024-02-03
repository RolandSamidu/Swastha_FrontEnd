import { Card, Grid, IconButton, TextField, Tooltip, Typography } from "@material-ui/core"
import moment from "moment"
import React,{ Component, Fragment } from "react"
import {
    LoonsTable,
    Button,
    SubTitle,
    DatePicker
} from 'app/components/LoonsLabComponents'
import DeleteIcon from '@material-ui/icons/Delete';
import { Autocomplete } from "@material-ui/lab";
import { NPDrugApprovalStatus2 } from "../../../appconst";

class NPDrugFRStatus extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data : [],
            columns : [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        filter : false,
                        customBodyRenderLite: (dataIndex) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full flex">
                                            <Tooltip title="approve">
                                                <IconButton 
                                                    aria-label="approve" 
                                                    onClick={()=>this.handleApproval(dataIndex)}
                                                >
                                                    <DeleteIcon color="error"/>
                                                </IconButton>
                                            </Tooltip>
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'request_id',
                    label: 'Request ID',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: '',
                    label: 'Drug Name',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                        {(value != null) ? value.name:null}
                                    </Grid>
                                )
                        }
                    }
                },
                {
                    name: 'frDate',
                    label: 'FR Submitted Name',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: 'decisionReceivedDate',
                    label: 'Decision Received Date',
                    options: {
                        filter : false,
                    }
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        filter : false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // {console.log(value)}
                                return(
                                    <Grid className="w-full">
                                            {(value != null) ? value.name:null}
                                    </Grid>
                                )
                        }
                    }
                },
            ],
            loaded : true,

            submitedDateRange : {
                from : null,
                to : null
            },
            decisionReceivedDate : {
                from : null,
                to : null
            },
        }
    }
    render() { 
        return (
            <Fragment>
                <Grid className="pb-24 pt-7 px-8 ">
                    <Card className="pb-24 pt-7 px-8">
                        <Grid
                            container
                            spacing={2}
                            className="pb-5"
                        >
                            <Grid
                                item
                                xs={12}
                                md={6}
                            >
                                <SubTitle title="Status" />
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={NPDrugApprovalStatus2}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            let formData = this.state.formData;
                                            formData.examination_data[0].question = value.label;
                                            this.setState({ formData })

                                        }
                                    }}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Type"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                            >
                                <Grid container>
                                    <Grid
                                        item
                                        md={4}
                                        className="pt-4"
                                    >
                                        <Typography>Submitted Date Range</Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        md={8}
                                    >
                                        <Grid
                                            className="flex justify-center"
                                        >
                                            <Grid>
                                                <SubTitle title="From" />
                                            </Grid>
                                            <Grid>
                                                <DatePicker className="w-full px-5"
                                                    value={this.state.submitedDateRange.from}
                                                    placeholder=""
                                                    // minDate={new Date()}
                                                    //maxDate={new Date()}
                                                    required={true}
                                                    // disabled={this.state.date_selection}
                                                    errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let temp = this.state.submitedDateRange;
                                                        temp.from = moment(date).format('yyyy-MM-DD')
                                                        this.setState({ submitedDateRange : temp })
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            className="flex justify-center"
                                        >
                                            <Grid>
                                                <SubTitle title="To" />
                                            </Grid>
                                            <Grid
                                                className="pl-4"
                                            >
                                                <DatePicker className="w-full px-5"
                                                    value={this.state.submitedDateRange.to}
                                                    placeholder=""
                                                    // minDate={new Date()}
                                                    //maxDate={new Date()}
                                                    required={true}
                                                    // disabled={this.state.date_selection}
                                                    errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let temp = this.state.submitedDateRange;
                                                        temp.to = moment(date).format('yyyy-MM-DD')
                                                        this.setState({ submitedDateRange : temp })
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        md={8}
                                        className="flex justify-center"
                                    >
                                        
                                    </Grid>
                                </Grid>
                                <Grid container className="pt-5 ">
                                    <Grid
                                        item
                                        md={4}
                                        className="pt-4"
                                    >
                                        <Typography>Decision Received Date Range</Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        md={8}
                                    >
                                        <Grid
                                            className="flex justify-center"
                                        >
                                            <Grid>
                                                <SubTitle title="From" />
                                            </Grid>
                                            <Grid>
                                                <DatePicker className="w-full px-5"
                                                    value={this.state.decisionReceivedDate.from}
                                                    placeholder=""
                                                    // minDate={new Date()}
                                                    //maxDate={new Date()}
                                                    required={true}
                                                    // disabled={this.state.date_selection}
                                                    errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let temp = this.state.decisionReceivedDate;
                                                        temp.from = moment(date).format('yyyy-MM-DD')
                                                        this.setState({ decisionReceivedDate : temp })
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            className="flex justify-center"
                                        >
                                            <Grid>
                                                <SubTitle title="To" />
                                            </Grid>
                                            <Grid
                                                className="pl-4"
                                            >
                                                <DatePicker className="w-full px-5"
                                                    value={this.state.decisionReceivedDate.to}
                                                    placeholder=""
                                                    // minDate={new Date()}
                                                    //maxDate={new Date()}
                                                    required={true}
                                                    // disabled={this.state.date_selection}
                                                    errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let temp = this.state.decisionReceivedDate;
                                                        temp.to = moment(date).format('yyyy-MM-DD')
                                                        this.setState({ decisionReceivedDate : temp })
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        md={8}
                                        className="flex justify-center"
                                    >
                                        
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid>
                            {this.state.loaded?
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
                        </Grid>
                    </Card>
                </Grid>
            </Fragment>
        );
    }
}
 
export default NPDrugFRStatus;