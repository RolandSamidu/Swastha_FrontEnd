import {
    CircularProgress,
    Divider,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Typography,
} from '@material-ui/core'
import {
    CardTitle,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import React from 'react'
import { Component } from 'react'
import EstimationService from '../../services/EstimationService'
import { yearParse } from 'utils'


class InstituteEstimation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: '',
            severity: 'success',

            formData: {
                limit: 100,
                page: 0,
                item_id: this.props.match.params.item_id,
                year:yearParse(new Date()),
                
                'order[0]': ['estimation', 'DESC'],
            },

            remarks: null,
            data: [],
            columns: [
                {
                    name: 'intitute',
                    label: 'Institute',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.HosptialEstimation.Warehouse.name
                        },
                    },
                },
                // {
                //     name: 'real_estimation',
                //     label: 'Current Estimation Year',
                //     options: {
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return this.state.data[tableMeta.rowIndex]?.HosptialEstimation.Estimation.from.split('T')[0]
                //         },
                //     },
                // },
                // {
                //     name: 'estimation',
                //     label: 'Previous Estimation Year',
                //     options: {
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return this.getPreviousEstimationYear(this.state.data[tableMeta.rowIndex]?.HosptialEstimation.Estimation.from.split('T')[0])
                //         },
                //     },
                // },
                {
                    name: 'estimation',
                    label: 'Estimation',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.estimation
                        },
                    },
                },
                
            ],
            totalItems: 0,
            loaded: false,
        }
    }

    componentDidMount() {
        this.loadData()
    }

    getPreviousEstimationYear(year) {
        let currYear = year.split('-')
        return (currYear[0] - 1) + '-' + currYear[1] + '-' + currYear[2]
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadData()
        })
    }

    async loadData() {
        this.setState({ loaded: false })
        let formData = this.state.formData
        let orders = await EstimationService.getAllEstimationITEMS(formData)
        if (orders.status == 200) {
            console.log('Estimation Details', orders.data.view)
            this.setState({ data: orders.data.view.data, totalItems: orders.data.view.totalItems })
        }
        this.setState({ loaded: true })
    }

    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <Grid container="container" lg={12} md={12}>
                        <Grid item="item" lg={7} md={7} xs={7}>
                            <Grid itemm="itemm" xs={12}>
                                <div className='flex'>
                                    <Typography variant="h6" className="font-semibold" >Institute Estimation</Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider className="mb-4"></Divider>
                    <Grid container="container" className="mt-2 pb-5">
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            {this.state.loaded ? (
                                <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'all_items'}
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: this.state.formData.limit,
                                        page: this.state.formData.page,
                                        print: true,
                                        viewColumns: true,
                                        download: true,
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    this.setPage(
                                                        tableState.page
                                                    )
                                                    break
                                                case 'sort':
                                                    // this.sort(tableState.page, tableState.sortOrder);
                                                    break
                                                default:
                                                    console.log(
                                                        'action not handled.'
                                                    )
                                            }
                                        },
                                    }}
                                ></LoonsTable>
                            ) : (
                                //loading effect
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30} />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </LoonsCard>
                {/* <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar> */}
            </MainContainer>
        )
    }
}
export default InstituteEstimation
