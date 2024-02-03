import React, { Component, Fragment } from "react";
import {
    LoonsTable,
    LoonsCard,
    MainContainer,
} from "app/components/LoonsLabComponents";
import { Grid, CircularProgress } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import  WarehouseServices  from 'app/services/WarehouseServices'
import { Warehouse } from "@mui/icons-material";
import  InventoryService  from 'app/services/InventoryService'
import Card from '@mui/material/Card';


class StockInquiryItemDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            totalItems:null,
            dataObj:{},

            formData:{
                page:0,
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

    async getItemDetails(){

        let id = this.props.sr_no

        let res = await InventoryService.fetchItemById({} , id)

        if (res.status === 200){
            console.log('cheking info', res)

            this.setState({
                data:[res.data.view],
                dataObj:res.data.view
            },()=>{
                setTimeout(() => {
                    this.setState({
                        loaded:true
                    })
                }, 300);
            })
        }
    }

    componentDidMount() {
        this.getItemDetails()
    }

    render() {
        return (
            <Fragment>
                <Grid container className="px-main-4 m-1 w-full">
                    <Card className="p-3 w-full">
                    <ValidatorForm >
                       {/* <fieldset style={{ borderWidth: 1, borderRadius: 5, borderColor: '#0000FF', borderStyle: 'solid', width:'100%', margin: 2}}> */}
                            <legend style={{alignSelf: 'center', fontWeight:'bold', border:'1px solid #FFD700 ', borderRadius: 10, paddingLeft:10, backgroundColor:'#FFD700' }}>Item</legend>
                            <Grid container>
                                <Grid item xs={12}>
                                    {this.state.loaded ?
                                    <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'suggested'} 
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: false,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: 20,
                                        page: this.state.formData.page,
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    this.setSuggestedPage(tableState.page)
                                                    break
                                                case 'sort':
                                                    //this.sort(tableState.page, tableState.sortOrder);
                                                    break
                                                default:
                                                    console.log('action not handled.')
                                            }
                                        }
                                    }}></LoonsTable>
                                    :
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                    }
                                </Grid>
                            </Grid>
                            
                            <Grid container className="w-full" spacing={2}>
                                <Grid item sm={12} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                    <p>Estimated Item </p>
                                    <input
                                        value={this.state.dataObj?.used_for_estimates}
                                        type="text"
                                        style={{ width: '20px', textAlign:'center', marginLeft:'5px' }}
                                    />
                                </Grid>
                                <Grid item sm={12} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                    <p>Formulary Approved </p>
                                    <input
                                        value={this.state.dataObj?.formulatory_approved}
                                        type="text"
                                        style={{ width: '20px', textAlign:'center', marginLeft:'5px' }}
                                    />
                                </Grid>
                                <Grid item sm={12} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                    <p>Used for Formulary </p>
                                    <input
                                        value={this.state.dataObj?.used_for_formulation}
                                        type="text"
                                        style={{ width: '20px', textAlign:'center', marginLeft:'5px' }}
                                    />
                                </Grid>
                                <Grid item sm={12} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                    <p>Consumable </p>
                                    <input
                                        value={this.state.dataObj?.consumables}
                                        type="text"
                                        style={{ width: '20px', textAlign:'center', marginLeft:'5px' }}
                                    />
                                </Grid>
                            </Grid>
                        
                            
                        {/* </fieldset> */}
                        </ValidatorForm>
                        </Card>
                 </Grid>
                 </Fragment>
        );
    }
}

export default StockInquiryItemDetails
