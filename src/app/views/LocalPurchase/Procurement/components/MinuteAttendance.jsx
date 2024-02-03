import React, { useState } from 'react'
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Grid, Typography, FormControl, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import { dateParse, timeParse } from 'utils'
import MinuteAttendanceTable from './MinuteAttendanceTable'
import { CardTitle, SubTitle, Button } from 'app/components/LoonsLabComponents';
import Bidding from '../bidding opening'

export default function MinuteAttendance() {
    const [isAgree, setIsAgree] = useState(false);

    return (
        <ValidatorForm>
            <Grid container spacing={2} className='w-full' style={{ justifyContent: "center", margin: 0, marginTop: "12px", display: "flex" }}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={2} className="justify-center" >
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <h3 style={{ textAlign: "center" }}>Bid Opening Minute</h3>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} direction="row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
                        <Grid item lg={4} md={4} sm={4} xs={4} style={{ display: "flex", justifyContent: "center", border: "1px solid black" }}>
                            {/* Content for the first row */}
                            <Typography style={{ textAlign: "center" }}>{`Bid Opening Date - ${dateParse(new Date())}`}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={4} style={{ display: "flex", justifyContent: "center", border: "1px solid black" }}>
                            {/* Content for the second row */}
                            <Typography style={{ textAlign: "center" }}>{`Bid Opening Time - ${timeParse(new Date())}`}</Typography>
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={4} style={{ display: "flex", justifyContent: "center", border: "1px solid black" }}>
                            {/* Content for the third row */}
                            <Typography style={{ textAlign: "center" }}>{"Location - Kaluthara"}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} direction="row" style={{ display: "flex", justifyContent: "space-between" }}>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{ display: "flex", justifyContent: "center", border: "1px solid black" }}>
                            {/* Content for the first row in the nested column */}
                            <Typography style={{ textAlign: "center" }}>{"Procurement No: DHS/P/C/ICB/02"}</Typography>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{ display: "flex", justifyContent: "center", border: "1px solid black" }}>
                            {/* Content for the second row in the nested column */}
                            <Typography style={{ textAlign: "center" }}>{"Sr No / Item Name - 0012201-31 - Panadol"}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ justifyContent: "center", display: "flex" }}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Typography variant='h5' className='my-5' style={{ textAlign: "center" }}>Bid Observation</Typography>
                        </Grid>
                    </Grid>
                    {/* <Grid container spacing={2} style={{ marginTop: "12px", marginBottom: '25px', padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                        <CardTitle title='Bidding Information' style={{ marginLeft: "8px" }} />
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <MinuteAttendanceTable />
                        </Grid>
                    </Grid> */}
                    <Grid container spacing={2} style={{ marginTop: "12px", marginBottom: '25px', padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                        <CardTitle title='Bidding Information' style={{ marginLeft: "8px" }} />
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Bidding />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ marginTop: "12px", marginBottom: '25px', padding: "24px" }}>
                        <SubTitle title='We, undersigned certify that the bids have been opened under our supervision and the information given above are correct.' />
                        <Grid item lg={12} md={12} sm={12} xs={12} style={{ paddingLeft: "30px" }}>
                            <Typography>I Agree to above decision:</Typography>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    name="truefalse"
                                    value={isAgree}
                                    onChange={(e) => {
                                        setIsAgree(e.target.value === 'true' ? true : false);
                                    }}
                                    style={{ display: "block" }}
                                >
                                    <FormControlLabel
                                        value={true}
                                        control={<Radio />}
                                        label="Yes"
                                    />
                                    <FormControlLabel
                                        value={false}
                                        control={<Radio />}
                                        label="No"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12} style={{ paddingLeft: "30px" }}>
                            <SubTitle title={"Chairman ✔"}></SubTitle>
                            <p>K. L. P. Silva</p>
                            <h4>My Signature</h4>
                            <p>{dateParse(new Date())}</p>
                            <p>{timeParse(new Date())}</p>
                        </Grid>
                        <Grid
                            item
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                        >
                            <Grid container spacing={2} className='my-5'>
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
                                        className="mt-2 mr-2"
                                        progress={false}
                                        // disabled={this.state.source_id ? true : false}
                                        type="submit"
                                        scrollToTop={
                                            true
                                        }
                                        startIcon="save"
                                    //onClick={this.handleChange}
                                    >
                                        <span className="capitalize">
                                            Save
                                        </span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                        >
                            <hr className='mt-2 mb-2' />
                            <div style={{ display: "flex" }}>
                                <div style={{ flex: 1 }}>
                                    <Typography variant='body1'>Upload Sign Document</Typography>
                                </div>
                                <div style={{ flex: 2 }}>
                                    <input type="file"
                                        id="avatar" name="avatar"
                                        accept="pdf, xlsx, docx, ppt" />
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ValidatorForm >
    )
}
