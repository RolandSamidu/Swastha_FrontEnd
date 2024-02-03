import React, { Component, Fragment } from 'react'
import {
    CardTitle,
    LoonsCard,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import MainContainer from 'app/components/LoonsLabComponents/MainContainer'
import { LoonsTable, Button } from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    CircularProgress,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@material-ui/core'
import * as appConst from '../../../appconst'
import { Autocomplete } from '@material-ui/lab'
import { dateParse } from 'utils'
import moment from 'moment'

class DocumentSetUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            filterData: {
                limit: 20,
                page: 0,
                unit: '',
            },
            columns: [
                {
                    name: 'unit', // field name in the row object
                    label: 'Unit', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'document_name', // field name in the row object
                    label: 'Document Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'type', // field name in the row object
                    label: 'Type', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'updated_date', // field name in the row object
                    label: 'Updated Date', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {value
                                        ? dateParse(
                                              moment(value).format('YYYY-MM-DD')
                                          )
                                        : ''}
                                </span>
                            )
                        },
                    },
                },
            ],
        }
    }
    render() {
        return (
            <LoonsCard>
                <CardTitle title="Document Set Up" />
                <ValidatorForm>
                    <Grid
                        container
                        spacing={1}
                        className="w-full mt-2 space between"
                    >
                        <Grid container spacing={1} className="flex">
                            <Grid
                                className=" w-full"
                                item
                                lg={2}
                                md={2}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Unit:" />
                            </Grid>
                            <Grid
                                className=" w-full"
                                item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    value={this.state.filterData.unit}
                                    options={appConst.unit}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData =
                                                this.state.filterData
                                            filterData.unit = value
                                            this.setState({ filterData })
                                        } else {
                                            let filterData =
                                                this.state.filterData
                                            filterData.unit = { label: '' }
                                            this.setState({ filterData })
                                        }
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please choose"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={this.state.filterData.unit}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={1} className="flex">
                            <Grid
                                className=" w-full"
                                item
                                lg={2}
                                md={2}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Type:" />
                            </Grid>
                            <Grid
                                className=" w-full flex"
                                item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                {/* <RadioGroup
                                    aria-label="doc-type"
                                    name="docType"
                                    // value={settings.layout2Settings.mode}
                                    // onChange={handleControlChange('layout2Settings.mode')}
                                >
                                    <FormControlLabel
                                        value="create"
                                        control={<Radio />}
                                        label="Create"
                                    />
                                    <FormControlLabel
                                        value="Upload"
                                        control={<Radio />}
                                        label="Upload"
                                    />
                                </RadioGroup> */}
                                <RadioGroup row>
                                    <FormControlLabel
                                        label={'Yes'}
                                        name="type"
                                        value="crate"
                                        /* onChange={() => {
                                            let formData = this.state.formData;
                                            formData.examination_data[0].other_answers.probable = true;
                                            this.setState({ formData })
                                        }} */
                                        control={<Radio color="primary" />}
                                        display="inline"
                                        /*                                                        checked={this.state.formData.examination_data[0].other_answers.probable}
                                         */
                                    />

                                    <FormControlLabel
                                        label={'No'}
                                        name="type"
                                        value="upload"
                                        /* onChange={() => {
                                            let formData = this.state.formData;
                                            formData.examination_data[0].other_answers.probable = false;
                                            this.setState({ formData })
                                        }} */
                                        control={<Radio color="primary" />}
                                        display="inline"
                                        /* checked={
                                            !this.state.formData.examination_data[0].other_answers.probable
                                        } */
                                    />
                                </RadioGroup>
                            </Grid>
                        </Grid>

                        <Grid container spacing={1} className="flex">
                            <Grid
                                className=" w-full"
                                item
                                lg={2}
                                md={2}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Document Name:" />
                            </Grid>
                            <Grid
                                className=" w-full"
                                item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <div>
                                    <TextValidator
                                        className="w-full"
                                        //className=" w-full"
                                        placeholder="Please enter"
                                        name="Comment"
                                        InputLabelProps={{ shrink: false }}
                                        //value={this.state.formData.phn}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {}}
                                        /* validators={['matchRegexp:^\s*([0-9a-zA-Z])\s$']}
                                        errorMessages={[
                                            'Invalid Inputs',
                                        ]} */
                                    />
                                </div>
                            </Grid>
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
                                /* onClick={() => {
                                window.open('/');
                            }} */
                                scrollToTop={true}
                                startIcon="add"
                            >
                                <span className="capitalize">Save</span>
                            </Button>
                        </Grid>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            {this.state.loading ? (
                                <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'allAptitute'}
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
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
                </ValidatorForm>
            </LoonsCard>
        )
    }
}

export default DocumentSetUp
