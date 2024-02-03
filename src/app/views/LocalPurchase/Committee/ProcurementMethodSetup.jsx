import React, { Component, Fragment } from "react";
import { CardTitle, LoonsCard, SubTitle, LoonsSwitch } from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import { LoonsTable, Button } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { CircularProgress, Grid, IconButton, Tooltip } from "@material-ui/core";
import * as appConst from '../../../../appconst'
import { Autocomplete } from "@material-ui/lab";
import EditIcon from '@material-ui/icons/Edit';

class ProcurementMethodSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            filterData: {
                limit: 20,
                page: 0,
                status: '',
                'order[0]': ['updatedAt', 'DESC'],
            },
            columns: [
                {
                    name: 'procurement_method', // field name in the row object
                    label: 'Procurement Method', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"

                                            name="procurement_method"

                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].procurement_method}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].procurement_method = e.target.value;
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
                    name: 'note', // field name in the row object
                    label: 'Note', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"

                                            name="note"

                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data[dataIndex].note}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data;
                                                data[dataIndex].note = e.target.value;
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
                    name: 'uploads', // field name in the row object
                    label: 'Uploads', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
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
            data: [
                { procurement_method: 'ICB', note: '', uploads: '' },
                { procurement_method: 'NCB', note: '', uploads: '' }
            ]
        }
    }

    addNewRow() {
        this.setState({ loading: false })
        let data = this.state.data;
        data.push({ procurement_method: 'ICB', note: '', uploads: '' })
        this.setState({ data, loading: true })
    }

    render() {
        return (
            <LoonsCard>
                <CardTitle title="Procurement Method Set up" />
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
                                onClick={() => this.addNewRow()}
                                scrollToTop={false}
                                startIcon="add"
                            >
                                <span className="capitalize">Add New</span>
                            </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </LoonsCard>
        )
    }
}

export default ProcurementMethodSetup;