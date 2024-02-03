import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'

import {
    Grid,
    CircularProgress,
} from '@material-ui/core'

import 'date-fns'
import { dateParse, timeParse } from 'utils'

import {
    LoonsTable,
} from 'app/components/LoonsLabComponents'


import EstimationService from 'app/services/EstimationService'

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    rootCell: {
        padding: '0px !important'
    }
})

class EstimationHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            isEditable: false,
            warning_msg: false,

            history_data :{
                page : 0,
                limit: 10,
                'order[0]': ['createdAt', 'DESC'],
            },
    
            estimation_history:[],
            columns: [
               
                {
                    name: 'emp_name',
                    label: 'Name',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.estimation_history[dataIndex]?.Employee?.name
                            return data
                        },
                    },
                },
                {
                    name: 'estimation',
                    label: 'Estimation',
                    options: {
                        display: true
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.estimation_history[dataIndex]?.jan
                        //     return data
                        // },
                    },
                },
                {
                    name: 'stock_position',
                    label: 'Stock on Hand',
                    options: {
                        display: true
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.estimation_history[dataIndex]?.jan
                        //     return data
                        // },
                    },
                },
                {
                    name: 'date',
                    label: 'Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.estimation_history[dataIndex]?.createdAt
                            return dateParse(data)
                        },
                    },
                },
                {
                    name: 'time',
                    label: 'Time',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.estimation_history[dataIndex]?.createdAt
                            return timeParse(data)
                        },
                    },
                },
                {
                    name: 'jan',
                    label: 'Jan',
                    options: {
                        display: true
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.estimation_history[dataIndex]?.jan
                        //     return data
                        // },
                    },
                },
                {
                    name: 'feb',
                    label: 'Feb',
                    options: {
                        display: true
                    },
                },
                {
                    name: 'mar',
                    label: 'Mar',
                    options: {
                        display: true
                    },
                },
                {
                    name: 'apr',
                    label: 'Apr',
                    options: {
                        display: true
                    },
                },
                {
                    name: 'may',
                    label: 'May',
                    options: {
                        display: true
                    },
                },
                {
                    name: 'june',
                    label: 'June',
                    options: {
                        display: true
                    },
                },
                {
                    name: 'july',
                    label: 'July',
                    options: {
                        display: true
                    },
                },
                {
                    name: 'sep',
                    label: 'Sep',
                    options: {
                        display: true
                    },
                },
                {
                    name: 'oct',
                    label: 'Oct',
                    options: {
                        display: true
                    },
                },
                {
                    name: 'nov',
                    label: 'Nov',
                    options: {
                        display: true
                    },
                },
                {
                    name: 'dec',
                    label: 'Dec',
                    options: {
                        display: true
                    },
                },
             
            ],
            history_loading:false,
            openHistory : false,
            openItemHistory : false,
            selectedId: null,

            estimation_item_history : [],
            history_item_loading: false,
            

        }
    }

    async setHistoryPage(page) {
        let filterData = this.state.history_data
        filterData.page = page
        this.setState({ filterData }, () => { this.getHistoryDetails() })
    }

  


    componentDidMount() {
     console.log('cheking inc props', this.props.data)
     this.getHistoryDetails()
    }

    async getHistoryDetails() {
        let params = this.state.history_data
        params.hospital_estimation_item_id = this.props.data

        let res = await EstimationService.getEstimationHistory(params)

        if (res.status === 200){
            console.log('cheking res', res)
            this.setState({
                estimation_history : res.data.view.data,
                history_loading: true,
                totalHistoryItems: res.data.view.totalItems
            })
            
        }
    }




    render() {
        const { classes } = this.props
        const { data, openRows } = this.state;

        return (
            < Fragment >
                <Grid container>
                    <Grid items xs={12}>
                        {/* <MainContainer> */}
                            {/* {this.state.history_loading ? */}
                                <LoonsTable
                                    className="mt-5"
                                    id={'estimationStups'}
                                    data={this.state.estimation_history}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: false,
                                        count: this.state.totalHistoryItems,
                                        // count: 10,
                                        rowsPerPage: this.state.history_data.limit,
                                        page: this.state.history_data.page,
                                        print: false,
                                        // viewColumns: false,
                                        download: false,
                                        // onRowClick: this.onRowClick,
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    this.setHistoryPage(tableState.page)
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
              
                        {/* </MainContainer> */}
                    </Grid>

                </Grid>
       
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(EstimationHistory)