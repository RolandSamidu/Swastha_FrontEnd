import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
    Grid,
    IconButton,
    CircularProgress
} from '@material-ui/core'
import 'date-fns'
import ListIcon from '@material-ui/icons/List';
import {
    LoonsSnackbar,
    LoonsTable,
} from 'app/components/LoonsLabComponents'

import PharmacyOrderService from 'app/services/PharmacyOrderService'

const styleSheet = (theme) => ({})

class MyInstitute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            columns: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <IconButton onClick={this.openItemBatchDailog}>
                                    <ListIcon />
                                </IconButton>
                            )
                        }
                    }
                },
                {
                    name: 'warehouse_name',
                    label: 'Drug Store',
                    options: {

                    }
                },
                {
                    name: 'warehouse_main_or_personal',
                    label: 'Type',
                    options: {

                    }
                },
                {
                    name: 'total_quantity',
                    label: 'Stock Qty',
                    options: {

                    }
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            loading: false,

            item_id: null,
            warehouse_id: null,
            totalItems: 0,

            formData: {
                page: 0,
                limit: 20,
            },
        }
        this.openItemBatchDailog = this.openItemBatchDailog.bind(this)
    }

    async loadData() {
        //function for load initial data from backend or other resources
        this.setState({ loading: false })

        let params = {
            item_id: this.state.item_id,
            warehouse_id: this.state.warehouse_id,
            select_type: "MY_REQUEST",
            limit: 20,
            page: 0,
            other_wareouse_id: null
        }

        let res = await PharmacyOrderService.getSuggestedWareHouse(params)
        if (res.status === 200) {
            // console.log('Drug: ', res.data.view.data)
            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
            })
        }
        this.setState({ loading: true })
    }

    async onSubmit() {

    }

    openItemBatchDailog = () => {
        const { openShowDailog } = this.props;
        openShowDailog(); // Trigger the function passed from the parent component
    }

    componentDidMount() {
        const { item_id, warehouse_id } = this.props;
        this.setState({
            item_id: item_id ? item_id : null,
            warehouse_id: warehouse_id ? warehouse_id : null
        }, () => {
            this.loadData()
        })
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                   
                    {this.state.loading ?
                        <LoonsTable
                            //title={"All Aptitute Tests"}
                            id={'suggested'}
                            data={this.state.data}
                            columns={this.state.columns}
                            options={{
                                pagination: true,
                                serverSide: true,
                                count: this.state.data.length,
                                rowsPerPage: 20,
                                page: 0,
                                onTableChange: (action, tableState) => {
                                    console.log(action, tableState)
                                    switch (action) {
                                        case 'changePage':
                                            // this.setSuggestedPage(tableState.page)
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
                            <Grid className='justify-center text-center w-full pt-12'>
                                <CircularProgress size={30} />
                            </Grid>
                        )}
                </Grid>
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

export default withStyles(styleSheet)(MyInstitute)
