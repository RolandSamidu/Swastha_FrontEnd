import React, { Component, Fragment } from 'react'
import {
    Button,
    CardTitle,
    LoonsCard,
    MainContainer,
    SubTitle,
    LoonsTable,
    LoonsSwitch,
    LoonsSnackbar,
} from '../../components/LoonsLabComponents'
import {
    Grid,
    Tooltip,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
    Divider, Typography
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import EditIcon from '@material-ui/icons/Edit'
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'

import * as appConst from '../../../appconst'
import localStorageService from 'app/services/localStorageService'
import { convertTocommaSeparated, generatePassword } from 'utils'
import InventoryService from 'app/services/InventoryService'


const drawerWidth = 270
let activeTheme = MatxLayoutSettings.activeTheme

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    root: {
        display: 'flex',
    },
})




class OrderControlForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            item_id: '6ac882b1-dfdb-4bdf-888c-e3fc2387c1c0',
            year: 2024,
            itemDetails: null

        }
    }

    async getItemDetails() {

        //let id = this.props.item_id


        let res = await InventoryService.fetchItemById({}, this.state.item_id)

        if (res.status === 200) {
            console.log('cheking info', res)

            this.setState({
                itemDetails: res.data.view
            })
        }
    }

    async componentDidMount() {
        this.getItemDetails()
    }



    render() {

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={'Order Control Form'} />
                        <div>
                            <div className='flex justify-center text-center'>
                                <Typography variant="h6" className="font-semibold">{`ORDER CONTROL FORM - YEAR ` + this.state.year}</Typography>
                                <Divider />
                            </div>

                            <div>
                                <Typography variant="p" className="font-semibold">SR No: {this.state.itemDetails?.sr_no + " " + this.state.itemDetails?.short_description}</Typography>
                                <br></br>
                                <Typography variant="p" className="font-semibold">UOM: {this.state.itemDetails?.ItemUOM[0]?.UOM?.name}</Typography>
                                <Divider />

                                <Grid container>
                                    <Grid item sm={2}>
                                        <table>
                                            <tr>
                                                <td><SubTitle title={"VEN"} /></td>
                                                <td><SubTitle title={":"} /></td>
                                                <td><SubTitle title={this.state.itemDetails?.VEN?.name} /></td>
                                            </tr>

                                            <tr>
                                                <td><SubTitle title={"ABC"} /></td>
                                                <td><SubTitle title={":"} /></td>
                                                <td><SubTitle title={this.state.itemDetails?.AbcClass} /></td>
                                            </tr>

                                        </table>
                                    </Grid>
                                    <Grid item sm={2}>
                                        <table>
                                            <tr>
                                                <td><SubTitle title={"Item Level"} /></td>
                                                <td><SubTitle title={":"} /></td>
                                                <td><SubTitle title={"3"} /></td>
                                            </tr>

                                            <tr>
                                                <td><SubTitle title={"Cons.Item"} /></td>
                                                <td><SubTitle title={":"} /></td>
                                                <td><SubTitle title={this.state.itemDetails?.consumables} /></td>
                                            </tr>

                                        </table>
                                    </Grid>

                                    <Grid item sm={3}>
                                        <table>
                                            <tr>
                                                <td><SubTitle title={"Estimated Item"} /></td>
                                                <td><SubTitle title={":"} /></td>
                                                <td><SubTitle title={this.state.itemDetails?.used_for_estimates} /></td>
                                            </tr>

                                            <tr>
                                                <td><SubTitle title={"Comp/Regular"} /></td>
                                                <td><SubTitle title={":"} /></td>
                                                <td><SubTitle title={"C"} /></td>
                                            </tr>

                                        </table>
                                    </Grid>
                                    <Grid item sm={3}>
                                        <table>
                                            <tr>
                                                <td><SubTitle title={"Std Unit Const(Rs.)"} /></td>
                                                <td><SubTitle title={":"} /></td>
                                                <td><SubTitle title={convertTocommaSeparated(this.state.itemDetails?.standard_cost, 2)} /></td>
                                            </tr>

                                            <tr>
                                                <td><SubTitle title={"Formulary Approved"} /></td>
                                                <td><SubTitle title={":"} /></td>
                                                <td><SubTitle title={this.state.itemDetails?.formulatory_approved} /></td>
                                            </tr>

                                        </table>
                                    </Grid>
                                    <Grid item sm={2}>
                                        <table>
                                            <tr>
                                                <td><SubTitle title={"UFF"} /></td>
                                                <td><SubTitle title={":"} /></td>
                                                <td><SubTitle title={this.state.itemDetails?.used_for_formulation} /></td>
                                            </tr>


                                        </table>
                                    </Grid>


                                </Grid>
                            </div>
                            <div className='mt-4'></div>
                            <Divider />

                            <div className='mt-4'>
                                <Grid container>
                                    <Grid item sm={2}>
                                        <Typography variant="p" className="font-semibold">Year</Typography>
                                        <Divider />
                                        <Typography variant="p" className="font-semibold">Anu.Est./F.R</Typography><br></br>
                                        <Typography variant="p" className="font-semibold">MSD Issues</Typography><br></br>
                                        <Typography variant="p" className="font-semibold">Nat.Consump</Typography><br></br>
                                    </Grid>

                                    <Grid item sm={2}>
                                        <Typography variant="p" className="font-semibold">{this.state.year - 5}</Typography>
                                        <Divider />
                                        <Typography variant="p" >{convertTocommaSeparated(232353533, 2)}</Typography><br></br>
                                        <Typography variant="p" >{convertTocommaSeparated(232353533, 2)}</Typography><br></br>
                                        <Typography variant="p" >{convertTocommaSeparated(232353533, 2)}</Typography><br></br>
                                    </Grid>

                                </Grid>
                                <Divider />
                            </div>
                        </div>


                    </LoonsCard>
                </MainContainer>
            </Fragment >
        )
    }
}



export default withStyles(styleSheet)(OrderControlForm)
