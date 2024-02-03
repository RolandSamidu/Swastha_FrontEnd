import React, { Component, Fragment } from "react";
import { Button, CardTitle, LoonsCard, LoonsTable, MainContainer, SubTitle } from "../../../components/LoonsLabComponents";
import { CircularProgress, Grid, Link,Tooltip, IconButton } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { Autocomplete } from "@material-ui/lab";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import ConsignmentService from "../../../services/ConsignmentService";
import moment from "moment";

class ConfirmSamples extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            totalItems: 0,

            ref_no: '',
            sr_no: '',
            batch_id: '',
            wharf_ref_no: '',
            mas_remark: '',

            formData: {
                ref_no: '',
                sr_no: '',
                batch_id: '',
                wharf_ref_no: '',
                mas_remark: '',
                items: []
            },

            filterData: {
                limit: 20,
                page: 0,
                ref_no: '',
                sr_no: '',
                batch_id: '',
                mas_remark: '',
                wharf_ref_no: '',
                'order[0]': ['createdAt', 'DESC'],
            },

            sampleData: [],

            sampleItemData: [],

            data: [],
            columns: [
                {
                    name: 'Action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let status = this.state.data[dataIndex].status;
                            return <Grid>
                                

                                    <Grid className="flex items-center">
                                    {/*  <Tooltip title="Edit">
                                        <Buttons
                                         color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}>
                                            View
                                        </Buttons>
                                    </Tooltip> */}
                                    <Grid className="px-2">
                                        {(status == "AD Not Recommended" ) ?
                                            <Tooltip title="Approve Sample">
                                                <IconButton
                                                    onClick={() => {
                                                        window.location.href=`/consignments/msdDirector/approveSample/${this.state.data[dataIndex].id}`;
                                                    }}>
                                                    <ThumbUpIcon color='success' />
                                                </IconButton>
                                            </Tooltip>
                                            : 
                                            <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/consignments/msdCIU/approveSample/${this.state.data[dataIndex].id}`
                                                }}>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                        }
                                    </Grid>

                                    
                                </Grid>



                            </Grid>


                        },
                    },
                },
                {
                    name: 'ref_no', // field name in the row object
                    label: 'Sample Ref Number', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR Number', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].item.item_schedule.Order_item.item.sr_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'medium_description', // field name in the row object
                    label: 'SR Description', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].item.item_schedule.Order_item.item.medium_description
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'batch_id', // field name in the row object
                    label: 'Batch Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].batch.batch_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'mfd', // field name in the row object
                    label: 'MFD', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = moment(this.state.data[dataIndex].batch.mfd).format("YYYY-MM-DD")
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'exd', // field name in the row object
                    label: 'EXD', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = moment(this.state.data[dataIndex].batch.exd).format("YYYY-MM-DD")
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'shelf_life', // field name in the row object
                    label: 'Shelf Life', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'container_id', // field name in the row object
                    label: 'Container Number', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].ConsignmentContainer?.Vehicle?.reg_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'specification', // field name in the row object
                    label: 'Specification', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].item.item_schedule.Order_item.item.specification
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'cartoon_no', // field name in the row object
                    label: 'Cartoon Number', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'picked_date', // field name in the row object
                    label: 'Sample Picked Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'recommended_date_SCO', // field name in the row object
                    label: 'Sample recommended Date(SCO)', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'recommended_date_AD', // field name in the row object
                    label: 'Sample recommended Date(AD)', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },

            ],

            alert: false,
            message: "",
            severity: 'success',
        }
    }

    async fetchConsignmentSamples() {
        let samples = await ConsignmentService.fetchConsignmentSamples();
        if (samples.status === 200) {
            this.setState({
                sampleData: samples.data.view.data
            })
        }
    }

    async fetchConsignmentSamplesItem() {
        let samples = await ConsignmentService.fetchConsignmentSamples();
        if (samples.status === 200) {
            this.setState({
                sampleItemData: samples.data.view.data.item
            })
        }
    }

    // Load data onto table
    async loadData() {
        this.setState({ loaded: false })

        let res = await ConsignmentService.fetchConsignmentSamples(this.state.filterData)
        if (res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        }
    }

    handleFilterSubmit = (val) => {
        this.loadData()
    }

    onSubmit = () => {
        this.handleFilterSubmit({
            ref_no: this.state.ref_no,
            sr_no: this.state.sr_no,
            batch_id: this.state.batch_id,
            wharf_ref_no: this.state.wharf_ref_no,
        })
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
                this.loadData()
            }
        )
    }

    componentDidMount() {
       // this.fetchConsignmentSamples()
        this.loadData()
       // this.fetchConsignmentSamplesItem()
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title=" View Samples " />
                        <Grid item lg={12} className=" w-full mt-2">
                        <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.setPage(0)}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex">



                                <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Search"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.filterData.search
                                            }
                                            onChange={(e, value) => {
                                                let filterData = this.state.filterData;
                                                filterData.search = e.target.value
                                                this.setState({ filterData })

                                            }}
                                            /* validators={[
                                                'required',
                                            ]}
                                            errorMessages={[
                                                'this field is required',
                                            ]} */
                                        />
                                    </Grid>
                                  {/*   <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Sample Ref Number" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.sampleData}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData
                                                    filterData.ref_no = e.target.value;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            getOptionLabel={
                                                (option) => option.ref_no
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please select"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.ref_no}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="SR Number/Name" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.sampleItemData}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData
                                                    filterData.msa_remark = e.target.value;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            getOptionLabel={
                                                (option) => option.msa_remark
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please select"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.msa_remark}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Batch Number" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.sampleData}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData
                                                    filterData.batch_id = e.target.value;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            getOptionLabel={
                                                (option) => option.batch_id
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please select"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.batch_id}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={3}
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Wharf Ref" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.filterData.wharf_ref_no}
                                            onChange={(e, value) => {

                                            }}
                                            getOptionLabel={
                                                (option) => option.wharf_ref_no
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please select"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.wharf_ref_no}
                                                />
                                            )}
                                        />
                                    </Grid> */}

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid
                                            className=" flex " item lg={2} md={2} sm={12} xs={12}
                                        >
                                            <Grid
                                                
                                            >
                                                <Button
                                                    className="mt-1"
                                                    progress={false}
                                                    type="submit"
                                                    scrollToTop={true}
                                                >
                                                    <span className="capitalize">Search</span>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                        </Grid>

                        {/*Table*/}
                        <Grid lg={12} className=" w-full mt-2" spacing={2} style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <div className="pt-0">
                                        <LoonsTable
                                            id={"DEFAULT_USER"}
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
                                                            this.setPage(tableState.page)
                                                            break;
                                                        case 'sort':
                                                            break;
                                                        default:
                                                            console.log('action not handled.');
                                                    }
                                                }

                                            }
                                            }
                                        >
                                        </LoonsTable>
                                    </div>
                                    :
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                            }
                        </Grid>
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }
}

export default ConfirmSamples
