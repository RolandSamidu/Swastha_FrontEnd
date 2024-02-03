import { Grid, Typography, InputAdornment } from "@material-ui/core";
import LoonsButton from "app/components/LoonsLabComponents/Button";
import React, { Component } from "react";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import { LoonsSnackbar } from "app/components/LoonsLabComponents";


class MDS_UpdateQunatity extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id:null,
            order_quantity: 0,
            alert: false,
            message: '',
            severity: 'success',
            qtyDialogView:null
        }
    }

    async handleSubmit(){
        const { onSuccess } = this.props;
        const body = {
            order_quantity : this.state.order_quantity
        }

        let res = await PharmacyOrderService.addToCart(this.state.id,body)
        if(res.status && res.status == 200 ){

            this.setState({
                alert: true,
                message: 'Quantity Updated Successfully',
                severity: 'success'
            }, () => {
                onSuccess &&
                    onSuccess({

                    });
            })
        } else {
            this.setState({
                alert: true,
                message: 'Quantity Updated Unsuccessful',
                severity: 'error',
            })
        }
    }



    async componentDidMount() {
        this.setState({
            id:this.props.id,
            order_quantity :this.props.qty
        })
    }


    render() {

        return (
            <>
                <div className="w-full">
                    <ValidatorForm
                    onSubmit={() => this.handleSubmit()
                    
                    }>
                        <Grid container spacing={2} >
                            <Grid item xs={12} lg={12} style={{display:'flex'}}>
                                <Typography variant='h6' className="font-semibold"> New Quantity :</Typography>
                                <TextValidator
                                    className=" w-full"
                                    placeholder="Enter New Quantity"
                                    name="newqty"
                                    InputLabelProps={{
                                        shrink: false
                                    }}
                                    value={this.state.order_quantity}
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        inputProps: { min: 0},
                                        endAdornment: (
                                            this.props.unit ? (
                                                <InputAdornment position="end" className='mr-1'>
                                                    {this.props.unit}
                                                </InputAdornment>
                                            ) : null // Render nothing when the condition is not met
                                        )
                                    }}
                                    // InputProps={{
                                    //     inputProps: { min: 0},
                                       
                                    //   }}
                                    validators={['minNumber:0.99', 'maxNumber:99999999']}
                                    errorMessages={['Please Enter value more than 1']}
                                    onChange={(e) => {
                                        this.setState({
                                            order_quantity: parseInt(e.target.value)

                                        })
                                    }} />
                                    {/* &nbsp;<p>{' ' + this.props.unit}</p> */}
                            </Grid>
                            <Grid item xs={12} lg={12} style={{display:'flex'}}>
                                <LoonsButton
                                    className="mt-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">Save</span>
                                </LoonsButton>
                            </Grid>
                        </Grid>
                    </ValidatorForm>

                </div>
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
            </>
        )
    }

}

export default MDS_UpdateQunatity