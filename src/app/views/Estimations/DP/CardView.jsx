import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'

import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { yearMonthParse, dateParse, yearParse } from 'utils'

import {
    MainContainer, LoonsTable
} from 'app/components/LoonsLabComponents'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress, { CircularProgressProps, } from '@mui/material/CircularProgress'; import {
    Grid,
} from '@material-ui/core'
import localStorageService from 'app/services/localStorageService'
import EstimationService from 'app/services/EstimationService'

class CardView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            totalItems: 0,
            totalPages: 0,
            filterData: {
                estimation_id: this.props.EstimationData?.id,
                // district : 'KANDY',
                institute_type: 'Provincial',
                status: this.props.status,
                page: 0,
                limit: 10,
            },
            data: [],
            columns: [
                {
                    name: 'store_id',
                    label: 'Store ID',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Warehouse?.Pharmacy_drugs_store?.store_id
                            return data
                        },
                    },
                },
                {
                    name: 'warehouse',
                    label: 'Owner ID',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Warehouse?.owner_id
                            return data
                        },
                    },
                },
                {
                    name: 'warehouse',
                    label: 'Warehouse',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Warehouse?.name
                            return data
                        },
                    },
                },
            ]
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let estimation_id = this.props.EstimationData?.id
        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')

        console.log('login_user_pharmacy_drugs_stores', login_user_pharmacy_drugs_stores)
        let filterData = this.state.filterData
        filterData.district = login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district


        let res = await EstimationService.getEstimations(filterData)

        if (res.status === 200) {
            this.setState({
                data: res.data.view.data,
                totalItems: res.data?.view?.totalItems,
                totalPages: res.data?.view?.totalPages,
                loaded: true
            })
        }
    }

    async componentDidMount() {
        this.loadData()

    }


    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({ filterData }, () => { this.loadData() })
    }

    render() {
        const { classes } = this.props



        return (
            < Fragment >
                {this.state.loaded ?
                    <LoonsTable
                        //title={"All Aptitute Tests"}

                        id={'patientsAdmission'}
                        // title={'Active Prescription'}
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
                    ></LoonsTable>
                    : <Grid className="justify-center text-center w-full pt-12">
                        <CircularProgress size={30} />
                    </Grid>
                }

            </Fragment>
        )
    }
}

export default (CardView)