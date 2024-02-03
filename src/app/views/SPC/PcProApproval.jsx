import React, { Component, Fragment } from "react";
import { CardTitle, LoonsCard, SubTitle} from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import { LoonsTable, Button, DatePicker } from "app/components/LoonsLabComponents";
import { ValidatorForm, TextValidator  } from "react-material-ui-form-validator";
import { CircularProgress, Grid, Tooltip, IconButton, Checkbox } from "@material-ui/core";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import RichTextEditor from 'react-rte';

class PcProApproval extends Component{
    constructor(props){
        super(props)
        this.state = {
            value: RichTextEditor.createEmptyValue(),
            loading: true,
            formData: {
                note1: '',
                note2: '',
                note3: '',
            },
            columns_for_table1: [
                {
                    name: 'action', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        sort: false,
                        width: 10,
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data_for_table1[dataIndex].id;
                            return (
                                <Grid className="flex items-center">
                                    
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                /* onClick={() => {
                                                    window.location.href = `/consignments/msdAd/view-consignment/${id}`
                                                }} */>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    
                                </Grid>
                            );
                        }
                    }
                },
                {
                    name: 'sr', // field name in the row object
                    label: 'SR', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="sr"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data_for_table1[dataIndex].sr}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data_for_table1;
                                                data[dataIndex].sr = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'item_name', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="item_name"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data_for_table1[dataIndex].item_name}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data_for_table1;
                                                data[dataIndex].item_name = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'priority_level', // field name in the row object
                    label: 'Priority Level', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="priority_level"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data_for_table1[dataIndex].priority_level}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data_for_table1;
                                                data[dataIndex].priority_level = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'qty', // field name in the row object
                    label: 'Qty', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="qty"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data_for_table1[dataIndex].qty}
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data_for_table1;
                                                data[dataIndex].qty = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'estimated_item_price', // field name in the row object
                    label: 'Estimated Item Price', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="estimated_item_price"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data_for_table1[dataIndex].estimated_item_price}
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data_for_table1;
                                                data[dataIndex].estimated_item_price = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
                {
                    name: 'estimated_total_cost', // field name in the row object
                    label: 'Estimated Total Cost (LKR) M', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) =>  {
                            return (
                                <>
                                    <div>
                                        <TextValidator
                                            className=" w-full"
                                            
                                            name="estimated_total_cost"
                                            
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.data_for_table1[dataIndex].estimated_total_cost}
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data_for_table1;
                                                data[dataIndex].estimated_total_cost = e.target.value;
                                                this.setState({
                                                    data
                                                })
                                            
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    }
                },
            ],
            data_for_table1: [
                {sr: '1205512', item_name: 'sample item name', priority_level: 'high', qty: '4', estimated_item_price: '850', estimated_total_cost: '120'},
                {sr: '1205512', item_name: 'sample item name', priority_level: 'high', qty: '4', estimated_item_price: '850', estimated_total_cost: '120'},
                {sr: '1205512', item_name: 'sample item name', priority_level: 'high', qty: '4', estimated_item_price: '850', estimated_total_cost: '120'}
            ],
            
        }
    }

    onChange = (value) => {
        this.setState({value});
        if (this.props.onChange) {
          // Send the changes up to the parent component as an HTML string.
          // This is here to demonstrate using `.toString()` but in a real app it
          // would be better to avoid generating a string on each change.
          this.props.onChange(
            value.toString('html')
          );
        }
      };

    render(){
        return(
            <MainContainer>
                <LoonsCard>
                    
                    <ValidatorForm>
                        
                    <div  style={{
                        display: 'flex',
                        alignItems: 'left',
                        justifyContent: 'space-between',
                        marginTop:'15px'
                    }}>
                        <CardTitle title={"Procurement Ref No: 1245"} />
                        <div>
                        <Grid item lg={12} md={4} sm={6} xs={12}>
                            <label style={{marginTop:'30px'}}>Order List No:2022/SPC/X/R/P/0306</label>
                        </Grid>
        
                    <div style={{
                        display: 'flex',
                        alignItems: 'left',
                        justifyContent: 'space-between',
                    }}> 
                    <Grid item lg={12} md={4} sm={6} xs={12}>
                    <label >Authority Level:</label>
                    <LoonsButton style={{width:'50%' ,marginLeft:'10px'}}>DPC-minor</LoonsButton>
                    </Grid>
                    </div>
                    </div>
                    </div>
                        
                            {/* Table Section */}
                            <Grid container="container" className="mt-3 pb-5">
                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.loading
                                            ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data_for_table1} columns={this.state.columns_for_table1} options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: 10,
                                                page: this.state.page,
                                                onTableChange: (action, tableState) => {
                                                    console.log(action, tableState)
                                                    switch (action) {
                                                        case 'changePage':
                                                            // this.setPage(     tableState.page )
                                                            break
                                                        case 'sort':
                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                            break
                                                        default:
                                                            console.log('action not handled.')
                                                    }
                                                }
                                            }}></LoonsTable>
                                            : (
                                                //loading effect
                                                <Grid className="justify-center text-center w-full pt-12">
                                                    <CircularProgress size={30} />
                                                </Grid>  
                                            )
                                    }
                                </Grid>
                            </Grid>

                            <Grid Container="container" className="w-full flex justify-end my-12">
                            <SubTitle title="Total Procurement Value: LKR 395.11 M" />
                        </Grid>

                        <hr/>
                        
                        <Grid container spacing={2}>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={"Supervisor Acknowledgment"}></SubTitle>
                                <SubTitle title={"Note :"}></SubTitle> 
                                <TextValidator
                                    className='w-full'
                                    placeholder="Note"
                                    fullWidth
                                    name="note1"
                                    multiline
                                    rows={4}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .note1
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.note1 = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={"Procurement Officer"}></SubTitle>
                                <SubTitle title={"Note :"}></SubTitle> 
                                <TextValidator
                                    className='w-full'
                                    placeholder="Note"
                                    fullWidth
                                    name="note1"
                                    multiline
                                    rows={4}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .note1
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.note1 = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={"Manager Imports"}></SubTitle>
                                <SubTitle title={"Note :"}></SubTitle> 
                                <TextValidator
                                    className='w-full'
                                    placeholder="Note"
                                    fullWidth
                                    name="note1"
                                    multiline
                                    rows={4}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .note1
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.note1 = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>
                        </Grid>

                        <hr/>      
                        <br/>
                        <Grid container spacing={2} className="justify-center">
                            
                            <Grid item lg={10} md={10} sm={12} xs={12}>
                                <h3 style={{textAlign:"center"}}>Procurement Committee Approval</h3>
                                <RichTextEditor
                                    style={{
                                        rows: 10,
                                        minHeight: '150px',
                                        marginBottom: 2
                                      }}
                                    value={this.state.value}
                                    onChange={this.onChange}
                                />
                            </Grid>
                            
                    
                                <Grid container >
                                    <SubTitle title="I Agree to Above Decision, " />
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox color="primary"/>} label="Yes" />
                                        <FormControlLabel control={<Checkbox color="primary"/>} label="No" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br/>
                        <Grid container spacing={2} >
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={"Chairman"}></SubTitle>
                                <p>M.P.Kumar</p>
                                <h4>MySignature</h4>
                                <p> 21/05/2022</p>
                                <p> 08.30 AM</p>
                            </Grid>
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={"Member 01"}></SubTitle>
                                <p>M.P.Kumar</p>
                                <h4>"MySignature</h4>
                                <p> 21/05/2022</p>
                                <p> 08.30 AM</p>
                            </Grid>
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={"Member 02"}></SubTitle>
                                <p>M.P.Kumar</p>
                                <h4>MySignature</h4>
                                <p> 21/05/2022</p>
                                <p> 08.30 AM</p> 
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className="flex">
                            <Grid item lg={4} md={4} sm={12} xs={12}>
                                <SubTitle title={"Procurement Committee Decision Authorization"}></SubTitle>
                            </Grid>
                        </Grid>
                        
                        <Grid container spacing={2} className="flex">
                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                <p>I agree with the above "PC Name" decision</p>
                            </Grid>
                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                <TextValidator
                                    className='w-full'
                                    placeholder="Add any Notes here"
                                    fullWidth
                                    name="note1"
                                    multiline
                                    rows={3}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state
                                            .formData
                                            .note1
                                    }
                                    onChange={(e, value) => {
                                        let formData = this.state.formData;
                                        formData.note1 = e.target.value
                                        this.setState({ formData })

                                    }}
                                    validators={[
                                        'required',
                                    ]}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>
                            <Grid item>
                            <Button
                                    className="mr-2 mt-7"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={false}
                                >
                                    <span className="capitalize">Add Signature</span>
                                </Button>
                            </Grid>
                        </Grid>

                        <hr/> 

                        <br/>

                        <Grid container spacing={2} className="flex">
                            <Grid item className="w-full flex justify-end my-12">
                            <Button
                                    className="mr-2 mt-7"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={false}
                                    endIcon="download"
                                >
                                    <span className="capitalize">Download</span>
                                </Button>
                            </Grid>
                            
                            <Grid container spacing={2} className="space-between">
                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                    <SubTitle title={"Upload Authorized Document"}></SubTitle>
                                </Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <input type="file" />
                                </Grid>
                            </Grid>
                        </Grid>
                            
                        </ValidatorForm>
                </LoonsCard>
            </MainContainer>
        )
    }
}

export default PcProApproval