import React, { Component, Fragment } from "react";
import {
    LoonsTable,
    LoonsCard,
    MainContainer,
    SubTitle,
} from "app/components/LoonsLabComponents";
import { Grid, CircularProgress, Typography } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import WarehouseServices from 'app/services/WarehouseServices'
import { Warehouse } from "@mui/icons-material";
import InventoryService from 'app/services/InventoryService'
import Card from '@mui/material/Card';
import { withStyles } from '@material-ui/styles';

const styles = {
    textValue: {
        fontWeight: 600
    },
    card: {
        padding: 5,
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#c1c1be',
        height: '100%'
    },
    cardRoot: {
        padding: 2,
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#c1c1be',
        height: '100%'
    },
    cardCenterAlign: {
        padding: 5,
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#c1c1be',
        height: '100%',
        color: '#fdfdfd',
        textAlign: 'center',
        justifyContent: 'center',
        display: 'flex'
    },
    cardCenterAlignFixHeight: {
        padding: 5,
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#c1c1be',
        height: '100%',
        color: '#c10000',
        textAlign: 'center',
        justifyContent: 'center',
        display: 'flex',
        width: 33,
        height: 33,
        marginLeft: 3,
        marginRight: 3,
        alignItems: 'center'
    },
    cardCenterAlignFixHeightPrice: {
        padding: 5,
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#c1c1be',
        height: '100%',
        color: '#c10000',
        textAlign: 'center',
        justifyContent: 'center',
        display: 'flex',
        
        height: 33,
        marginLeft: 3,
        marginRight: 3,
        alignItems: 'center'
    }

}

class StockInquiryItemDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            totalItems: null,
            dataObj: {},

            formData: {
                page: 0,
            },

            data: [],
            columns: [
                {
                    name: 'oldSr',
                    label: 'Old SR',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.previous_sr
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'group',
                    label: 'Group',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.Serial?.Group?.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.sr_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'ven',
                    label: 'VEN',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.VEN?.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'abc',
                    label: 'ABC',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.AbcClass?.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'cr',
                    label: 'C/R',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.ItemType?.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'level',
                    label: 'Level',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.Institution?.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'item',
                    label: 'Name',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.medium_description
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'unit',
                    label: 'Unit',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.ItemUOM[0]?.UOM?.name
                            return <p>{data}</p>
                        },

                    },
                },
                {
                    name: 'stdCost',
                    label: 'Std Cost (Rs)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.standard_cost
                            return <p>{data}</p>
                        },
                    },
                },
            ]
        }
    }

    async getItemDetails() {

        let id = this.props.item_id

        let res = await InventoryService.fetchItemById({}, id)

        if (res.status === 200) {
            console.log('cheking info', res)

            this.setState({
                data: [res.data.view],
                dataObj: res.data.view
            }, () => {
                setTimeout(() => {
                    this.setState({
                        loaded: true
                    })
                }, 300);
            })
        }
    }

    componentDidMount() {
        this.getItemDetails()
    }

    renderSubTitle(title) {
        return <Typography className="font-semibold text-13 mt-1 mb-1" style={{ lineHeight: '1', color: 'gray' }}>{title}</Typography>
    }

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                {this.state.loaded ?
                    <div className="w-full">
                        <Grid container spacing={1}>
                            <Grid className="px-1 py-1" item lg={2} md={2} xs={12}  >
                                <div className={classes.card} style={{ backgroundColor: '#ffeb00' }}>
                                    {this.renderSubTitle("New SR Number")}
                                    <Typography className={classes.textValue} variant="p">{this.state.data[0]?.sr_no}</Typography>
                                </div>

                            </Grid>


                            <Grid className="px-1 py-1" item lg={5} md={5} xs={12} >
                                <div className={classes.card} style={{ backgroundColor: '#a3d3b1' }}>
                                    {this.renderSubTitle("Item Name")}
                                    <Typography className={classes.textValue} variant="p">{this.state.data[0]?.medium_description}</Typography>
                                </div>
                            </Grid>



                            <Grid className="px-1 py-1" item lg={1} md={1} xs={12} >
                                <div className={classes.card} style={{ backgroundColor: '#b0b9e9' }}>
                                    {this.renderSubTitle("UOM")}
                                    <Typography className={classes.textValue} variant="p">{this.state.data[0]?.ItemUOM[0]?.UOM?.description}</Typography>
                                </div>
                            </Grid>

                            <Grid className="px-1 py-1 h-full" item lg={4} md={4} xs={3} >
                                <div className={classes.cardRoot} style={{ backgroundColor: '#dfdfdf' }}>
                                    <Grid container>
                                        <Grid className="px-1 py-1" item lg={3} md={3} xs={12} >
                                            <div className={classes.cardCenterAlign} style={{ backgroundColor: '#cb0f0f' }}>
                                                <Typography variant="h5">{this.state.data[0]?.VEN?.name}</Typography>
                                            </div>
                                        </Grid>
                                        <Grid className="px-1 py-1" item lg={3} md={3} xs={12} >
                                            <div className={classes.cardCenterAlign} style={{ backgroundColor: '#076c00' }}>
                                                <Typography variant="h5">{this.state.data[0]?.AbcClass?.name}</Typography>
                                            </div>
                                        </Grid>
                                        <Grid className="px-1 py-1" item lg={3} md={3} xs={12} >
                                            <div className={classes.cardCenterAlign} style={{ backgroundColor: '#f5c206' }}>
                                                <Typography variant="h5">{this.state.data[0]?.ItemType?.name}</Typography>
                                            </div>
                                        </Grid>
                                        <Grid className="px-1 py-1" item lg={3} md={3} xs={12} >
                                            <div className={classes.cardCenterAlign} style={{ backgroundColor: '#0048CB' }}>
                                                <Typography variant="h5">{this.state.data[0]?.VEN?.name}</Typography>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>

                        </Grid>


                        <Grid container className="w-full" spacing={2}>

                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography className={classes.textValue} variant="p">Priority</Typography>

                                <div className={classes.cardCenterAlignFixHeight} style={{ backgroundColor: '#d5d3c5' }}>
                                    <Typography className={classes.textValue} variant="p">{this.state.dataObj?.priority == 'No' ? "N" : "Y"}</Typography>
                                </div>
                            </Grid>

                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography className={classes.textValue} variant="p">Estimated Item</Typography>

                                <div className={classes.cardCenterAlignFixHeight} style={{ backgroundColor: '#d5d3c5' }}>
                                    <Typography className={classes.textValue} variant="p">{this.state.dataObj?.used_for_estimates}</Typography>
                                </div>
                            </Grid>
                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography className={classes.textValue} variant="p">Formulary Approved </Typography>

                                <div className={classes.cardCenterAlignFixHeight} style={{ backgroundColor: '#d5d3c5' }}>
                                    <Typography className={classes.textValue} variant="p">{this.state.dataObj?.formulatory_approved}</Typography>
                                </div>
                            </Grid>
                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography className={classes.textValue} variant="p">Used for Formulary </Typography>

                                <div className={classes.cardCenterAlignFixHeight} style={{ backgroundColor: '#d5d3c5' }}>
                                    <Typography className={classes.textValue} variant="p">{this.state.dataObj?.used_for_formulation}</Typography>
                                </div>
                            </Grid>
                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography className={classes.textValue} variant="p">Consumable </Typography>

                                <div className={classes.cardCenterAlignFixHeight} style={{ backgroundColor: '#d5d3c5' }}>
                                    <Typography className={classes.textValue} variant="p">{this.state.dataObj?.consumables}</Typography>
                                </div>
                            </Grid>
                        </Grid>


                        <Grid container className="w-full" spacing={2}>
                            <Grid item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography className={classes.textValue} variant="p">Latest Standard Cost</Typography>

                                <div className={classes.cardCenterAlignFixHeightPrice}>
                                    <Typography className={classes.textValue} variant="p">Rs. {this.state.data[0]?.standard_cost||0 }</Typography>
                                </div>
                            </Grid>
                        </Grid>


                    </div>

                    :
                    <Grid className="justify-center text-center w-full pt-12">
                        <CircularProgress size={30} />
                    </Grid>
                }



            </Fragment>
        );
    }
}

export default withStyles(styles)(StockInquiryItemDetails)
