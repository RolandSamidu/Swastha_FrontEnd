import React, { Component } from 'react'
import { withStyles, styled } from '@material-ui/core/styles'
import {
    CardTitle,
    LoonsCard,
    SubTitle,
    MainContainer,
    Button,
    LoonsTable
} from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import { CircularProgress, Dialog, FormControl, Grid, Icon, IconButton, Tooltip } from '@material-ui/core'
import { dateParser } from 'globalize'
import moment from 'moment'
import PreProcumentService from 'app/services/PreProcumentService'
import { convertTocommaSeparated, dateParse } from 'utils'
import VisibilityIcon from '@material-ui/icons/Visibility';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import ViewItem from './ViewItem'


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
})
export class StatusUpdateAllView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            filterData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
            },
            columns: [
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center" >
                                    <Tooltip title="View" >
                                        <IconButton

                                            className="px-2"
                                            onClick={() => {

                                                this.setState({
                                                    dialogData: this.state.data[tableMeta.rowIndex],
                                                    viewDet: true
                                                })
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                        }
                    },
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex]
                                    .ItemSnap?.sr_no
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
                            }
                        },
                    },
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex]
                                    .ItemSnap?.short_description
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
                            }
                        },
                    },
                },
                // {
                //     name: 'indent_no', // field name in the row object
                //     label: 'Indent No', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         // width: 10,
                //     },
                // },
                {
                    name: 'order_list_no', // field name in the row object
                    label: 'Order List Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex]
                                    .OrderList?.order_no
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
                            }
                        },
                    },
                },
                {
                    name: 'schedule_date', // field name in the row object
                    label: 'Schedule Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                dateParse(this.state.data[tableMeta.rowIndex]
                                    .order_date_to)
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
                            }
                        },
                    },
                },
                {
                    name: 'order_quantity', // field name in the row object
                    label: 'Order Quantity', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                convertTocommaSeparated(this.state.data[tableMeta.rowIndex]
                                    .quantity)
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
                            }
                        },
                    },
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                    },
                },
            ],
        }
    }

    setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page

        this.setState({
            filterData: filterData
        }, () => {
            this.loadData()
        })

    }

    componentDidMount() {
        this.loadData()
    }

    async loadData() {

        this.setState({
            loading: true

        })

        let res = await PreProcumentService.getSingleOrderLists(this.state.filterData)
        console.log("res", res)

        if (res.status == 200) {
            this.setState({
                data: res.data.view.data,
                totalPages: res.data.view.totalPages,
                totalItems: res.data.view.totalItems,
                loading: false
            })
        }

    }

    render() {

        const { classes } = this.props
        return (
            <MainContainer>
                <LoonsCard>
                    <CardTitle title="Status Update" />

                    <ValidatorForm onSubmit={() => this.loadData()}>
                        <Grid container spacing={2} className="py-3 ">
                            <Grid item lg={3} md={3} sm={6} xs={12}>

                                <SubTitle title="Order List No" />
                                <TextValidator
                                    className=""
                                    placeholder="Order List No"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={this.state.filterData.order_no || ''}
                                    onChange={(e) => {

                                        let filterData = this.state.filterData
                                        filterData.order_no = (e.target.value == "" || e.target.value == null) ? "" : e.target.value

                                        this.setState({
                                            filterData
                                        })
                                    }}
                                />

                            </Grid>

                            <Grid item lg={3} md={3} sm={6} xs={12}>

                                <SubTitle title="Search by SR No" />
                                <TextValidator
                                    className=""
                                    placeholder="Type at least 5 characters to search"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={this.state.filterData.search || ''}
                                    onChange={(e) => {
                                        let filterData = this.state.filterData;

                                        // Ensure e.target and e.target.value are not null or undefined
                                        if (e.target && e.target.value !== undefined) {
                                            filterData.search = (e.target.value === "" || e.target.value === null) ? "" : e.target.value;

                                            this.setState({
                                                filterData
                                            }, () => {
                                                // Check if the input is more than 3 characters
                                                if (filterData.search > 5) {
                                                    this.loadData();
                                                }
                                            });
                                        }
                                    }}

                                />

                            </Grid>
                            {/* <Grid item lg={3} md={3} sm={6} xs={12}>

                                <SubTitle title="Indent No" />
                                <TextValidator
                                    className=""
                                    placeholder="Indent No"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={this.state.filterData.indent_no || ''}
                                    onChange={(e) => {

                                        let filterData = this.state.filterData
                                        filterData.indent_no = (e.target.value == "" || e.target.value == null) ? "" : e.target.value

                                        this.setState({
                                            filterData
                                        })
                                    }}
                                />

                            </Grid> */}

                            <Grid
                                item
                                lg={3} md={3} sm={6}
                                xs={12}
                                className=" w-full flex justify-start items-end"
                                style={{ paddingRight: 0 }}
                            >

                                <FormControl className='px-2 pt-2'>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<Icon>search</Icon>}
                                    >
                                        Search
                                    </Button>
                                </FormControl>
                            </Grid>

                        </Grid>
                    </ValidatorForm>

                    {/* Load All Order List : Pre Procument */}
                    {!this.state.loading && (
                        <LoonsTable
                            id={'allPurchaseOrder'}
                            data={this.state.data}
                            columns={this.state.columns}

                            options={{
                                pagination: true,
                                serverSide: true,
                                count: this.state.totalItems,
                                rowsPerPage: this.state.filterData.limit,
                                page: this.state.filterData.page,
                                onTableChange: (action, tableState) => {
                                    switch (action) {
                                        case 'changePage':
                                            this.setPage(
                                                tableState.page
                                            )
                                            break
                                        case 'sort':
                                            //this.sort(tableState.page, tableState.sortOrder);
                                            break
                                        default:
                                        // TODO: Acction not hanled
                                    }
                                },
                            }}
                        ></LoonsTable>
                    )}
                    {/* loader effect : loading table data  */}
                    {this.state.loading && (
                        <div
                            className="justify-center text-center w-full pt-12"
                            style={{ height: '50vh' }}
                        >
                            <CircularProgress size={30} />
                        </div>
                    )}
                </LoonsCard>

                <Dialog
                    fullWidth={true}
                    maxWidth="lg"
                    open={this.state.viewDet}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        <CardTitle title="Detail View" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ viewDet: false })
                                this.loadData()
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-4 pb-5">

                        <ViewItem data={this.state.dialogData} onClose={() => {
                            this.setState({ viewDet: false })
                            this.loadData()
                        }}

                        />

                    </div>
                </Dialog>
            </MainContainer>
        )
    }
}

export default withStyles(styleSheet)(StatusUpdateAllView)