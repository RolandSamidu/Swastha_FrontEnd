import React, { Component, Fragment } from "react";
import { LoonsSnackbar, MainContainer, SubTitle } from "../../../components/LoonsLabComponents";
import { Grid, Typography, Icon, Card } from '@material-ui/core'
import { Button } from 'app/components/LoonsLabComponents'
import VehicleService from "../../../services/VehicleService";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import LoonsTable from "../../../components/LoonsLabComponents/Table/LoonsTable";
import { Autocomplete } from "@material-ui/lab";
import LoonsCard from "../../../components/LoonsLabComponents/LoonsCard";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import Tooltip from "@material-ui/core/Tooltip";
import LoonsSwitch from "../../../components/LoonsLabComponents/Switch";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import localStorageService from "app/services/localStorageService";
import * as appConst from '../../../../appconst';
import PreStockCheck from "../PrepareStockTake/PrepareStockTake";
import { Box } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { dateParse } from "utils";
import { DatePicker } from 'app/components/LoonsLabComponents';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import StockVerificationService from "../../../services/StockVerificationService";
import ReactToPrint from "react-to-print";
import Barcode from 'react-jsbarcode';




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





class PrintAssignEmployee extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonName: 'Save',
            loading: false,
            loaded: false,
            stock_verification_data: [],
            stockVerificationData: {
                page: 0,
                limit: 10,
                // type: ["Helper", "Driver"]
            },



            // institution: {
            //     first: null,
            //     mid: null,
            //     end: null
            // },
            regno2: true,


            formData: {

                institution: '',
                ending_code_item: '',
                starting_item_code: '',


            },





        }
    }


    async stockVerification() {
        this.setState({ loading: false })
        let res = await StockVerificationService.getStockVerificationByID(this.props.match.params.id)
        console.log('res22', res);
        console.log('id', this.props.match.params);
        if (res.status == 200) {

            console.log("select emp", res.data.view.data)
            this.setState({
                stock_verification_data: res.data.view.data,
                total_stock_verification_data: res.data.view.totalItems,
                loading: true,
            })

            console.log("2nd time", res.data.view)
        }
    }

    componentDidMount() {

        this.stockVerification()
        console.log('props', this.props)

    }


    async setPage(page) {
        //Change paginations
        let stockVerificationData = this.state.stockVerificationData
        stockVerificationData.page = page
        this.setState(
            {
                stockVerificationData,
            },
            () => {
                this.stockVerification()
            }
        )
    }





    render() {

        const cardStyle = {
            border: '1px solid lightblue',

        };
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>


                        <ValidatorForm
                            ref="form"
                            className="pt-2"
                            onSubmit={this.postDriverForm}
                        >

                            <ReactToPrint
                                trigger={() =>
                                    // <IconButton>
                                    //     <Icon className="text-body" fontSize="small">
                                    //         print
                                    //     </Icon>
                                    // </IconButton> 
                                    <Button
                                        className=''
                                        variant="contained"
                                        color="primary"
                                        onClick=' '
                                    >
                                        <Icon className="mr-2" fontSize="small">
                                            print
                                        </Icon>
                                        Print
                                    </Button>
                                }
                                pageStyle=''
                                documentTitle=''
                                //removeAfterPrint
                                content={() => this.componentRef}
                            />



                            <Grid container className='mt-5'>
                                <Grid item sm={12}>
                                    <div ref={(el) => (this.componentRef = el)}>
                                        <div className='p-5' style={{ border: '3px solid #2C7EF2', background: '#CFD5FF', borderRadius: '5px' }}>
                                            <table className='w-full'>
                                                <tr>
                                                    <td style={{ width: '10%', fontWeight: 'bold' }}>Assign Institution </td>
                                                    <td style={{ width: '80%' }}>: {this.state.stock_verification_data[0]?.Stock_Verification?.Pharmacy_drugs_store?.name}</td>
                                                </tr>
                                            </table>
                                            <br />
                                            <table className='w-full'>
                                                <tr style={{ display: 'flex' }}>
                                                    <td style={{ width: '10%', fontWeight: 'bold' }}>Assigned Employees </td>
                                                    {/* <td style={{ width: '80%' }}>: {this.state.stock_verification_data.map((x) => x?.Employee?.name + ', ')}</td> */}
                                                    <td style={{ width: '80%' }}><ul style={{ paddingTop: 0 }}>{this.state.stock_verification_data.map((x, index) => (<li key={index}>{x?.Employee?.name}</li>))}</ul></td>
                                                </tr>
                                            </table>
                                            <br></br>
                                            <table className='w-full'>
                                                <tr>
                                                    <td style={{ width: '10%', fontWeight: 'bold' }}>From Date </td>
                                                    <td style={{ width: '80%' }}>: {dateParse(this.state.stock_verification_data[0]?.Stock_Verification?.from_date)}</td>
                                                </tr>

                                            </table>
                                            <br />
                                            <table className='w-full'>
                                                <tr>
                                                    <td style={{ width: '10%', fontWeight: 'bold' }}>To Date </td>
                                                    <td style={{ width: '80%' }}>: {dateParse(this.state.stock_verification_data[0]?.Stock_Verification?.to_date)}</td>
                                                </tr>

                                            </table>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>




                        </ValidatorForm>
                    </LoonsCard>






                </MainContainer>

            </Fragment >

        )

    }
}

export default PrintAssignEmployee