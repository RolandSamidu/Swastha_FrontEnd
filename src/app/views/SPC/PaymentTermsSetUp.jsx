import React, { Component, Fragment } from "react";
import { CardTitle, LoonsCard, SubTitle } from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import { LoonsTable, Button } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { CircularProgress, Grid } from "@material-ui/core";
import * as appConst from '../../../appconst'
import { Autocomplete} from "@material-ui/lab";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';

class PaymentTermsSetUp extends Component {
    /* constructor(props){
        super(props)
        this.state = {
            loading:true,
            filterData:{
                limit: 20,
                page:0,
                bid_value_presentage_from: '',
            },
            columns: [
                {
                    name: 'bid_value', // field name in the row object
                    label: 'Bid Value', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'bid_validity_period', // field name in the row object
                    label: 'Bid Validity Period', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'offer_validity_period', // field name in the row object
                    label: 'Offer Validity Period', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                }
            ],
        }
    } */
    render(){
        return(
            <LoonsCard>
                <CardTitle title="Payment Terms Set Up"/>
                <ValidatorForm>
                    
                </ValidatorForm>
            </LoonsCard>
        )
    }
}

export default PaymentTermsSetUp;