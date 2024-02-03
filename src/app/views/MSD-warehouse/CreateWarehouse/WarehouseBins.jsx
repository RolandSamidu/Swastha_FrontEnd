import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
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
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
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
import WarehouseServices from 'app/services/WarehouseServices'
import { width } from '@mui/system'

const styleSheet = (theme) => ({})

class WarehouseBins extends Component {
    constructor(props) {
        super(props)
        this.state = {
             //snackbar
             alert: false,
             message: '',
             severity: 'success',

            activeStep: 1,
            isUpdate: false,
            data: [],
            catId: null,
            isLoaded: false,
            columns: [
                {
                    name: 'bin_id',
                    label: 'Bin ID',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].bin_id
                            if (data == null || data === " ") {
                                return "N/A"
                            } else {
                                return <p>{data}</p>
                            }

                        },
                    },
                },
                {
                    name: 'temperature_range',
                    label: 'Temperature Range',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].temparature_range
                            if (data == null || data === " ") {
                                return "N/A"
                            } else {
                                return <p>{data}</p>
                            }

                        },
                    },
                },
                {
                    name: 'width',
                    label: 'Width',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].width
                            if (data == null || data === " ") {
                                return "N/A"
                            } else {
                                return <p>{data}</p>
                            }

                        },
                    },
                },
                {
                    name: 'height',
                    label: 'Height',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].height
                            if (data == null || data === " ") {
                                return "N/A"
                            } else {
                                return <p>{data}</p>
                            }

                        },
                    },
                },
                {
                    name: 'length',
                    label: 'Length',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].length
                            if (data == null || data === " ") {
                                return "N/A"
                            } else {
                                return <p>{data}</p>
                            }

                        },
                    },
                },
                {
                    name: 'volume',
                    label: 'Volume',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].volume
                            if (data == null || data === " ") {
                                return "N/A"
                            } else {
                                // return<p>{data}</p>
                                return <p>{Math.round(data * 100) / 100}</p>
                            }

                        },
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="Edit">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                console.log(this.state.data[tableMeta.rowIndex])
                                                this.handleUpdate(this.state.data[tableMeta.rowIndex]);
                                            }}
                                            size="small"
                                            aria-label="view"
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                        },
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            loading: false,
            allBinTypes: [],
            temp_from: null,
            temp_to: null,
            width: null,
            height: null,
            length: null,
            volume: null,
            bin_id: null,
            formData: {
                warehouse_id: this.props.id,
                bin_id: null,
                bin_type_id: null,
                temparature_range: null,
                width: null,
                height: null,
                length: null,
                volume: null,
                bin_details: []

            },
            formData2: {
                warehouse_id: this.props.id,
                bin_details: []
            },
            filterData: {
                'order[0]': ['updatedAt', 'DESC'],
                limit: 20,
                page: 0,
                warehouse_id: this.props.id

            },
            totalItems: 0,
            totalPages: 0,
            tableDataLoaded: false,
        }
    }

    handleUpdate = (rowData) => {
        if (rowData.temparature_range == null) {
            this.setState({

                formData: {
                    bin_id: rowData.bin_id,
                    bin_type_id: rowData.bin_type_id,
                    temp_from: null,
                    temp_to: null,
                    // temparature_range: rowData.temparature_range,
                    width: rowData.width,
                    height: rowData.height,
                    length: rowData.length,
                    volume: rowData.volume,

                },

                id: rowData.id,
            },
                () => {
                    console.log('Form Data===========>', this.state.formData)

                })

            this.setState({
                isUpdate: true,
            }, () => { this.render() })
        } else {
            let temparature_ranges = rowData.temparature_range.split("-")
            console.log(temparature_ranges);
            this.setState({

                formData: {
                    bin_id: rowData.bin_id,
                    bin_type_id: rowData.bin_type_id,
                    temp_from: parseInt(temparature_ranges[0]),
                    temp_to: parseInt(temparature_ranges[1]),
                    temparature_range: rowData.temparature_range,
                    width: rowData.width,
                    height: rowData.height,
                    length: rowData.length,
                    volume: rowData.volume,

                },

                id: rowData.id,
            },
                () => {
                    console.log('Form Data===========>', this.state.formData)

                })

            this.setState({
                isUpdate: true,
            }, () => { this.render() })

        }
    }

    clearField = () => {
        this.setState({
            formData: {
                bin_id: "",
                bin_type_id: "",
                temp_from: '',
                temp_to: "",
                width: "",
                height: "",
                length: "",
                volume: "",
            },
            isUpdate: false,
        })
    }
    async loadBinTypes() {
        let params = { limit: 99999, page: 0 }
        const res = await WarehouseServices.getAllBinTypes(params)

        let loadBinTypes = this.state.allBinTypes
        if (res.status == 200) {
            console.log("bin", res)
            var loadedData = res.data.view.data
            loadedData.forEach(element => {
                let loadType = {}
                loadType.name = element.name
                loadType.id2 = element.id
                loadType.id = element.bin_type_id
                loadType.status = element.status
                loadBinTypes.push(loadType)
            });
        }
        else {
            this.setState({
                alert: true,
                severity: 'error',
                message: res.data.error,
            })
        };
        this.setState({
            allBinTypes: loadBinTypes
        })
        console.log("Bin Types", this.state.allBinTypes)
    }


    // handleDataSubmit = async () => {
    //     let formData= this.state.formData

    //     // const batchTraceDTO = {
    //     //     name,
    //     //     description,
    //     // }

    //     // let id = this.state.id
    //     let res
    //     if (this.state.isUpdate) {
    //         res = await WarehouseServices.updateGroupType(this.state.id, formData)

    //         if (200 == res.status) {
    //             this.setState({
    //                 alert: true,
    //                 message: 'Group Type Successfully Updated',
    //                 severity: 'success',

    //             })
    //             this.fetchDataSet()
    //         } else {
    //             this.setState({
    //                 alert: true,
    //                 message: 'Group Type Updated Unsuccessful',
    //                 severity: 'error',
    //             })
    //         }

    //     } else {
    //         //save function
    //         res = await WarehouseServices.createNewGroupType(formData)


    //         console.log('Res===========>', res)

    //         // if (201 == res.status) {
    //         //     this.setState({
    //         //         alert: true,
    //         //         message: 'Group Type Successfully Stored',
    //         //         severity: 'success',
    //         //     })
    //         //     this.fetchDataSet()
    //         // } else {
    //         //     this.setState({
    //         //         alert: true,
    //         //         message: 'Group Type Registration Unsuccessful',
    //         //         severity: 'error',
    //         //     })
    //         // }
    //     }
    //     this.clearField()
    //     this.fetchDataSet()
    // }

    componentDidMount() {
        this.fetchDataSet()
        this.loadBinTypes()

        console.log("id", this.props.id)
        let itemId = this.props.id;

        let pharmacydrugstore = this.props.pharmacydrugstore
        console.log("Pharmacy Drug store", pharmacydrugstore)

    }

    handleDataSubmit = async () => {
        let formData2 = this.state.formData2
        // formData2.temparature_range = this.state.temp_to + "-" + this.state.temp_to
        console.log("form data", formData2)
        let bin_details = []
        formData2.warehouse_id = this.props.id
        bin_details.push({
            'bin_id': this.state.formData.bin_id,
            'bin_type_id': this.state.formData.bin_type_id,
            "temparature_range": this.state.formData.temparature_range,
            "width": this.state.formData.width,
            "height": this.state.formData.height,
            "length": this.state.formData.length,
            "volume": this.state.formData.volume

        })

        formData2.bin_details = bin_details


        // let id = this.state.id
        let res
        if (this.state.isUpdate) {

            formData2.bin_details[0].id = this.state.id
            res = await WarehouseServices.createBinType(formData2)
            console.log('Res===========>', res)

            if (201 == res.status) {
                this.setState({
                    alert: true,
                    message: 'Bin Created Successfully',
                    severity: 'success',
                })
                this.fetchDataSet()
            } else {
                this.setState({
                    alert: true,
                    message: 'Bin Creation Unsuccessful',
                    severity: 'error',
                })
            }

            /* res = await WarehouseServices.updateWarehouseBins(this.state.id, formData2)

            if (200 == res.status) {
                this.setState({
                    alert: true,
                    message: 'Bin Successfully Updated',
                    severity: 'success',

                })
                this.fetchDataSet()
            } else {
                this.setState({
                    alert: true,
                    message: 'Bin Updated Unsuccessful',
                    severity: 'error',
                })
            } */

        } else {
            //save function
            res = await WarehouseServices.createBinType(formData2)
            console.log('Res===========>', res)

            if (201 == res.status) {
                this.setState({
                    alert: true,
                    message: 'Bin Created Successfully',
                    severity: 'success',
                })
                this.fetchDataSet()
            } else {
                this.setState({
                    alert: true,
                    message: 'Bin Creation Unsuccessful',
                    severity: 'error',
                })
            }
        }
        this.clearField()
        this.fetchDataSet()
    }

    async fetchDataSet() {
        //Reset load
        this.setState({
            tableDataLoaded: false,
        })

        let filterData = this.state.filterData

        const res = await WarehouseServices.getAllWarehouseBins(filterData)
        console.log("form", res)

        if (200 == res.status) {
            filterData.page = res.data.view.currentPage
            this.setState(
                {
                    filterData,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                    tableDataLoaded: true,
                },
                () => {
                    console.log('data', this.state)
                    this.render()
                }
            )
        }

    }

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.fetchDataSet()
            }
        )
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>

                    <CardTitle title="Warehouse Bin" />

                    <ValidatorForm
                        className="pt-2"
                        onSubmit={() => this.handleDataSubmit()}
                        onError={() => null}
                    >
                        {/* Main Grid */}
                        <Grid
                            container
                            spacing={2}
                            direction="row"
                            className="mt-3"
                        >
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Grid container spacing={2}>
                                    {/* heading */}
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <SubTitle
                                            title={
                                                this.state.isUpdate
                                                    ? 'Update Warehouse Bins'
                                                    : 'Create Warehouse Bins'
                                            }
                                        />
                                        <Divider className="mt-2" />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {/* TODO - Check what is this. This is not submitted to backend */}
                                                <SubTitle title="Bin Type" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.allBinTypes.filter((ele) => ele.status == "Active")}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData;
                                                            formData.bin_type_id = value.id2
                                                            // formData.sr_no = this.state.group_code + value.code + this.state.item_post_fix
                                                            console.log("formdata", formData)
                                                            this.setState({ formData })

                                                        }
                                                    }}
                                                    value={this.state.allBinTypes.find((obj) => obj.id2 == this.state.formData.bin_type_id
                                                    )}
                                                    getOptionLabel={(option) => (option.name + " - " + option.id)}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Bin Type"
                                                            //variant="outlined"
                                                            /*  value={
                                                                 this.state.allBinTypes.find((obj) => obj.id2 == this.state.formData.bin_type_id
                                                             )} */
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        // validators={[
                                                        //     'required',
                                                        // ]}
                                                        // errorMessages={[
                                                        //     'this field is required',
                                                        // ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            {/* name */}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Bin ID" />

                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Bin ID"
                                                    name="bin_id"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .bin_id
                                                    }
                                                    disabled={
                                                        this.state.isUpdate
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            formData: {
                                                                ...this
                                                                    .state
                                                                    .formData,
                                                                bin_id: e.target
                                                                    .value,
                                                            },
                                                        })
                                                    }}
                                                    validators={[
                                                        'required',
                                                    ]}
                                                   errorMessages={[
                                                        'This field is required',
                                                    ]}
                                                />
                                            </Grid>

                                            {/* short ref */}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Temperature Range" />

                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Temp from"
                                                    name="temparature_range"
                                                    // disabled={
                                                    //     this.state.isUpdate
                                                    // }
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData.temp_from
                                                    }
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {

                                                        let formData = this.state.formData;
                                                        formData.temp_from = e.target.value;
                                                        formData.temparature_range = formData.temp_from + ' - ' + formData.temp_to;

                                                        this.setState({ formData })
                                                        console.log("formdata", formData)
                                                    }}
                                                    validators={[
                                                        'required',
                                                    ]}
                                                   errorMessages={[
                                                        'This field is required',
                                                    ]}
                                                />
                                            </Grid>

                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >

                                                <TextValidator
                                                    className=" w-full mt-5"
                                                    placeholder="Temp to"
                                                    name="temp_to"
                                                    // disabled={
                                                    //     this.state.isUpdate
                                                    // }
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData.temp_to
                                                    }
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        let formData = this.state.formData;
                                                        formData.temp_to = e.target.value;
                                                        formData.temparature_range = formData.temp_from + ' - ' + formData.temp_to;

                                                        this.setState({ formData })
                                                        console.log("temp from", this.state.temp_from)
                                                        console.log("temp to", this.state.temp_to)
                                                        console.log("temp range", this.state.formData.temparature_range)

                                                        console.log("formdata", formData)
                                                    }}
                                                    validators={[
                                                        'required',
                                                    ]}
                                                   errorMessages={[
                                                        'This field is required',
                                                    ]}
                                                />
                                            </Grid>
                                            {/* from */}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Width (m)" />

                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Width"
                                                    name="width"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    // disabled={
                                                    //     this.state.isUpdate
                                                    // }
                                                    InputProps={{
                                                        inputProps: { min: 0 }
                                                      }}
                                                    value={
                                                        this.state.formData
                                                            .width
                                                    }
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        let formData = this.state.formData;
                                                        formData.volume = this.state.height * this.state.height * e.target.value

                                                        this.setState({
                                                            width:
                                                                e.target
                                                                    .value,

                                                            formData: {
                                                                ...this
                                                                    .state
                                                                    .formData,
                                                                width: e.target
                                                                    .value,
                                                            }
                                                        })
                                                        console.log("formdata", formData)
                                                    }}
                                                    validators={[
                                                        'required',
                                                    ]}
                                                   errorMessages={[
                                                        'This field is required',
                                                    ]}
                                                />
                                            </Grid>

                                            {/* to */}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Height (m)" />

                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="height"
                                                    name="height"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .height
                                                    }
                                                    InputProps={{
                                                        inputProps: { min: 0 }
                                                      }}
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        let formData = this.state.formData;
                                                        formData.volume = this.state.width * this.state.length * e.target.value

                                                        this.setState({
                                                            height:
                                                                e.target
                                                                    .value,

                                                            formData: {
                                                                ...this
                                                                    .state
                                                                    .formData,
                                                                height: e.target
                                                                    .value,
                                                            },
                                                        })

                                                        console.log("formdata", formData)
                                                    }}
                                                    validators={[
                                                        'required',
                                                    ]}
                                                   errorMessages={[
                                                        'This field is required',
                                                    ]}
                                                />
                                            </Grid>

                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Length (m)" />

                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Length"
                                                    name="length"
                                                    InputProps={{
                                                        inputProps: { min: 0 }
                                                      }}
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .length
                                                    }
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        let formData = this.state.formData;
                                                        formData.volume = this.state.width * this.state.height * e.target.value

                                                        this.setState({
                                                            length:
                                                                e.target
                                                                    .value,

                                                            formData: {
                                                                ...this
                                                                    .state
                                                                    .formData,
                                                                length: e.target
                                                                    .value,
                                                            },
                                                        })
                                                        console.log(this.state.height, this.state.length, this.state.width)
                                                        console.log(this.state.formData.height, this.state.formData.length, this.state.width)
                                                        console.log("formdata", formData)
                                                    }}
                                                    validators={[
                                                        'required',
                                                    ]}
                                                   errorMessages={[
                                                        'This field is required',
                                                    ]}
                                                />
                                            </Grid>
                                            {/* <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="To" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="to"
                                                        name="to"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .to
                                                        }
                                                        type="number"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    to: e.target
                                                                        .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required',
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}
                                                    />
                                                </Grid> */}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Volume (CBM)" />

                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="volume"
                                                    name="volume"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    disabled
                                                    value={
                                                        // this.state.width*this.state.height*this.state.length
                                                        this.state.formData.volume
                                                    }
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {

                                                        this.setState({
                                                            formData: {
                                                                ...this
                                                                    .state
                                                                    .formData,
                                                                volume: e.target
                                                                    .value,
                                                            },
                                                        })
                                                        console.log("formdata", this.state.formData)
                                                    }}
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'This field is required',
                                                    ]}
                                                />
                                            </Grid>


                                        </Grid>

                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                    className=" w-full flex justify-end"
                                                >
                                                    {/* Submit Button */}
                                                    <Button
                                                        className="mt-2 mr-2"
                                                        progress={false}
                                                        type="submit"
                                                        scrollToTop={true}
                                                        startIcon="save"
                                                        onClick={() => {
                                                            console.log("Formdata", this.state.formData)
                                                        }}
                                                    >
                                                        <span className="capitalize">
                                                            {this.state
                                                                .isUpdate
                                                                ? 'Update'
                                                                : 'Submit'}
                                                        </span>
                                                    </Button>
                                                    {/* Cancel Button */}
                                                    <Button
                                                        className="mt-2"
                                                        progress={false}
                                                        scrollToTop={true}
                                                        color="#cfd8dc"
                                                        onClick={
                                                            this.clearField
                                                        }
                                                    >
                                                        <span className="capitalize">
                                                            Cancel
                                                        </span>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Table Section */}
                            <Grid container className="mt-3">
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    {this.state.tableDataLoaded ? (
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                print: true,
                                                viewColumns: true,
                                                download: true,
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: 20,
                                                page: this.state.filterData
                                                    .page,
                                                onTableChange: (
                                                    action,
                                                    tableState
                                                ) => {
                                                    console.log(
                                                        action,
                                                        tableState
                                                    )
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
                        </Grid>
                    </ValidatorForm>

                </MainContainer>

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

export default withStyles(styleSheet)(WarehouseBins)
