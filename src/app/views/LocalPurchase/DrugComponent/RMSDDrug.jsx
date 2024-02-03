import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
    Grid,
    IconButton,
    CircularProgress
} from '@material-ui/core'
import ListIcon from '@material-ui/icons/List';

import {
    LoonsSnackbar,
    LoonsTable,
} from 'app/components/LoonsLabComponents'

import PharmacyOrderService from 'app/services/PharmacyOrderService'

const styleSheet = (theme) => ({})


class RMSDDrug extends Component {
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
                // {     name: 'uom',     label: 'UOM',     options: {} },
                {
                    name: 'warehouse_name',
                    label: 'Drug Store',
                    options: {
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.rows2[dataIndex].warehouse_name
                        //     return data
                        // }
                    }
                },
                {
                    name: 'warehouse_main_or_personal',
                    label: 'Type',
                    options: {
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.rows2[dataIndex].warehouse_main_or_personal
                        //     return data
                        // }
                    }
                },
                {
                    name: 'total_quantity',
                    label: 'Stock Qty',
                    options: {
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.rows2[dataIndex].total_quantity
                        //     return data
                        // }
                    }
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            loading: false,

            item_id: null,
            warehouse_id: null,

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
            select_type: "OTHER_INSTITUTE",
            limit: 20,
            page: 0,
            other_wareouse_id: null
        }

        let res = await PharmacyOrderService.getSuggestedWareHouse(params)
        if (res.status === 200) {
            // console.log('Drug :', res.data.view.data)
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

        {/* TO BE IMPLEMENTED:-> this.getWarehouseInfomation() */ }
        return (
            <Fragment>
                <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                    {/* <ValidatorForm
                        className="pt-2"
                        onSubmit={() => this.suggestedWareHouse()}
                        onError={() => null}
                    >
                        <Grid container spacing={2}>
                            <Grid
                                className=" w-full"
                                item
                                lg={4}
                                md={4}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Select Warehouse" />
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={this.state.filteredOptions.sort((a, b) => a.name?.localeCompare(b.name))}
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            let suggestedWareHouses = this.state.suggestedWareHouses;
                                            suggestedWareHouses.other_warehouse_id = value.id;

                                            this.setState({
                                                suggestedWareHouses,
                                            });
                                        } else {
                                            let suggestedWareHouses = this.state.suggestedWareHouses;
                                            suggestedWareHouses.other_warehouse_id = null;

                                            this.setState({
                                                suggestedWareHouses,
                                            });
                                        }
                                    }}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Select Warehouse"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            onInput={(e) => {
                                                const inputValue = e.target.value;
                                                let filteredOptions = [];

                                                if (inputValue.length >= 3) {
                                                    filteredOptions = this.state.allWH.filter((option) =>
                                                        option.name.toLowerCase().includes(inputValue.toLowerCase())
                                                    );
                                                }

                                                this.setState({ filteredOptions });
                                            }}
                                        />
                                    )}
                                />
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
                                    className="mt-6 mr-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={false}
                                    startIcon="save"
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">
                                        Search
                                    </span>
                                </Button>
                            </Grid>
                        </Grid>
                    </ValidatorForm> */}
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

export default withStyles(styleSheet)(RMSDDrug)
