import React, { Component } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Autocomplete } from '@material-ui/lab'
import {
    Grid,
    IconButton,
    Tooltip,
    Typography,
    Chip,
    Breadcrumbs,
    Link,
    CircularProgress,
} from '@material-ui/core'
import {
    MainContainer,
    LoonsCard,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import VisibilityIcon from '@material-ui/icons/Visibility'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import PreProcumentService from 'app/services/PreProcumentService'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import ComponentAuthorization from 'app/components/SpcComponents/ComponentAuthorization'
import ModalXL from 'app/components/Modals/ModalXL'
import ModalLG from 'app/components/Modals/ModalLG'
import SingleItemViewTabNav from './SingleItemViewTabNav'
import ApprovalHandler from './ApprovalHandler'
import { PageContext } from './PageContext'

// access list
// TODO: update
const accessList = {
    approvalPocess: '',
}

class SingleOrders extends Component {
    static contextType = PageContext

    constructor(props) {
        super(props)
        this.state = {
            dataIsLoading: true,
            textAreaValue: '',
            approvalConfig: {},
            approvalStatus: '',
            orderListId: '',
            filterData: {
                limit: 10,
                page: 0,
            },
            userType: '',
            orderNo: 'Loading...',
            drugsType: 'Loading...',
            data: [],
            columns: [
                {
                    name: 'ItemSnap',
                    label: 'SR Number',
                    options: {
                        display: true,
                        filter: true,
                        sort: true,
                        customBodyRender: (ItemSnap) => ItemSnap.sr_no,
                    },
                },
                {
                    name: 'ItemSnap',
                    label: 'Item Name',
                    options: {
                        display: true,
                        filter: true,
                        sort: true,
                        customBodyRender: (ItemSnap) =>
                            ItemSnap.medium_description,
                    },
                },

                {
                    name: 'quantity',
                    label: 'Order Quantity',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'total_calculated_cost',
                    label: 'Estimated Total Cost (LKR)M',
                    options: {
                        display: true,
                    },
                },

                {
                    name: 'priority_level',
                    label: 'Priority Level',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'Packing',
                    label: 'Packing',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,

                        customBodyRenderLite: (dataIndex) => {
                            const record = this.state.data[dataIndex]

                            return (
                                <ModalXL
                                    title={`SR Number : ${record?.ItemSnap.sr_no}`}
                                    button={
                                        <Tooltip title="View Document">
                                            <IconButton>
                                                <VisibilityIcon color="primary" />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                >
                                    <SingleItemViewTabNav
                                        singleOrderId={record.id}
                                    />
                                </ModalXL>
                            )
                        },
                    },
                },
            ],
        }
    }

    async getSingleOrderList() {
        // const id = this.props.match.params.id
        const [pageData] = this.context

        const tempFilterData = this.state.filterData

        tempFilterData.order_list_id = pageData.slug

        const resultSingleOrderList =
            await PreProcumentService.getSingleOrderLists(tempFilterData)

        if (resultSingleOrderList.status) {
            const { data } = resultSingleOrderList.data.view

            this.setState({
                data: data,
                dataIsLoading: false,
            })
        }
    }

    // TODO: check and remove
    // get approval config list
    async getApprovalConfigList() {
        const [pageData] = this.context

        const resultApprovalConfigList =
            await PreProcumentService.getApprovalConfigs()
        const { data } = resultApprovalConfigList.data.view

        if (pageData.userType !== 'admin') {
            const action = data.find((rs) => rs.user_role === pageData.userType)
            this.setState({ approvalConfig: action })
        }
    }

    // get approval list
    async getApprovaList() {
        const [pageData] = this.context
        const resultApprovalList = await PreProcumentService.getApprovalList({
            order_list_id: pageData.slug,
        })

        const { data } = resultApprovalList.data.view
    }

    // go to home page (All Order List)
    viewAllOrderList() {
        const [pageData, setPageData] = this.context
        const tempPageData = pageData

        tempPageData.slug = 0

        setPageData({ ...tempPageData })
    }

    setInfo() {
        const [pageData] = this.context

        this.setState({
            userType: pageData.userType,
            approvalStatus: pageData.approvalStatus,
            orderListId: pageData.slug,
        })
    }

    componentDidMount() {
        this.getSingleOrderList()
        this.setInfo()
        this.getApprovaList()
    }

    render() {
        const [pageData] = this.context

        return (
            <MainContainer>
                <LoonsCard style={{ minHeight: '80vh' }}>
                    <Grid container>
                        <Grid
                            item
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <Tooltip title="Back to All Orders">
                                <IconButton
                                    onClick={() => {
                                        this.viewAllOrderList()
                                    }}
                                    style={{ padding: '1rem' }}
                                    size="medium"
                                >
                                    <ArrowBackIosIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>

                            <p
                                style={{
                                    margin: 0,
                                    padding: '1rem',
                                    color: '#6B728E',
                                    fontWeight: 600,
                                    fontSize: '18px',
                                }}
                            >{`Order - ${pageData.orderNo}`}</p>
                        </Grid>
                        <Grid
                            item
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link
                                    component="button"
                                    color="inherit"
                                    onClick={() => this.viewAllOrderList()}
                                >
                                    All Order List
                                </Link>
                                <Typography color="textPrimary">
                                    Single Order List
                                </Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid
                            item
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Tooltip title="Drug Type">
                                <Chip
                                    color="secondary"
                                    label={pageData.drugsType}
                                />
                            </Tooltip>
                        </Grid>
                    </Grid>

                    {/* <ValidatorForm onSubmit={() => { }} className="w-full">
                        <Grid container spacing={1} className="flex ">
                            <Grid container lg={12} md={12} sm={12} xs={12}>
                                <Grid
                                    item
                                    lg={4}
                                    md={4}
                                    sm={4}
                                    xs={4}
                                    style={{ paddingLeft: '5px' }}
                                >
                                    <SubTitle title="Estimated Cost Between" />
                                </Grid>
                                <Grid
                                    item
                                    lg={4}
                                    md={4}
                                    sm={4}
                                    xs={4}
                                    style={{ paddingLeft: '5px' }}
                                >
                                    <SubTitle title="Priority Level" />
                                </Grid>
                                <Grid
                                    item
                                    lg={4}
                                    md={4}
                                    sm={4}
                                    xs={4}
                                    style={{ paddingLeft: '5px' }}
                                >
                                    <SubTitle title="Status" />
                                </Grid>
                            </Grid>
                            <Grid item lg={2} md={4} sm={6} xs={12}>
                                
                                <TextValidator
                                    className=" w-full"
                                    name="cost"
                                    InputLabelProps={{ shrink: false }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    placeholder="From(LKR)"
                                />
                            </Grid>
                            <Grid item lg={2} md={4} sm={6} xs={12}>
                                
                                <TextValidator
                                    className=" w-full"
                                    name="to"
                                    InputLabelProps={{ shrink: false }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    placeholder="To(LKR)"
                                />
                            </Grid>
                            <Grid item lg={2} md={4} sm={6} xs={12}>
                                <Autocomplete
                                    className="w-half"
                                    value={this.state.filterData.prioritySPC}
                                    options={appConst.prioritySPC}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData =
                                                this.state.filterData
                                            filterData.prioritySPC = value
                                            this.setState({ filterData })
                                        } else {
                                            let filterData =
                                                this.state.filterData
                                            filterData.prioritySPC = {
                                                label: '',
                                            }
                                            this.setState({ filterData })
                                        }
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="All"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.filterData
                                                    .prioritySPC
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item lg={2} md={4} sm={6} xs={12}>
                                <Autocomplete
                                    className="w-half"
                                    value={this.state.filterData.statusSPC}
                                    options={appConst.statusSPC}
                                    onChange={(e, value) => {
                                        if (null != value) {
                                            let filterData =
                                                this.state.filterData
                                            filterData.statusSPC = value
                                            this.setState({ filterData })
                                        } else {
                                            let filterData =
                                                this.state.filterData
                                            filterData.statusSPC = {
                                                label: '',
                                            }
                                            this.setState({ filterData })
                                        }
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="All"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.filterData.statusSPC
                                            }
                                        />
                                    )}
                                />{' '}
                            </Grid>

                            <Grid item lg={3} md={4} sm={6} xs={12}>
                                

                                <TextValidator
                                    className=" w-full"
                                    name="Order List Number"
                                    InputLabelProps={{ shrink: false }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'left',
                                    justifyContent: 'space-between',
                                    marginTop: '9px',
                                }}
                            >
                                <Grid item lg={12} md={4} sm={6} xs={12}>
                                    <LoonsButton className="w-full">
                                        Search
                                    </LoonsButton>
                                </Grid>
                            </div>
                        </Grid>
                    </ValidatorForm> */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'space-between',
                            marginTop: '25px',
                        }}
                    ></div>

                    <div
                        className="w-full"
                        style={{
                            justifyContent: 'flex-end',
                            display: 'flex',
                        }}
                    >
                        <ComponentAuthorization
                            accessList={[
                                'admin',
                                'SPC Chairman',
                                'SPC MI',
                                'SPC DGM',
                            ]}
                            currentUser={this.state.userType}
                        >
                            <ModalLG
                                title={`Approval Process`}
                                button={
                                    <LoonsButton
                                        title="View Document"
                                        style={{ marginLeft: '10px' }}
                                        startIcon={<AssignmentTurnedInIcon />}
                                    >
                                        Approval
                                    </LoonsButton>
                                }
                            >
                                <ApprovalHandler
                                    userType={this.state.userType}
                                    orderListId={this.state.orderListId}
                                />
                            </ModalLG>
                        </ComponentAuthorization>
                    </div>

                    {!this.state.dataIsLoading && (
                        <LoonsTable
                            id={'completed'}
                            data={this.state.data}
                            columns={this.state.columns}
                        ></LoonsTable>
                    )}

                    {this.state.dataIsLoading && (
                        <div
                            className="justify-center text-center w-full pt-12"
                            style={{ height: '50vh' }}
                        >
                            <CircularProgress size={30} />
                        </div>
                    )}
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default SingleOrders
