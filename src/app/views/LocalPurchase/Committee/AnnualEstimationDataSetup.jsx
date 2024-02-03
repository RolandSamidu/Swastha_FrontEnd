import {
    CircularProgress,
    Divider,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Typography,
} from '@material-ui/core'
import {
    CardTitle,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    DatePicker,
    MainContainer,
    SubTitle,
    Button
} from 'app/components/LoonsLabComponents'
import React from 'react'
import { Component } from 'react'
import EstimationService from 'app/services/EstimationService'
import { roundDecimal, yearParse } from 'utils'
import localStorageService from 'app/services/localStorageService'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'


class AnnualEstimationSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: '',
            severity: 'success',

            formData: {
                limit: 20,
                page: 0,
                estimation: null,
                year: yearParse(new Date()),
                'order[0]': ['estimation', 'DESC'],
            },

            remarks: null,
            data: [
                {
                    year: new Date(),
                    estimation_value: "2000"
                },

            ],
            columns: [
                {
                    name: 'year',
                    label: 'Year',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.year ? yearParse(this.state.data[tableMeta.rowIndex]?.year) : "Not Available"
                        },
                    },
                },
                {
                    name: 'estimation_value',
                    label: 'Estimation Value',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.estimation_value ? roundDecimal(this.state.data[tableMeta.rowIndex]?.estimation_value, 2) : "Not Available"
                        },
                    },
                },
            ],
            totalItems: 0,
            loaded: false,
        }
    }

    componentDidMount() {
        this.loadData()
    }

    getPreviousEstimationYear(year) {
        let currYear = year.split('-')
        return (currYear[0] - 1) + '-' + currYear[1] + '-' + currYear[2]
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadData()
        })
    }

    async loadData() {
        this.setState({ loaded: false });
        // let owner_id = await localStorageService.getItem('owner_id')

        // let orders = await EstimationService.getAllEstimationITEMS({ ...this.state.formData, owner_id: owner_id })
        // if (orders.status == 200) {
        //     console.log('Estimation Details', orders.data.view)
        //     this.setState({ data: orders.data.view.data, totalItems: orders.data.view.totalItems })
        // }
        this.setState({ loaded: true })
    }

    async onSubmit() {
        // this.setState({ loaded: false });
        // let owner_id = await localStorageService.getItem('owner_id')

        // let orders = await EstimationService.getAllEstimationITEMS({ ...this.state.formData, owner_id: owner_id })
        // if (orders.status == 200) {
        //     console.log('Estimation Details', orders.data.view)
        //     this.setState({ data: orders.data.view.data, totalItems: orders.data.view.totalItems })
        // }
        // this.setState({ loaded: true })
    }

    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <div style={{ paddingBottom: "36px" }}>
                        <Grid container="container">
                            <Grid item="item" lg={12} md={12} xs={12}>
                                <Grid item="item" xs={12}>
                                    <div className='flex'>
                                        <Typography variant="h6" className="font-semibold" >Annual LP Estimation Setup</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider className="mb-4"></Divider>
                        <ValidatorForm className="pt-2" onSubmit={this.onSubmit}>
                            <Grid container>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={12}
                                >
                                    <SubTitle title="Estimation Year" />
                                    <div style={{ height: "5px", margin: 0, padding: 0 }}></div>
                                    <DatePicker
                                        style={{ border: '1px solid #e5e7eb', borderRadius: 5 }}
                                        key={this.state.key}
                                        className="w-full"
                                        onChange={(date) => {
                                            let formData = this.state.formData
                                            formData.year = yearParse(date)
                                            this.setState({ formData })
                                            console.log("Year: ", yearParse(date))
                                        }}
                                        format="yyyy"
                                        openTo='year'
                                        views={["year"]}
                                        value={new Date(this.state.formData.year, 0, 1)}
                                        placeholder="Year"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={12}
                                >
                                    <SubTitle title="Annual Estimation (LKR)" />
                                    <div style={{ height: "5px", margin: 0, padding: 0 }}></div>
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Annual Estimation"
                                        name="quantity"
                                        required
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={
                                            String(this.state.formData
                                                .estimation)
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
                                                    estimation:
                                                        parseFloat(e.target
                                                            .value),
                                                },
                                            })
                                        }}
                                        validators={
                                            ['minNumber:' + 0, 'required:' + true]}
                                        errorMessages={[
                                            'Estimation Value Should be > 0',
                                            'this field is required'
                                        ]}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid
                                    style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
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
                                                className="mt-2"
                                                progress={false}
                                                type="submit"
                                                scrollToTop={
                                                    true
                                                }
                                                startIcon="save"
                                            // onClick={async () => this.loadData()}
                                            >
                                                <span className="capitalize">
                                                    Set Value
                                                </span>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                        <Grid container spacing={2} style={{ marginTop: "12px", padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                            <CardTitle title='Previous Year Estimations' style={{ marginLeft: "8px" }} />
                            <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: '12px', backgroundColor: "#fff", borderRadius: "12px" }}>
                                {this.state.loaded ?
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allEstimations'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: this.state.formData.limit,
                                                page: this.state.formData.page,
                                                serverSide: true,
                                                print: true,
                                                viewColumns: true,
                                                download: true,
                                                rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
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
                                                            this.setState({ formData: { page: tableState.page } }, () => {
                                                                // this.loadPreviousLPRequest()
                                                            })
                                                            console.log('page', this.state.page);
                                                            break;
                                                        case 'changeRowsPerPage':
                                                            this.setState({
                                                                formData: {
                                                                    limit: tableState.rowsPerPage,
                                                                    page: 0,
                                                                }
                                                            }, () => {
                                                                // this.loadPreviousLPRequest()
                                                            })
                                                            break;
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
                                    </Grid>
                                    :
                                    (
                                        <Grid className='justify-center text-center w-full pt-12'>
                                            <CircularProgress size={30} />
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </Grid>
                    </div>
                </LoonsCard>
                {/* <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar> */}
            </MainContainer>
        )
    }
}
export default AnnualEstimationSetup
