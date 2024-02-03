import React, { Component, Fragment } from "react";
import { CardTitle, LoonsCard, SubTitle, LoonsSwitch } from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import { LoonsTable, Button, DatePicker } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator  } from "react-material-ui-form-validator";
import { CircularProgress, Grid, Tooltip, IconButton } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import * as appConst from '../../../appconst'
import { Autocomplete} from "@material-ui/lab";

class AuthorityLevelSetUp extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            filterData: {
                limit: 20,
                page: 0,
                valid_from: '21/05/2022',
                amount_from: '100M to 200M',
                admission_mode: '',
                status: '',
                'order[0]': ['updatedAt', 'DESC'],
            },
            columns: [
                {
                    name: 'procurement_level', // field name in the row object
                    label: 'Procurement Level', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="procurement_level"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].procurement_level}
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].procurement_level = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'amount_from', // field name in the row object
                    label: 'Amount From (LKR) M', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="opd"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].opd}
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].opd = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'amount_to', // field name in the row object
                    label: 'To (LKR) M', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="opd"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].opd}
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].opd = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'valid_from', // field name in the row object
                    label: 'Valid From', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <DatePicker
                                            className="w-full"
                                            value={this.state.filterData.to_date}
                                            //label="Date From"
                                            placeholder="Valid From"
                                            // minDate={new Date()}
                                            //maxDate={new Date("2020-10-20")}
                                            required={true}
                                            errorMessages="this field is required"
                                            onChange={date => {
                                                let filterData = this.state.filterData;
                                                filterData.to_date = date;
                                                this.setState({ filterData })

                                            }}
                                        />
                                </>
                            )
                    },
                },
            },
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        sort: false,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex].id;
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="Edit">
                                        <IconButton
                                            className="px-2"
                                            /* onClick={() => { this.setDataToFields(tableMeta.tableData[tableMeta.rowIndex]); }} */
                                            size="small"
                                            aria-label="view"
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                /* onClick={() => {
                                                    window.location.href = `/consignments/msdAd/view-consignment/${id}`
                                                }} */>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid className="px-2">
                                        <Tooltip title="Change Status">
                                            <LoonsSwitch
                                                color="primary"
                                                /* onChange={() => {
                                                    this.toChangeStatus(
                                                        tableMeta.rowIndex
                                                    )
                                                }} */
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        }
                    }
                }
            ], 
            data:[
                {procurement_level: 'DPC-Minor',amount: '', to: '', valid_from: ''},
                {procurement_level: 'DPC-Major',amount: '', to: '', valid_from: ''},
                {procurement_level: 'MPC',amount: '', to: '', valid_from: ''},
                {procurement_level: 'SCAPC',amount: '', to: '', valid_from: ''}
            ]
        }
    }

    addNewRow(){
        this.setState({loading:false})
        let data=this.state.data;
        data.push({procurement_level: '',amount: '', to: '', valid_from: ''})
        this.setState({data, loading: true})
    }

    render(){
        return(
            <MainContainer>
                <LoonsCard>
                    <CardTitle title="Authority Level Set up"/>

                    <ValidatorForm>
                        {/* Table Section */}
                        <Grid container="container" className="mt-3 pb-5">
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.loading
                                            ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns} options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: 10,
                                                page: this.state.page,
                                                onTableChange: (action, tableState) => {
                                                    console.log(action, tableState)
                                                    switch (action) {
                                                        case 'changePage':
                                                            // this.setPage(     tableState.page )
                                                            break
                                                        case 'sort':
                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                            break
                                                        default:
                                                            console.log('action not handled.')
                                                    }
                                                }
                                            }}></LoonsTable>
                                            : (
                                                //loading effect
                                                <Grid className="justify-center text-center w-full pt-12">
                                                    <CircularProgress size={30} />
                                                </Grid>  
                                            )
                                    }
                            </Grid>
                            <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Button
                                            className="mt-2"
                                            progress={false}
                                            onClick={()=>this.addNewRow()}
                                            scrollToTop={false}
                                            startIcon="add"
                                        >
                                            <span className="capitalize">Add New</span>
                                        </Button>
                                    </Grid>
                        </Grid>
                    </ValidatorForm>

                </LoonsCard>
                <br/>   
                <LoonsCard>
                <CardTitle title="DPC Minor" />

                <ValidatorForm>
                
                <Grid container spacing={3} className="space between">
                    <Grid 
                        className=" w-full"
                        item
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}>
                            <SubTitle title="Amount From:" />

                            <TextValidator
                                // {...params}
                                // placeholder="Please choose"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={this.state.filterData.amount_from}
                                    />
                    </Grid>
                    <Grid 
                        className=" w-full"
                        item
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}>
                            <SubTitle title="Valid From:" />
                            
                            <TextValidator
                                // {...params}
                                // placeholder="Please choose"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={this.state.filterData.valid_from}
                                    />
                    </Grid>
                    
                    <Grid
                        className=" w-full"
                        item
                        lg={4}
                        md={4}
                        sm={12}
                         xs={12}>
                            <SubTitle title="Time Period" />
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                value={this.state.filterData.admission_mode}
                                options={appConst.admission_mode}
                                onChange={(e, value) => {
                                    if (null != value) {
                                        let filterData = this.state.filterData;
                                        filterData.admission_mode = value;
                                        this.setState({ filterData })
                                    } else {
                                        let filterData = this.state.filterData;
                                        filterData.admission_mode = { label: "" };
                                        this.setState({ filterData })
                                    }
                                }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Please choose"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={this.state.filterData.time_period}
                                    />
                                )}
                            />
                        </Grid>
                        <br/>
                        <Grid
                            className=" w-full"
                            item
                            lg={2}
                            md={2}
                            sm={12}
                            xs={12}>
                            <Button
                                //style={{ marginTop: "4" }}
                                // className="mt-2"
                                progress={false}
                                type="submit"
                                scrollToTop={true}
                            >
                                <span className="capitalize">Save</span>
                            </Button>
                        </Grid>

                    </Grid>
                </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default AuthorityLevelSetUp