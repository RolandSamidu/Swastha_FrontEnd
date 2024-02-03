import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormLabel,
    Grid,
    Icon,
    IconButton,
    DialogContentText,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {
    Button,
    CardTitle,
    LoonsCard,
    LoonsSnackbar,
    LoonsSwitch,
    LoonsTable,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import React, { Component } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../../appconst'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import { dateParse } from 'utils'

class MDS_RemarksSetUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formData: {
                type: null,
                remark: null,
            },
            activeTab: 0,
            alert: false,
            message: '',
            severity: 'success',
            data: [],
            columns: [
                {
                    name: 'id',
                    label: 'id',
                    options: {
                        display: false,
                    },
                },
                {
                    name: 'type',
                    label: 'Remark Type',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'noOfRemarks',
                    label: 'No Of Remarks',
                    options: {
                        display: false,
                    },
                },
                {
                    name: 'remark',
                    label: 'Remark',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'createdBy',
                    label: 'Created By',
                    options: {
                        customBodyRender: (val, meta) => {
                            return this.state.data[meta.rowIndex]?.Employee?.name
                                 
                        },
                    },
                },
                {
                    name: 'createdAt',
                    label: 'Date',
                    customBodyRender: (val, meta) => {
                        return this.state.data.length > meta.rowIndex
                            ? dateParse(
                                  this.state.data[meta.rowIndex].createdAt
                              )
                            : '-'
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log(
                                'data',
                                this.state.data[tableMeta.rowIndex]
                            )
                            return (
                                <>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <IconButton
                                            className="text-black mr-2"
                                            onClick={null}
                                        >
                                            <Icon>mode_edit_outline</Icon>
                                        </IconButton>
                                        <LoonsSwitch
                                            checked={
                                                this.state.data[
                                                    tableMeta.rowIndex
                                                ].status == 'Active'
                                                    ? true
                                                    : false
                                            }
                                            onChange={() => {
                                                this.toChangeStatus(
                                                    tableMeta.rowIndex
                                                )
                                            }}
                                            color="primary"
                                            name="checkedB"
                                            inputProps={{
                                                'aria-label':
                                                    'primary checkbox',
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
            ],
            tableDataLoaded: false,
            statusChangeRow: null,
            conformingDialog: false,

            filterData: {
                limit: 10,
                page: 0,
                type: '',
            },
            totalItems: 0,
            checked: false,
        }
    }

    async toChangeStatus(row) {
        this.setState({
            statusChangeRow: row,
            conformingDialog: true,
        })
    }

    async agreeToChangeStatus() {
        this.changeStatus(this.state.statusChangeRow)
        this.setState({ conformingDialog: false })
    }

    async changeStatus(row) {
        console.log('comming data', this.state.data[row])
        let data = this.state.data[row]
        let statusChange = {
            status: data.status == 'Deactive' ? 'Active' : 'Deactive',
        }
        let res = await PharmacyOrderService.updateRemarkStatus(
            data.id,
            statusChange
        )
        console.log('res', res)
        if (res.status == 200) {
            this.setState(
                {
                    alert: true,
                    severity: 'success',
                    message: 'Successfully changed the status',
                },
                () => {
                    this.preLoadData()
                }
            )
        } else {
            this.setState(
                {
                    alert: true,
                    severity: 'error',
                    message: 'Cannot change the status',
                },
                () => {
                    console.log('ERROR UpDate')
                }
            )
        }
    }

    async handleSubmit() {
        if (this.state.formData.remark == null) {
            this.setState({
                alert: true,
                message: 'Please enter a value to proceed',
                severity: 'error',
            })
            return
        }

        let res = await PharmacyOrderService.addRemark(this.state.formData)

        if (res.status && res.status == 201) {
            this.setState({
                alert: true,
                message: 'Remark Added Successfully',
                severity: 'success',
            })
            window.location.reload()
        } else {
            this.setState({
                alert: true,
                message: 'Adding Remark Unsuccessful',
                severity: 'error',
            })
        }
    }

    async preLoadData() {
        this.setState({ tableDataLoaded: false })
        let res = await PharmacyOrderService.getRemarks(this.state.filterData)
        if (res.status == 200) {
            this.setState(
                {
                    data: res.data.view.data,
                    tableDataLoaded: true,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    console.log(this.state.data)
                    this.render()
                }
            )
            return
        }
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                console.log('New formdata', this.state.filterData)
                this.preLoadData()
            }
        )
    }

    async loadFilterData() {
        this.setState({ tableDataLoaded: false })
        let res = await PharmacyOrderService.getRemarks(this.state.filterData)
        if (res.status == 200) {
            this.setState(
                {
                    data: res.data.view.data,
                    tableDataLoaded: true,
                },
                () => this.render()
            )
            return
        }
    }

    async componentDidMount() {
        await this.preLoadData()
    }

    render() {
        return (
            <>
                <MainContainer>
                    <LoonsCard>
                        <Grid container spacing={2}>
                            <Grid item lg={12}>
                                <CardTitle title="Add Remarks"></CardTitle>
                            </Grid>
                        </Grid>
                        <ValidatorForm
                            onSubmit={() => this.handleSubmit()}
                            onError={(e) => console.log(e)}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <SubTitle title={'Remark type'}></SubTitle>
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={appConst.remark_types}
                                        /*  defaultValue={dummy.find(
                                             (v) => v.value == ''
                                         )} */
                                        getOptionLabel={(option) => option.name}
                                        getOptionSelected={(option, value) =>
                                            console.log(value)
                                        }
                                        onChange={(event, value) => {
                                            console.log('value', value)
                                            let formData = this.state.formData
                                            formData.type = value.name
                                            this.setState({ formData })
                                        }}
                                        // value={{
                                        //     label: this.state.patientObj.mode,
                                        // }}

                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Enter Remark type"
                                                //variant="outlined"
                                                value={this.state.formData.type}
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                size="small"
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item lg={10} xs={12}>
                                    <SubTitle title={'Remark'}></SubTitle>
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Enter Remarks"
                                        name="remark"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={this.state.formData.remark}
                                        type="text"
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            this.setState({
                                                formData: {
                                                    ...this.state.formData,
                                                    remark: e.target.value,
                                                },
                                            })
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} className="mt-3">
                                <Grid
                                    item
                                    lg={10}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <Button type="submit">Add</Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                        <Grid container spacing={2} className="my-3">
                            <Grid item lg={12} xs={12}>
                                <Divider></Divider>
                            </Grid>
                            <Grid item lg={2} xs={12}>
                                <h4>Filters</h4>
                            </Grid>
                        </Grid>
                        <ValidatorForm
                            onSubmit={() => this.loadFilterData()}
                            onError={() => null}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <FormLabel>Remark Type :</FormLabel>
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={appConst.remark_types}
                                        /*  defaultValue={dummy.find(
                                             (v) => v.value == ''
                                         )} */
                                        getOptionLabel={(option) => option.name}
                                        getOptionSelected={(option, value) =>
                                            console.log(value)
                                        }
                                        onChange={(event, value) => {
                                            let filterData =
                                                this.state.filterData
                                            filterData.type = value.name
                                            this.setState({ filterData })
                                        }}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Enter Remark type"
                                                //variant="outlined"
                                                value={
                                                    this.state.filterData.type
                                                }
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                size="small"
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={3}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    <Button type="submit">Filter</Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                        <Grid container className="mt-3">
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                {this.state.tableDataLoaded ? (
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage:
                                                this.state.filterData.limit,
                                            page: this.state.filterData.page,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(action, tableState)
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
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                ) : (
                                    //load loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </LoonsCard>
                </MainContainer>
                <Dialog
                    open={this.state.conformingDialog}
                    onClose={() => {
                        this.setState({ conformingDialog: false })
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {'Conformation'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you Sure to change status of this User?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="text"
                            onClick={() => {
                                this.setState({ conformingDialog: false })
                            }}
                            color="primary"
                        >
                            Disagree
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => {
                                this.agreeToChangeStatus()
                            }}
                            color="primary"
                            autoFocus
                        >
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
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
            </>
        )
    }
}

export default MDS_RemarksSetUp
