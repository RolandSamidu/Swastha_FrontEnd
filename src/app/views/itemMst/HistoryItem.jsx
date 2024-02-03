import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle,
    ValidatorForm,
    DocumentLoader
} from "app/components/LoonsLabComponents";
import { CircularProgress, Grid, Tooltip, IconButton, Dialog, Divider, Typography,Radio,
    RadioGroup,
    FormControlLabel
 } from "@material-ui/core";

import InventoryService from "app/services/InventoryService";
import VisibilityIcon from '@material-ui/icons/Visibility'
import CloseIcon from '@material-ui/icons/Close';
import { dateParse } from "utils";
import { TextValidator } from 'react-material-ui-form-validator'
import { Autocomplete } from '@material-ui/lab'
import RichTextEditor from 'react-rte';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';



class HistoryItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: RichTextEditor.createValueFromString('', 'html'),
            loaded: true,
            printLoad:false,
            individualView: false,
            totalItems:null,
            popupLoaded:false,
            singleData:[],

            filterData: {
                page:0,
                limit:20,
                HISTORY:true,
                sr_no:null,
                // 'order[0]': ['version', 'DESC'],
                orderby_version: true

            },

            data: [],
            columns: [

                {
                    name: 'verson', // field name in the row object
                    label: 'Verson', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'updated_by', // field name in the row object
                    label: 'Updated By', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =  this.state.data[dataIndex]?.Update?.name
                                
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'updatedAt', // field name in the row object
                    label: 'Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =  dateParse(this.state.data[dataIndex]?.updatedAt)
                                
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'action',
                    label: 'Actions',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let itemdata = this.state.data[dataIndex];
                          console.log('itemdata',itemdata)
                            return (
                              <Grid container>
                                <Tooltip title="View Item">
                                  <IconButton
                                    onClick={() => {
                                      this.setState({
                                        individualView: true,
                                        singleData:itemdata,
                                      })
                                    }}
                                    className="px-2"
                                    size="small"
                                    aria-label="View Item"
                                    color="primary"
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            );
                          }
                          
                    },
                },
            ],


            alert: false,
            message: "",
            severity: 'success',
        }
    }




    async loadData() {
        this.setState({ loaded: false })

        let params = this.state.filterData
        params.sr_no = this.props.match.params.id


        let res = await InventoryService.fetchAllItems(params)
        if (res.status == 200) {
            console.log('cheking incom data', res.data.view.data)

            // this.getUOMByID(res.data.view.data)

            this.setState(
                {
                    loaded: true,
                    data: res.data.view.data,
                    totalItems: res.data.view.totalItems,
                },
            )
        }

    }

      // get uom info
//       async getUOMByID(idata){

//         let list = idata.map((i)=>i.id)

//         let params={
//             item_snap_id:list
//         }

//         const res = await InventoryService.GetUomById(params)

//             let updatedArray = []
//             if(res.status === 200) {

//             updatedArray = idata.filter((obj1) => {
//                 const obj2 = res.data.view.data.find((obj) => obj.ItemSnap?.id === obj1.id);

//                 obj1.uom = obj2?.UOM?.name

//                  return obj1;

//             });
//             idata = updatedArray;
//             }
//             console.log('cheking uom', idata)
//             this.setState(
//                 {
//                     ploaded: true,
//                     data: idata,
//                     printLoaded: true,
//                 },
//             )

// }


    componentDidMount() {
        this.loadData()
    }

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Item History" />

                        <Grid lg={12} className=" w-full mt-2" spacing={2} style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <div className="pt-0">
                                        <LoonsTable
                                            id={"History_items"}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: this.state.filterData.limit,
                                                page: this.state.filterData.page,
                                                onTableChange: (action, tableState) => {
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(tableState.page)
                                                            break;
                                                        case 'changeRowsPerPage':
                                                            let formaData = this.state.filterData;
                                                            formaData.limit = tableState.rowsPerPage;
                                                            this.setState({ formaData })
                                                            this.setPage(0)
                                                            break;
                                                        case 'sort':
                                                            break;
                                                        default:
                                                            console.log('action not handled.');
                                                    }
                                                }

                                            }
                                            }
                                        >
                                        </LoonsTable>
                                    </div>
                                    :
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                            }
                        </Grid>

                    </LoonsCard>
                </MainContainer>

                <Dialog
                    style={{
                        padding: '10px'
                    }}
                    maxWidth="lg"
                    fullWidth={true}
                    open={this.state.individualView}
                    onClose={() => {
                        // this.setState({individualView: false})
                    }}>
                    <div className="w-full h-full px-5 py-5">
                        <Grid container="container" className="w-full">
                            <Grid item="item" lg={12} md={12} xs={12} className="mb-4 w-full">
                                <LoonsCard>
                                    <Grid item="item" lg={12} md={12} xs={12} className="w-full">
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <CardTitle title="Item Details"></CardTitle>
                                            <Divider></Divider>
                                            <IconButton aria-label="close" onClick={() => { this.setState({ individualView: false }) }}><CloseIcon /></IconButton>
                                        </div>

                                    
                                    </Grid>
                                    <ValidatorForm>
                                    <Grid container className='w-full mt-5' style={{width:'100%'}}>
                                            
                                        <Typography variant="p" className="font-semibold">Item No: {this.state.singleData?.sr_no}</Typography>
                                        <Divider></Divider>
                                        <Grid className='mt-2' container spacing={2}>
                                            {/* Left top Section */}
                                            <Grid item xs={12} sm={12} md={9} lg={9}>
                                                
                                                 <Grid container spacing={2}>
                                                
                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                    {/* <div> */}
                                                        <SubTitle title="Verson" />
                                                        <Typography variant="P" className="mt-3">{this.state.singleData?.verson}</Typography>
                                                    {/* </div> */}
                                                    </Grid>

                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                        {/* <div> */}
                                                            <SubTitle title="Edit Date" />
                                                            <Typography variant="P" className="mt-3">{dateParse(this.state.singleData?.updatedAt)}</Typography>
                                                        {/* </div> */}
                                                    </Grid>

                                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                                        {/* <div> */}
                                                            <SubTitle title="Edit User " />
                                                            <Typography variant="P" className="mt-3">{this.state.singleData?.Update?.name}</Typography>
                                                        {/* </div> */}
                                                    </Grid>

                                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                                        <SubTitle title="Item Group" />

                                                      
                                                        <TextValidator
                                                            id="outlined-basic"
                                                            value={this.state.singleData?.Serial?.Group?.name}
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"

                                                            // disabled
                                                            style={{ color: 'black' }}
                                                            InputProps={{ style: { color: 'black' } }}
                                                        
                                                        />
                                                    </Grid>

                                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                                        <SubTitle title="Subgroup" />

                                                        <TextValidator
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            style={{ color: 'black' }}
                                                            InputProps={{ style: { color: 'black' } }}
                                                        />
                                                     
                                                    </Grid> 
                                                  
                                                 <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                                        <SubTitle title="UOM" />
                                                       
                                                                <TextValidator
                                                                    placeholder="UOM"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                    style={{ color: 'black' }}
                                                                
                                                                />
                                                        </Grid> 

                    
                                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                                        <SubTitle title="Strength/Size" />
                                                        <TextValidator
                                                            className=" w-full"
                                                            name="years"
                                                            InputLabelProps={{
                                                                shrink: false,
                                                            }}
                                                            value={this.state.singleData?.strength
                                                            }
                                                            disabled={true}
                                                            type="text"
                                                            variant="outlined"
                                                            size="small"
                                                            style={{ color: 'black' }}
                                                            InputProps={{ style: { color: 'black' } }}
                                                        
                                                        />
                                                    </Grid>
                                                
                                                
                                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                                        <SubTitle title="Previous Swastha SR" />
                                                        <TextValidator
                                                            className=" w-full"
                                                            name="previous_sr"
                                                            // InputLabelProps={{
                                                            //     shrink: false,
                                                            // }}
                                                            value={this.state.singleData?.previous_sr
                                                            }
                                                            disabled={true}
                                                            type="text"
                                                            variant="outlined"
                                                            size="small"
                                                            style={{ color: 'black' }}
                                                            InputProps={{ style: { color: 'black' } }}
                                                            
                                                        />
                                                    </Grid>
                                                    <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12} >
                                                        <SubTitle title="MS MIS SR" />
                                                        <TextValidator
                                                            className=" w-full"
                                                            // placeholder="MS MIS SR"
                                                            name="previous_system_sr"
                                                            // InputLabelProps={{
                                                            //     shrink: false,
                                                            // }}
                                                            value={this.state.formData?.previous_system_sr
                                                            }
                                                            disabled={true}
                                                            type="text"
                                                            variant="outlined"
                                                            size="small"
                                                            style={{ color: 'black' }}
                                                            InputProps={{ style: { color: 'black' } }}
                                                           
                                                        />
                                                    </Grid>




                                                </Grid>
                                            </Grid>
                                            <Grid item xs={3} sm={2} md={3} lg={3}>
                                                {/* <div> */}
                                                    <SubTitle title="Item Number" />
                                                    <Typography variant="h5" className="mt-3 font-semibold">{this.state.singleData?.sr_no}</Typography>
                                                {/* </div> */}
                                            </Grid>
                                        </Grid>
                                        <div className='mt-3'></div>
                                        <Divider></Divider>

                                        <Grid className='mt-3' container spacing={2}>
                                      
                                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title="Short Description" />
                                                <TextValidator
                                                    className=" w-full"
                                                    // placeholder="Short Description"
                                                    name="short_description"
                                                    // InputLabelProps={{
                                                    //     shrink: false,
                                                    // }}
                                                    value={this.state.singleData?.short_description
                                                    }
                                                    disabled={true}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                   
                                                    style={{ color: 'black' }}
                                                    InputProps={{ style: { color: 'black' } }}
                                            
                                                />
                                            </Grid>


                                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title="Medium Description" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Medium Description"
                                                    // InputLabelProps={{
                                                    //     shrink: false,
                                                    // }}
                                                    value={this.state.singleData?.medium_description
                                                    }
                                                    disabled={true}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                   
                                                    style={{ color: 'black' }}
                                                    InputProps={{ style: { color: 'black' } }}
                                                
                                                />
                                            </Grid>

                                             <Grid item xs={12} sm={12} md={12} lg={12}>
                                                <SubTitle title="Specification" />
                                               
                                                <RichTextEditor
                                                    //className="react-rte-itemMaster"
                                                    value={RichTextEditor.createValueFromString(this.state.singleData.specification, 'html')}
                                                    readOnly={true}
                                                    onChange={(value) => {

                                                       /*  let formData = this.state.formData
                                                        formData.specification = value.toString('html')
                                                        this.setState({ formData, value })
                                                        console.log("values", formData.specification)
 */
                                                    }}
                                                />
                                               
                                               {/*  <TextValidator
                                                    className=" w-full"
                                                    // placeholder="Note"
                                                    name="Specification"
                                                    // InputLabelProps={{
                                                    //     shrink: false,
                                                    // }}
                                                    value={this.state.singleData.specification
                                                    }
                                                    disabled={true}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    multiline
                                                    rows={3}
                                                   
                                                    style={{ color: 'black' }}
                                                    InputProps={{ style: { color: 'black' } }}
                                                
                                                /> */}
                                            </Grid>

                                             <Grid item xs={12} sm={12} md={12} lg={12}>
                                                <SubTitle title="Note" />
                                                <TextValidator
                                                    className=" w-full"
                                                    // placeholder="Note"
                                                    name="note"
                                                    // InputLabelProps={{
                                                    //     shrink: false,
                                                    // }}
                                                    value={this.state.singleData.note
                                                    }
                                                    disabled={true}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    multiline
                                                    rows={3}
                                                   
                                                    style={{ color: 'black' }}
                                                    InputProps={{ style: { color: 'black' } }}
                                                
                                                />
                                            </Grid>

                                        </Grid>
                                                    
                                    </Grid>

                                <Grid className='mt-3' container spacing={2}>
                               

                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                <LoonsCard className="mt-3">
                                        <Typography variant="p" className="font-semibold">Other Details</Typography>
                                        <Divider></Divider>
                                        <MuiThemeProvider >
                                        <Grid className='mt-3' container spacing={2}>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Primary WH" />

                                                        <TextValidator
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={this.state.singleData?.Warehouse?.name
                                                            }
                                                           
                                                            style={{ color: 'black' }}
                                                            InputProps={{ style: { color: 'black' } }}
                                                        />
                                                
                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Item Type" />

                                                    <TextValidator
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        style={{ color: 'black' }}
                                                        value={this.state.singleData?.type
                                                        }
                                                        InputProps={{ style: { color: 'black' } }}
                                                    />
                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Institution Level" />

                                                    <TextValidator
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        style={{ color: 'black' }}
                                                        value={this.state.singleData?.Institution?.name
                                                        }
                                                        InputProps={{ style: { color: 'black' } }}
                                                    />

                                            </Grid>

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Consumables" />
                                                <RadioGroup row className='mt-3'>
                                                    
                                                        <FormControlLabel
                                                            label={'Yes'}
                                                            name="consumables"
                                                            value={'Yes'}
                                                            // style={{color : 'black'}}
                                                            //  control={this.StyledRadio}
                                                            
                                                            control={
                                                                <Radio color="secondary" size='small' />
                                                                
                                                            }
                                                            disabled={true}
                                                            
                                                            display="inline"
                                                            checked={this.state.singleData?.consumables == 'Y' ? true : false
                                                            }
                                                            style={{ color: 'black' }}
                                                            InputProps={{ style: { color: 'black' } }}
                                                            
                                                            
                                                        />  
                                                   
                                                    
                                                    <FormControlLabel
                                                        label={'No'}
                                                        name="consumables"
                                                        value={'No'}
                                                       
                                                        control={
                                                            <Radio color="secondary" size='small' />
                                                        }
                                                        disabled={true}
                                                        display="inline"
                                                        checked={
                                                            this.state.singleData?.consumables == 'N' ? true : false
                                                        }
                                                        style={{ color: 'black' }}
                                                        InputProps={{ style: { color: 'black' } }}
                                                    />
                                                    
                                                </RadioGroup>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title="Storage" />

                                                    <TextValidator
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        style={{ color: 'black' }}
                                                        InputProps={{ style: { color: 'black' } }}
                                                    />
                                            
                                            </Grid>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Used for Estimate" />
                                                <RadioGroup row className='mt-3'> 
                                                
                                                    <FormControlLabel
                                                        label={'Yes'}
                                                        name="used_for_estimates"
                                                        value={'Yes'}
                                                       
                                                        disabled={true}
                                                        control={
                                                            <Radio color="secondary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={this.state.singleData?.used_for_estimates == 'Y' ? true : false
                                                        }
                                                        style={{ color: 'black' }}
                                                        InputProps={{ style: { color: 'black' } }}
                                                    />

                                                    <FormControlLabel
                                                        label={'No'}
                                                        name="used_for_estimates"
                                                        value={'No'}
                                                       
                                                        disabled={true}
                                                        control={
                                                            <Radio color="secondary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={
                                                            this.state.singleData?.used_for_estimates == 'N' ? true : false
                                                        }
                                                        style={{ color: 'black' }}
                                                        InputProps={{ style: { color: 'black' } }}
                                                    />
                                                    
                                                </RadioGroup>
                                            </Grid>
                                            

                                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title="Standard Cost(Tentative)" />
                                                <TextValidator
                                                    className=" w-full"
                                                    // placeholder="Standard Cost "
                                                    name="standard_cost"
                                                    // InputLabelProps={{
                                                    //     shrink: false,
                                                    // }}
                                                    value={this.state.singleData?.standard_cost}
                                                    type="number"
                                                    disabled={true}
                                                    variant="outlined"
                                                    size="small"
                                                   
                                                    style={{ color: 'black' }}
                                                    InputProps={{ style: { color: 'black' } }}
                                               
                                                />
                                            </Grid>
                                           

                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Formulatory Approved" />
                                                <RadioGroup row className='mt-3'>
                                                    <FormControlLabel
                                                        label={'Yes'}
                                                        name="formulatory_approved"
                                                        value={'Yes'}
                                                     
                                                        control={
                                                            <Radio color="secondary" size='small' />
                                                        }
                                                        disabled={true}
                                                        display="inline"
                                                        checked={this.state.singleData?.formulatory_approved == 'Y' ? true : false
                                                        }
                                                    />

                                                    <FormControlLabel
                                                        label={'No'}
                                                        name="formulatory_approved"
                                                        value={'No'}
                                                        
                                                        disabled={true}
                                                        control={
                                                            <Radio color="secondary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={
                                                            this.state.singleData?.formulatory_approved == 'N' ? true : false
                                                        }
                                                    />
                                                </RadioGroup>
                                            </Grid>


                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Item Usage Type" />

                                                    <TextValidator
                                                    
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        style={{ color: 'black' }}
                                                        InputProps={{ style: { color: 'black' } }}
                                                    />
                                                    
                                            </Grid>


                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="Used for Formulation" />
                                                <RadioGroup row className='mt-3'>
                                                    <FormControlLabel
                                                        label={'Yes'}
                                                        name="used_for_formulation"
                                                        value={'Yes'}
                                                        style={{color : 'black'}}
                                                        disabled={true}
                                                      
                                                        control={
                                                            <Radio color="secondary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={this.state.singleData?.used_for_formulation == 'Y' ? true : false
                                                        }
                                                    />

                                                    <FormControlLabel
                                                        label={'No'}
                                                        name="used_for_estimates"
                                                        value={'No'}
                                                        style={{color : 'black'}}
                                                        
                                                        disabled={true}
                                                        control={
                                                            <Radio color="secondary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={
                                                            this.state.singleData?.used_for_formulation == 'N' ? true : false
                                                        }
                                                    />
                                                </RadioGroup>
                                            </Grid>
                                            <Grid className=" w-full" item lg={6} md={6} sm={12} xs={12} >
                                                <SubTitle title="VEN" />

                                                        <TextValidator
                                                        
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={this.state.singleData?.VEN?.name
                                                            }
                                                           
                                                            style={{ color: 'black' }}
                                                            InputProps={{ style: { color: 'black' } }}
                                                        />
                                                   
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                                <SubTitle title=" Shelf Life(In Months)" />
                                                <TextValidator
                                                    className=" w-full"
                                                    // placeholder="Shelf Life(In Months)"
                                                    name="shelf_life"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={this.state.singleData?.shelf_life
                                                    }
                                                    disabled={true}
                                                    style={{ color: 'black' }}
                                                    InputProps={{ style: { color: 'black' } }}
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                              
                                              
                                                 />
                                            </Grid> 

                                        </Grid>
                                        </MuiThemeProvider>
                                    </LoonsCard>

                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                

                                <LoonsCard className="mt-3">
                                        <Typography variant="p" className="font-semibold">Appearance</Typography>
                                        <Divider></Divider>
                                        <Grid className='mt-3' container spacing={2}>
                                          

                                            <Grid item xs={12} sm={12} md={6} lg={6}>

                                                <SubTitle title="Common Name" />
                                                <TextValidator
                                                 disableClearable
                                                    className=" w-full"
                                                    placeholder="Common Name"
                                                    name="common_name"
                                                    style={{ color: 'black' }}
                                                    InputProps={{ style: { color: 'black' } }}
                                                    value={this.state.singleData?.common_name
                                                    }
                                                    disabled={true}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    
                                               
                                                />
                                            </Grid>

                                        



                                        </Grid>

                                    </LoonsCard>
                                </Grid>

                            </Grid>
                                    </ValidatorForm>
                                </LoonsCard>
                            </Grid>
                        </Grid>

                        
                        
                    </div>

                </Dialog>

            </Fragment>
        );
    }
}

export default HistoryItems
