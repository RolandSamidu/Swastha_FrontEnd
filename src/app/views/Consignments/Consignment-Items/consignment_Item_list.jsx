import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    CircularProgress,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Typography,
    Box,
} from '@material-ui/core'
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,


} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import VisibilityIcon from '@material-ui/icons/Visibility';
import ConsignmentService from 'app/services/ConsignmentService'
import localStorageService from 'app/services/localStorageService'
import SchedulesServices from 'app/services/SchedulesServices'
import { dateParse, yearParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import AddIcon from '@mui/icons-material/Add';

class Consignment_List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            searchValue: '',
            filterData: {
                page: 0,
                limit: 20,
                'order[0]': [
                    'updatedAt', 'DESC'
                ],
                search: null,
                owner_id:'000'
            },

            user_role:null,


            data: [

            ],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex]?.Consignment?.id

                            if (this.state.user_role === 'MSD AD') {
                                return (
                                    <Grid>
                                        <IconButton
                                            onClick={() => {
                                                window.location.href = `/consignments/msdAd/view-consignment/${id}`
                                            }}>
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Grid>
                                )
                            } else if (this.state.user_role === 'MSD SCO'){
                                return (
                                    <Grid>
                                        <IconButton
                                            onClick={() => {
                                                window.location.href = `/consignments/msdSCO/view-consignment/${id}`
                                            }}>
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Grid>
                                )
                            } else if (this.state.user_role === 'Super Admin'){
                                return (
                                    <Grid>
                                        <IconButton
                                            onClick={() => {
                                                window.location.href = `/consignments/view-consignment/${id}`
                                            }}>
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Grid>
                                )
                            } else if (this.state.user_role === 'MSD MSA'){
                                return (
                                    <Grid>
                                        <IconButton
                                            onClick={() => {
                                                window.location.href = `/consignments/msdMSA/view-consignment/${id}`
                                            }}>
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Grid>
                                )
                            } else if (this.state.user_role === 'MSD Director'){
                                return (
                                    <Grid>
                                        <IconButton
                                            onClick={() => {
                                                window.location.href = `/consignments/msdDirector/view-consignment/${id}`
                                            }}>
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Grid>
                                )
                            } else if (this.state.user_role === 'HSCO'){
                                return (
                                    <Grid>
                                        <IconButton
                                            onClick={() => {
                                                window.location.href = `/consignments/msdSCO/view-consignment/${id}`
                                            }}>
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Grid>
                                )
                            } else if (this.state.user_role === 'MSD SCO QA'){
                                return (
                                    <Grid>
                                        <IconButton
                                            onClick={() => {
                                                window.location.href = `/consignments/msdSCO/view-consignment/${id}`
                                            }}>
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Grid>
                                )
                            } else {
                                return (
                                    <Grid>
                                        <IconButton
                                            onClick={() => {
                                                window.location.href = `/view-all-consignment/${id}`
                                            }}>
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Grid>
                                )
                            } 
                            

                        },
                    }
                },
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        display: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                           
                            return (
                                <p>{this.state.data[tableMeta.columnIndex]?.item_schedule?.Order_item?.item?.sr_no}</p>  
                            )
                            
                        },
                    }
                    
                },
                {
                    name: 'name',
                    label: 'Item Name',
                    options: {
                        display: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.columnIndex]?.item_schedule?.Order_item?.item?.name}</p>  
                            )
                            
                        },
                    }
                },

                {
                    name: 'order_no',
                    label: 'Order List number',
                    options: {
                        display: true,

                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('table data', this.state.data[tableMeta.columnIndex])
                            return (
                                <p>{this.state.data[tableMeta.columnIndex]?.Consignment?.order_no}</p>  
                            )
                            
                        },
                    }
                    
                },
                {
                    name: 'po',
                    label: 'PO Number',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                this.state.data[dataIndex]?.Consignment?.po
                            )

                        },
                    }
                
                },
                {
                    name: 'invoice_date',
                    label: 'Invoice Date',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                this.state.data[dataIndex]?.Consignment?.invoice_date
                            )

                        },
                    }
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                this.state.data[dataIndex]?.status
                            )

                        },
                    }
                },
                
            ]


        }
    }


    async loadList() {

        let filterData = this.state.filterData

        let res = await ConsignmentService.getConsignmentItems(filterData)
        if (res.status === 200) {
            console.log('checking consignment item data', res)
            this.setState({
                data: res.data.view.data,
                loaded: true,
                totalItems: res.data.view.totalItems,

            })
        }
    }

    async checkLogingUser(){
        var user = await localStorageService.getItem('userInfo').roles[0]
        console.log('chhecking user', user)
        
        this.setState({
            user_role:user
        })
    }


    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            this.loadList()
        })
    }

    componentDidMount() {
        this.loadList()
        this.checkLogingUser()
    }

    render() {
        return (
            <MainContainer>
                <LoonsCard>
    
                    <CardTitle title={"Consignment List"} />
                    <ValidatorForm onSubmit={() => this.setPage(0)}>
                        <Grid container="container" spacing={2} className='mt-2'>
                            {/* filter by status */}
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                <SubTitle title={"Search"}></SubTitle>
                                
                                    <TextValidator
                                        placeholder="Search"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e)=>{
                                            let filterData = this.state.filterData
                                            filterData.search = e.target.value
                                        }}  
                                        // value={this.state.filterData.search}
                                        
                                    />
                                    
                            </Grid>
                            {/* filter by Type */}
                            {/* <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 p-0">
                                <SubTitle title={"Item Name"}></SubTitle>
                                
                                        <TextValidator
                                            placeholder="Item Name"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            size="small"
                                            onChange={(e)=>{
                                                let filterData = this.state.filterData
                                                filterData.item_name = e.target.value
                                            }}  
                                            value={this.state.filterData.item_name}
                                           
                                        />

                            </Grid> */}
                            
                            <Grid

                                item="item" lg={3} md={3} sm={12} xs={12} className=" w-full flex justify-start p-0">
                                {/* Submit Button */}
                                <SubTitle />
                                <LoonsButton className="mt-6 mr-2" progress={false} type='submit'
                                    //onClick={this.handleChange}
                                    style={{ height: "30px", width: "100px" }}
                                >
                                    <span className="capitalize">
                                        {
                                            'Search'
                                        }
                                    </span>
                                </LoonsButton>

                            </Grid>


                            {/* <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mt-3 p-0">
                                <SubTitle />
                                <TextValidator className='' placeholder="Search"
                                    //variant="outlined"
                                    fullWidth="fullWidth" variant="outlined" size="small"
                                    // value={this.state.formData.search}
                                    value={this.state.filterData.search}
                                    onChange={(e) => {
                                        let filterData = this.state.filterData;
                                        filterData.search = e.target.value;
                                        this.setState({ filterData });
                                    }}
                                    // validators={[
                                    //     'required',
                                    // ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon onClick={() => { this.loadOrder() }}></SearchIcon>
                                            </InputAdornment>
                                        )
                                    }} />

                            </Grid> */}

                        </Grid>
                    </ValidatorForm>
                   

                    {this.state.loaded ?
                        <Grid container className='mt-8'>
                            <LoonsTable
                                    id={'completed'}
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        // count: 10,
                                        rowsPerPage: this.state.filterData.limit,
                                        page: this.state.filterData.page,
                                        print: false,
                                        viewColumns: false,
                                        download: false,
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    this.setPage(tableState.page)
                                                    break
                                                case 'sort':
                                                    //this.sort(tableState.page, tableState.sortOrder);
                                                    break
                                                default:
                                                    console.log(
                                                        'action not handled.'
                                                    )
                                            }
                                        },
                                    }}
                                    >
                                </LoonsTable>
                            </Grid>
                        
                        : null}

                </LoonsCard>
            </MainContainer>
        )
    }
}







export default Consignment_List