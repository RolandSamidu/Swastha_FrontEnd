import React, { Fragment, useContext, useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core/styles';
import {
    MainContainer,
    LoonsCard,
    CardTitle,
    LoonsTable,
    SubTitle,
    LoonsSnackbar,
    Button,
} from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import {
    Grid,
    CircularProgress,
    IconButton,
    Tooltip,
    FormControl,

    InputAdornment,
    Dialog,

    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    Divider,
    Chip,
    Icon,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import SortIcon from '@mui/icons-material/Sort';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import * as appConst from '../../../../../appconst'
import CloseIcon from '@material-ui/icons/Close';
import SPCServices from 'app/services/SPCServices';
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import ConsignmentService from 'app/services/ConsignmentService';
import { dateParse, convertTocommaSeparated } from 'utils'
import BlockIcon from '@material-ui/icons/Block';
import { ConfirmationDialog } from 'app/components';
import IndividualDetails from './IndividualDetails'
const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon className='text-primary' />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);


export default function ConsignmentDetails({ order_no }) {

    const [dataIsLoading, setDataIsLoading] = useState(false)
    const [noOfData, setNoOfData] = useState(0)
    const [tableData, setTableData] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [viewDet, setviewDet] = useState(false)
    const [selected_data, setselected_data] = useState()



    const [filterData, setfilterData] = useState({
        limit: 5, page: 0,
        po_no: null,
        order_no: null,
        'order[0]': ['createdAt', 'ASC'],
    })

    const tableColumns = [
        {
            name: 'action',
            label: 'Action',
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {

                    return (
                        <Grid className="px-2">
                            <Tooltip title="View Debit Note">
                                <IconButton
                                    className="text-black mr-2"
                                    onClick={() => {
                                        loadSingleData(tableData[tableMeta.rowIndex].id)

                                    }}
                                >
                                    <Icon color='primary'>visibility</Icon>
                                </IconButton>
                            </Tooltip>

                        </Grid>
                    )
                },
            },
        },
        {
            name: 'po_no',
            label: 'WDN/LCDN Number',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableData[dataIndex]
                    return (
                        <Grid className="px-2">
                            {
                                tempTableData.wdn_no ?? ""

                            }

                        </Grid>
                    )
                },
            },
        },

        {
            name: 'wharf_ref_no',
            label: 'WHARF Ref No',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableData[dataIndex]
                    return (
                        <Grid className="px-2">
                            {
                                tempTableData.shipment_no ?? "-"

                            }

                        </Grid>
                    )
                },
            },
        },
        {
            name: 'shipment_no',
            label: 'Shipment Number',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    const tempTableData = tableData[dataIndex]
                    return (
                        <Grid className="px-2">
                            {
                                tempTableData.wharf_ref_no ? tempTableData.wharf_ref_no : tempTableData.ldcn_ref_no ? tempTableData.ldcn_ref_no : ""

                            }

                        </Grid>
                    )
                },
            },
        },
        {
            name: 'po_no',
            label: 'PO No',
            options: {
                display: true,
            },
        },

        {
            name: 'order_date',
            label: 'Transit Quantity',
            options: {
                display: true,
            },
        },
        {
            name: 'status',
            label: 'Shipment Status',
            options: {
                display: true,
            },
        },

    ]


    const loadData = async () => {

        let updatedData = { ...filterData, order_no: order_no }

        setDataIsLoading(true)

        let res = await SPCServices.getConsignment(updatedData)


        if (res.status === 200) {
            console.log('SPC Consignment Data: ', res.data.view.data);

            setTableData(res.data.view.data)
            setTotalItems(res.data.view.totalItems)
            setTotalPages(res.data.view.totalPages)
            setDataIsLoading(false)
        }


    }
    async function loadSingleData(id) {
        let res = await SPCServices.getConsignmentByID(id)

        if (res.status === 200) {

            setselected_data(res.data.view)
            setviewDet(true)
        }


    }


    useEffect(() => {
        loadData();

    }, [order_no])

    function setPage(page) {
        filterData.page = page
        setfilterData(filterData)
        loadData()
    }




    return (
        <Fragment className="p-2">


            {/* Load All Order List : Pre Procument */}
            {!dataIsLoading && (
                <LoonsTable
                    id={'allPurchaseOrder'}
                    data={tableData}
                    columns={tableColumns}

                    options={{
                        pagination: true,
                        serverSide: true,
                        count: totalItems,
                        rowsPerPage: filterData.limit,
                        page: filterData.page,
                        onTableChange: (action, tableState) => {
                            switch (action) {
                                case 'changePage':
                                    setPage(
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
            {dataIsLoading && (
                <div
                    className="justify-center text-center w-full pt-12"
                    style={{ height: '50vh' }}
                >
                    <CircularProgress size={30} />
                </div>
            )}


            <Dialog
                fullWidth={true}
                maxWidth="xl"
                open={viewDet}>
                <MuiDialogTitle disableTypography="disableTypography" style={{
                    margin: 0, padding: 10
                }} >
                    <CardTitle title="View Consignment Details" />
                    <IconButton aria-label="close" style={{
                        position: 'absolute',
                        right: 1,
                        top: 1,

                    }}
                        onClick={() => {
                            setviewDet(false)
                        }}>
                        <CloseIcon />
                    </IconButton>
                </MuiDialogTitle>
                <div className="w-full h-full px-4 pb-5">
                    <IndividualDetails isEdit={false} isResubmit={false} data={selected_data} id={selected_data?.id} />
                </div>
            </Dialog>

        </Fragment>
    )
}
