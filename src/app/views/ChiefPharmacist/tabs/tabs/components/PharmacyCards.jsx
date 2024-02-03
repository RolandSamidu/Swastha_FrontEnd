import { Card, Divider, Grid, Typography } from "@material-ui/core";
import { CardTitle, LoonsCard } from "app/components/LoonsLabComponents";
import React from "react";
import { Component } from "react";


class PharmacyCards extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: 'Clinical Pharmacy',
            approved: 10,
            rejected: 5

        }
    }

    render() {

        console.log("drugstore",this.props);
        return (
            <Card elevation={6} className="px-main-card py-3 mb-6 mt-6 ml-2 mr-2" style={{minWidth: 'max-content'}}> 
                <Typography variant="h6" style={{textAlign: 'center',fontWeight: 600}}>{this.props.data.name}</Typography>
                <Divider />
                <Grid container spacing={3} style={{display:'flex',flexWrap: 'nowrap',justifyContent:'center'}}>
                {this.props.data.statuses.map(stat => 
                     <>
                    <Grid item lg={6} xs={6} md={6}>
                        <Grid container spacing={0}>
                             <Grid item xs={12} style={{display:'flex',alignItems: 'flex-end',justifyContent:'center'}}>
                                <Typography variant="h6" >
                                    {stat.total}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{display:'flex',alignItems: 'flex-end',justifyContent:'center'}}>
                                <Typography variant="h6" >
                                     {stat.status == "rejected" ? 'Rejected' : stat.status == "active" ? 'Active' : stat.status == "issued" ? 'Issued' : stat.status == "approved" ? "Approved" :stat.status == "ordered" ? "Ordered" :stat.status == "pending" ? "Pending" :'Allocated'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    </>
                )}
                    {/* <Grid item lg={6} xs={6} md={6}>
                        <Grid container spacing={0}>
                            <Grid item xs={12} style={{display:'flex',alignItems: 'flex-end'}}>
                                <Typography variant="h3" >
                                {this.props.data.statuses[1].total}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" >
                                    Rejected
                                {this.props.data.statuses[1].status == "Rejected" ? 'Rejected' : this.props.data.statuses[0].status == "active" ? 'Active' : 'Allocated'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid> */}
                </Grid>
            </Card>
        )
    }
}

export default PharmacyCards