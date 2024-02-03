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
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    InputAdornment,
    IconButton,
    Typography,
    Icon,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import SearchIcon from '@mui/icons-material/Search';
import InventoryService from 'app/services/InventoryService'
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    SwasthaFilePicker,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import { dateParse } from 'utils'
import Stack from '@mui/material/Stack';

const styleSheet = (theme) => ({})

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", solo = false, text = "Add", tail = null }) => (
    <Autocomplete
        options={options}
        getOptionLabel={getOptionLabel}
        id="disable-clearable"
        freeSolo={solo}
        onChange={onChange}
        value={val}
        size='small'
        renderInput={(params) => (
            < div ref={params.InputProps.ref} style={{ display: 'flex' }}>
                <input type="text" {...params.inputProps}
                    style={{ marginTop: '5.5px', padding: '6.5px 10px', border: '1px solid #e5e7eb', borderRadius: 4 }}
                    placeholder={`⊕ ${text}`}
                    onChange={onChange}
                    value={val}
                    required
                />
                {tail ? <div style={{ display: 'flex', alignItems: 'center', background: 'white', margin: '1% 1% 1% 0', marginLeft: 0, border: '1px solid #e5e7eb', borderRadius: '0 5px 5px 0', padding: '1px' }}>{tail}</div> : null}
            </div >
        )}
    />)

const renderSubsequentDetailCard = (label, value) => {
    return (
        <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={6} xs={6}>
                <SubTitle title={label} />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
                <Typography variant='body1' style={{ marginTop: '3px', textJustify: "justify" }}>{value}</Typography>
            </Grid>
        </Grid>

    )
}

class DrugAvailability extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            itemList: [],
            data: [],
            columns: [
                {
                    name: 'seriesNumber', // field name in the row object
                    label: 'Series Number', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'groupName',
                    label: 'Group Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'category',
                    label: 'Category Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'shortReference',
                    label: 'Short Reference',
                    options: {
                        // filter: true,
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
                                <>
                                    <IconButton
                                        className="text-black mr-2"
                                        onClick={null}
                                    >
                                        <Icon>mode_edit_outline</Icon>
                                    </IconButton>
                                    <IconButton
                                        className="text-black"
                                        onClick={null}
                                    >
                                        <Icon>delete_sweep</Icon>
                                    </IconButton>
                                </>
                            )
                        },
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            patient_pic: null,
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],

            loading: false,
            formData: {
                request_id: 458,
                institute: null,
                ward_id: null,
                bht: null,
                patient_name: null,
                phn: null,
                item_name: null,
                item_id: null,
                sr_no: null,
                request_quantity: null,
                required_date: null,
                description: null,
                selected: 'yes'
            },

            ward: [
                { id: 1, label: "W101" },
                { id: 2, label: "W102" },
                { id: 3, label: "W103" },
                { id: 4, label: "W104" },
                { id: 5, label: "W105" },
            ],

            bht: [
                { id: 1, label: "B101" },
                { id: 2, label: "B102" },
                { id: 3, label: "B103" },
                { id: 4, label: "B104" },
                { id: 5, label: "B105" },
            ]
        }
    }

    async loadData() {
        //function for load initial data from backend or other resources

        let district_res = await DivisionsServices.getAllDistrict({
            limit: 99999,
        })
        if (district_res.status == 200) {
            console.log('district', district_res.data.view.data)
            this.setState({
                all_district: district_res.data.view.data,
            })
        }

        let moh_res = await DivisionsServices.getAllMOH({ limit: 99999 })
        if (moh_res.status == 200) {
            console.log('moh', moh_res.data.view.data)
            this.setState({
                all_moh: moh_res.data.view.data,
            })
        }

        let phm_res = await DivisionsServices.getAllPHM({ limit: 99999 })
        if (phm_res.status == 200) {
            console.log('phm', phm_res.data.view.data)
            this.setState({
                all_phm: phm_res.data.view.data,
            })
        }

        let gn_res = await DivisionsServices.getAllGN({ limit: 99999 })
        if (gn_res.status == 200) {
            console.log('gn', gn_res.data.view.data)
            this.setState({
                all_gn: gn_res.data.view.data,
            })
        }
    }

    async saveStepOneSubmit() { }

    async SubmitAll() {
        let formData = this.state.formData
        formData.age =
            formData.age_all.years +
            '-' +
            formData.age_all.months +
            '-' +
            formData.age_all.days

        let res = await PatientServices.createNewPatient(formData)
        if (res.status == 201) {
            this.setState({
                alert: true,
                message: 'Patient Registration Successful',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Patient Registration Unsuccessful',
                severity: 'error',
            })
        }
    }

    loadItemData = async () => {
        let formData = this.state.formData
        if (formData.item_name && formData.item_name.length > 3) {
            let res = await InventoryService.fetchAllItems({ search: formData.item_name, is_prescrible: "true", limit: 10, page: 0, 'order[0]': ['createdAt', 'DESC'] })
            if (res.status === 200) {
                this.setState({ itemList: res.data.view.data });
            }
        } else if (formData.sr_no && formData.sr_no.length > 3) {
            let res = await InventoryService.fetchAllItems({ search: formData.sr_no, is_prescrible: "true", limit: 10, page: 0, 'order[0]': ['createdAt', 'DESC'] })
            if (res.status === 200) {
                this.setState({ itemList: res.data.view.data });
            }
        }
    }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }

    componentDidMount() {
        this.loadData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.formData.item_name !== this.state.formData.item_name || prevState.formData.sr_no !== this.state.formData.sr_no) {
            this.loadItemData();
        }
        // else if (prevState.formData.phn !== this.state.formData.phn) {
        //     this.loadPatientData();
        // }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="Drug Availability" />
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.SubmitAll()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container spacing={2} direction="row">
                                {/* Filter Section */}
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    {/* Item Series Definition */}
                                    <Grid container spacing={2}>
                                        {/* Item Series heading */}
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <Grid container spacing={2}>
                                                {/* Serial Number*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="SR No" />
                                                    <AddInput
                                                        options={this.state.itemList}
                                                        val={this.state.formData.sr_no}
                                                        getOptionLabel={(option) => option.sr_no || ""}
                                                        text='Sr No'
                                                        onChange={(e, value) => {
                                                            const newFormData = {
                                                                ...this.state.formData,
                                                                sr_no: e.target.textContent ? e.target.textContent : e.target.value,
                                                                item_name: value ? value.medium_description : null,
                                                                item_id: value ? value.id : null,
                                                            };

                                                            this.setState({ formData: newFormData });
                                                            // formData.item_id = value ? value.id : null;
                                                            // if (e.target.value === '') {
                                                            //     console.log("Value: ", e.target.value)
                                                            //     // if (formData.item_id) {
                                                            //     //     formData.item_name = value ? value.medium_description : null;
                                                            //     // }
                                                            // }
                                                        }
                                                        }
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
                                                    <SubTitle title="Item Name" />
                                                    <AddInput
                                                        options={this.state.itemList}
                                                        val={this.state.formData.item_name}
                                                        getOptionLabel={(option) => option.medium_description || ""}
                                                        text='Item Name'
                                                        onChange={(e, value) => {
                                                            const newFormData = {
                                                                ...this.state.formData,
                                                                item_name: e.target.textContent ? e.target.textContent : e.target.value,
                                                                sr_no: value ? value.sr_no : null,
                                                                item_id: value ? value.id : null,
                                                            };

                                                            this.setState({ formData: newFormData });
                                                            // formData.item_id = value ? value.id : null;
                                                            // if (e.target.value === '') {
                                                            //     console.log("Value: ", e.target.value)
                                                            //     // if (formData.item_id) {
                                                            //     //     formData.item_name = value ? value.medium_description : null;
                                                            //     // }
                                                            // }
                                                        }
                                                        }
                                                    />
                                                </Grid>
                                                {/* Name*/}
                                                {/* Short Reference*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={5}
                                                    md={5}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Required Quantity" />
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Required Quantity"
                                                        name="quantity"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            String(this.state.formData
                                                                .request_quantity)
                                                        }
                                                        type="number"
                                                        min={0}
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    request_quantity:
                                                                        parseInt(e.target
                                                                            .value, 10),
                                                                },
                                                            })
                                                        }}
                                                        validators={
                                                            ['minNumber:' + 0, 'required:' + true]}
                                                        errorMessages={[
                                                            'Budget Should be > 0',
                                                            'this field is required'
                                                        ]}
                                                    />
                                                </Grid>
                                                <Grid className=" w-full"
                                                    item
                                                    lg={5}
                                                    md={5}
                                                    sm={12}
                                                    xs={12}>
                                                    <SubTitle title="Required Date" />
                                                    <DatePicker
                                                        style={{ border: '1px solid #e5e7eb', borderRadius: 5 }}
                                                        key={this.state.key}
                                                        className="w-full"
                                                        onChange={(date) => {
                                                            let formData = this.state.formData
                                                            formData.required_date = dateParse(date)
                                                            this.setState({ formData })
                                                        }}
                                                        // format="yyyy"
                                                        // openTo='year'
                                                        // views={["year"]}
                                                        value={this.state.formData.required_date}
                                                        placeholder="Required Date"
                                                    />
                                                </Grid>
                                                {/* Submit and Cancel Button */}
                                                <Grid
                                                    item
                                                    lg={2}
                                                    md={2}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <Grid container spacing={2} style={{ marginTop: "10px" }}>
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
                                                                className="mt-2"
                                                                progress={false}
                                                                type="submit"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                startIcon="save"
                                                            //onClick={this.handleChange}
                                                            >
                                                                <span className="capitalize">
                                                                    Search
                                                                </span>
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                        <Grid container spacing={2} style={{ marginTop: "24px" }}>
                            <Grid
                                className=" w-full"
                                item
                                lg={6}
                                md={6}
                                sm={12}
                                xs={12}
                            >
                                {renderSubsequentDetailCard('Institution Available Stock :', '000000')}
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Stack direction="row" spacing={2} style={{ textAlign: "center" }}>
                                    {renderSubsequentDetailCard('Warehouse 01 :', '0000')}
                                    {renderSubsequentDetailCard('Warehouse 02 :', '0000')}
                                    {renderSubsequentDetailCard('Indoor Pharmacy 01 :', '0000')}
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className='mb-4'>
                            <Grid item lg={8} md={8} sm={12} xs={12}>
                                {renderSubsequentDetailCard('MSD Available Stock :', '000000')}
                            </Grid>
                            <Grid item lg={8} md={8} sm={12} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item lg={8} md={8} sm={8} xs={8}>
                                        {renderSubsequentDetailCard('Nearest Hospital 1 Stock :', '000000')}
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={4} xs={4}>
                                        <Button
                                            // className="mt-2"
                                            progress={false}
                                            // type="submit"
                                            scrollToTop={
                                                true
                                            }
                                        // startIcon="save"
                                        //onClick={this.handleChange}
                                        >
                                            <span className="capitalize">
                                                Send Request
                                            </span>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item lg={8} md={8} sm={12} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item lg={8} md={8} sm={8} xs={8}>
                                        {renderSubsequentDetailCard('Nearest Hospital 2 Stock :', '000000')}
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={4} xs={4}>
                                        <Button
                                            // className="mt-2"
                                            progress={false}
                                            // type="submit"
                                            scrollToTop={
                                                true
                                            }
                                        // startIcon="save"
                                        //onClick={this.handleChange}
                                        >
                                            <span className="capitalize">
                                                Send Request
                                            </span>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item lg={8} md={8} sm={12} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item lg={8} md={8} sm={8} xs={8}>
                                        {renderSubsequentDetailCard('Nearest Hospital 3 Stock :', '000000')}
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={4} xs={4}>
                                        <Button
                                            // className="mt-2"
                                            progress={false}
                                            // type="submit"
                                            scrollToTop={
                                                true
                                            }
                                        // startIcon="save"
                                        //onClick={this.handleChange}
                                        >
                                            <span className="capitalize">
                                                Send Request
                                            </span>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </LoonsCard>
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

export default withStyles(styleSheet)(DrugAvailability)
