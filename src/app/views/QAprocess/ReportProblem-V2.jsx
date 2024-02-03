import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import Dialog from '@material-ui/core/Dialog'
import CloseIcon from '@material-ui/icons/Close'
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    CircularProgress,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Typography,
    Box,
    Tabs,
    Tab,
    Checkbox,
} from '@material-ui/core'
import { dateParse, roundDecimal } from 'utils'
import moment from 'moment'
import UploadIcon from '@mui/icons-material/Upload';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PrintIcon from '@mui/icons-material/Print';
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
    FilePicker,
} from 'app/components/LoonsLabComponents'
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import { TextField } from '@mui/material'
import AddIcon from '@material-ui/icons/Add';

//services used
import PharmacyService from 'app/services/PharmacyService'
import WarehouseServices from 'app/services/WarehouseServices'
import QualityAssuranceService from 'app/services/QualityAssuranceService'
import EmployeeServices from 'app/services/EmployeeServices'
import InventoryService from 'app/services/InventoryService'
import localStorageService from "app/services/localStorageService";


class ReportProblem extends Component {


    constructor(props) {

        super(props);
        this.state = {
            loaded: false,
            data: [],
            data2: [],
            itemLoaded: false,
            left: [],
            right: [],
            checked: [],
            totalQty: [],
            itembatchdata: [],
            otherText: true,
            totalListItems: 0,
            totalListPages: 0,
            selected_value: null,
            // totalItems: 0,
            totalPages: 0,
            totalItems: 0,
            showDetails: false,
            addDailogView: false,
            filterData: {
                warehouse_id: this.props.id,
                limit: 20,
                page: 0,
                search: null,
                ven: null,
                category_name: null,
                group: null,
                class_name: null,
                serial_code: null,
            },
            selectedData: [],
            sr_no: [],
            all_defects: [],
            empData: [],
            file: { fileList: [] },
            formData: {
                log_date: null,
                item_batch_id: null,
                complaint_by: null,
                complain_date: null,
                defects: null,
                defect_id: null,
                storage_conditions: null,
                remarks: null,
                owner_id: null,
                log_created_by: null,
                batch_no:null
            },
            columns1: [
                // {
                //     name: 'Action', // field name in the row object
                //     label: 'Checkbox', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <Grid>
                //                     <FormControlLabel
                //                         //label={field.placeholder}
                //                         //name={field.}
                //                         //value={val.value}
                //                         // checked={this.state.data[tableMeta.rowIndex].selected= 'Selected'}
                //                         // disabled={this.state.data[tableMeta.rowIndex].selected= 'Selected' ? true :false}
                //                         onChange={(event) => {
                //                             let data = this.state.data[tableMeta.rowIndex];
                //                             if(event.target.checked === true){
                //                                 // data.selected = 'Selected';
                //                                 // this.setState({data})
                //                                 this.selectedRows(data,true)


                //                             }else
                //                             {
                //                                 // data.selected = null;
                //                                 this.selectedRows(data,false)
                //                                 // this.setState({data})
                //                                 // data[tableMeta.rowIndex].selected = null;
                //                                 // console.log("selected2",data)

                //                             }


                //                         }}
                //                         control={
                //                             <Checkbox
                //                                 color="primary"
                //                                 // defaultChecked={this.state.data[tableMeta.rowIndex].selected}
                //                                 size="small"
                //                             />
                //                         }
                //                         display="inline"

                //                     />


                //                 </Grid>
                //             );
                //         },
                //     },
                // }, 
                {
                    name: 'batch_no',
                    label: 'Batch No',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.ItemSnapBatch?.batch_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'exd',
                    label: 'Expire Date',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.ItemSnapBatch?.exd
                            return <p>{dateParse(data)}</p>
                        },
                    },
                },
                {
                    name: 'manufacturer',
                    label: 'Manufacturer',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.ItemSnapBatch?.Manufacturer?.name
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'mfd',
                    label: 'Manufactured Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(moment(value))
                        },
                    },
                },
                {
                    name: 'pack_size',
                    label: 'Pack Size',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.ItemSnapBatch?.pack_size
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'unit_price',
                    label: 'Price',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex]?.ItemSnapBatch?.unit_price
                            return <p>{roundDecimal(data, 2)}</p>
                        },
                    },
                },
                {
                    name: 'total_qty',
                    label: 'Warehouse Quantity',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.quantity
                            if (!data) {
                                return <p>0</p>
                            }
                            else {
                                return <p>{data}</p>
                            }

                        },
                    },
                },
                {
                    name: 'warehouse',
                    label: 'Warehouse',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Warehouse?.name
                            return <p>{data}</p>
                            

                        },
                    },
                },
                {
                    name: 'quantity',
                    label: 'Islandwide Total Quantity',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.total_qty2
                            if (!data) {
                                return <p>0</p>
                            }
                            else {
                                return <p>{data}</p>
                            }

                        },
                    },
                },
                {
                    name: 'grn_date',
                    label: 'Recived Date',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].createdAt
                            return <p>{dateParse(data)}</p>
                        },
                    },
                },
                {
                    name: '', // field name in the row object
                    label: 'Action', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid container>
                                    <Grid className="" item lg={2}>
                                        <Tooltip title="Allocate">
                                            <IconButton
                                                onClick={() => {
                                                    console.log('hhhhhhhhhhhhhhhhh', this.state.data)
                                                    let formData = this.state.formData
                                                    formData.item_batch_id = this.state.data[tableMeta.rowIndex].id
                                                    formData.medium_description = this.state.data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.medium_description
                                                    formData.batch_no = this.state.data[tableMeta.rowIndex].ItemSnapBatch?.batch_no
                                                    this.state.data[tableMeta.rowIndex].selected = true
                                                    this.selectedRows(this.state.data[tableMeta.rowIndex], true)
                                                    this.setState({
                                                        showDetails: true,
                                                        addDailogView: true,
                                                        formData
                                                    })

                                                    // window.location.href = `/msd/check-store-space/${id}`
                                                }}
                                            >
                                                <AddIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>

                                    </Grid>
                                </Grid>

                            )
                        },
                    },
                },

            ],
            columns2: [
                {
                    name: 'status',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <IconButton
                                    // className="text-black"
                                    onClick={() => {
                                        // //let id=this.state.outgoing[tableMeta.rowIndex].order_exchange_id;
                                        // console.log(
                                        //     'aaaaaa',
                                        //     this.state.data[tableMeta.rowIndex]
                                        //         .batch_id
                                        // )
                                        // let id =
                                        //     this.state.data[tableMeta.rowIndex]
                                        //         .batch_id
                                        // window.location =
                                        //     '/drugbalancing/druglist/report/history/' +
                                        //     id
                                    }}
                                >
                                    <Icon color="primary">visibility</Icon>
                                </IconButton>
                            )
                        },
                    },
                },
                {
                    name: 'registration_no',
                    label: 'Registration No',
                    options: {
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data =
                        //         this.state.data[dataIndex].medium_description
                        //     return <p>{data}</p>
                        // },
                    },
                },
                {
                    name: 'supplier_name',
                    label: 'Supplier Name',
                    options: {
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data =
                        //         this.state.data[dataIndex].medium_description
                        //     return <p>{data}</p>
                        // },
                    },
                },
                {
                    name: 'supplier_contact',
                    label: 'Supplier Contact',
                    options: {
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data =
                        //         this.state.data[dataIndex].medium_description
                        //     return <p>{data}</p>
                        // },
                    },
                },
                {
                    name: 'manufacturer_name',
                    label: 'Manufacturer Name',
                    options: {
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data =
                        //         this.state.data[dataIndex].medium_description
                        //     return <p>{data}</p>
                        // },
                    },
                },
                {
                    name: 'manufacturer_name',
                    label: 'Manufacturer Contact',
                    options: {
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data =
                        //         this.state.data[dataIndex].medium_description
                        //     return <p>{data}</p>
                        // },
                    },
                },
                {
                    name: 'local_agent',
                    label: 'Local Agent',
                    options: {
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data =
                        //         this.state.data[dataIndex].medium_description
                        //     return <p>{data}</p>
                        // },
                    },
                },
                {
                    name: 'local_agent_contact',
                    label: 'Local Agent Contact',
                    options: {
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data =
                        //         this.state.data[dataIndex].medium_description
                        //     return <p>{data}</p>
                        // },
                    },
                },


            ],
            owner_id: null,
        }
    }
    async loadTotalQTY() {
        this.setState({
            loaded: false,

        })
        let data = this.state.data
        let owner_id = await localStorageService.getItem("owner_id")
        let item_batches = []
        // for (let index = 0; index < this.state.data.length; index++) {
        //     let item_id = this.state.data[index]?.id;
        //     items.push(item_id)
        // }
        for (let index = 0; index < this.state.data.length; index++) {
            let item_batch_id = this.state.data[index]?.item_batch_id;
            item_batches.push(item_batch_id)
        }

        let params = {
            search_type: 'SUM',
            group_by: 'Batch',
            exp_date_grater_than_zero: true,
            // owner_id: "000",
            item_batch_id: item_batches

        }
        console.log('item_batches', item_batches)

        if (item_batches.length > 0) {

        // let batch_res = await PharmacyService.getDrugStocks(params)
            let batch_res = await WarehouseServices.getDrugReport(params)

            console.log('batches30', batch_res.data.view.data)
            if (batch_res.status == 200) {
                let totalQty = []
                for (let i = 0; i < data.length; i++) {
                    const totalqty = batch_res.data.view.data.filter((x) => x.item_batch_id == data[i].item_batch_id)[0];
                    console.log('totalqty20', totalqty)
                    console.log('totalqty230', data)
                    // if(totalqty){
                    data[i].total_qty2 = totalqty?.quantity
                    // }
                    // totalQty.push(totalqty[i]);
                }

                this.setState({
                    // data:totalQty,
                    data: data,

                })

            }
        }
        // let params2 = {
        //     search_type: 'SUM',
        //     group_by: 'Batch',
        //     exp_date_grater_than_zero: true,
        //     owner_id: owner_id,
        //     item_batch_id: item_batches

        // }
        // let batch_res2 = await WarehouseServices.getDrugReport(params2)

        // console.log('batches30', batch_res2.data.view.data)
        // if (batch_res.status == 200) {
        //     let totalQty = []
        //     for (let i = 0; i < data.length; i++) {
        //         const totalqty = batch_res2.data.view.data.filter((x) => x.id == data[i].item_batch_id)[0];
        //         console.log('totalqty20', totalqty)
        //         console.log('totalqty230', data)
        //         // if(totalqty){
        //         data[i].quantity = totalqty?.quantity
        //         // }
        //         // totalQty.push(totalqty[i]);
        //     }

        //     this.setState({
        //         // data:totalQty,
        //         data: data,

        //     })

        // }

        // if(owner_id != null){
        //     // let batch_res2 = await PharmacyService.getDrugStocks(params2)
        //     let batch_res2= await WarehouseServices.getDrugReport(params2)

        //     if (batch_res2.status == 201) {
        //          console.log('batches20',batch_res2)
        //         let totalQty=[]
        //         let data = this.state.data
        //         //  totalQty = this.state.data.filter((x) =>x.data?.posted?.data?.item_id == element.id
        //         //   );
        //     //      for(let i=0; i<this.state.data.length; i++) {
        //     //         const totalqty = batch_res2.data.posted.data.filter((x) => x.item_batch_id == this.state.data[i].item_batch_id
        //     //           );

        //     //         totalQty.push(totalqty[0]);

        //     //   }
        //       for(let i=0; i<data.length; i++) {
        //         const totalqty = batch_res2.data.posted.data.filter((x) => x.item_batch_id == data[i].item_batch_id)[0];
        //           console.log('totalqty20',totalqty)
        //           console.log('totalqty230',data)
        //         // if(totalqty){
        //             data[i].pack_size = totalqty?.pack_size 
        //             data[i].unit_price = totalqty?.unit_price
        //             data[i].manufacturer = totalqty?.Manufacturer?.name
        //         // }
        //         // totalQty.push(totalqty[i]);
        //   }

        //       console.log('sum22',totalQty)
        //       this.setState({
        //         instituteQty:totalQty,
        //       })                  

        //     }
        // }


        this.setState({
            loaded: true,

        })

    }


    async getEmployees() {

        // const userId = await localStorageService.getItem('userInfo').id

        let getAsignedEmployee = await EmployeeServices.getEmployees({
            // employee_id: userId,
            owner_id: this.state.owner_id,
            // type: ['Consultant', 'Nurse', 'Medical Officer'],
            // issuance_type: 'SCO' 
        })
        if (getAsignedEmployee.status == 200) {
            this.setState({
                // loaded: true,
                empData: getAsignedEmployee.data.view.data
            })

            console.log(this.state.empData);
        }
    }

    // async loadItemData(item_batch_id) {

    //     let params = {
    //         item_id: item_batch_id,
    //         exp_date_grater_than_zero: true
    //     }
    //     let batch_res = await InventoryService.fetchItemBatchByItem_Id(params) 
    //     console.log("batchres3", batch_res)
    //     // console.log("batchres",this.state.data)
    //     if (batch_res.status == 200) {
    //         this.setState({
    //             itembatchdata: batch_res?.data?.view?.data,
    //             //loaded: true,
    //         }, () => {
    //             //   let newitembatchdata=[]
    //             // for(let i=0; i<this.state.data?.length; i++) {
    //             //     newitembatchdata.push({
    //             //      ...this.state.itembatchdata[i],...(this.state.data?.find((element) => element.id === this.state.itembatchdata[i]?.item_batch_id))}
    //             //     );
    //             //   }
    //             //   console.log("newArray2",newitembatchdata)
    //             //   this.setState({
    //             //     data:newitembatchdata,
    //             //     loaded:true
    //             //   }) 
    //             let data = this.state.data
    //             let totalQty = []
    //             for (let i = 0; i < data.length; i++) {
    //                 const totalqty = batch_res.data.view.data.filter((x) => x.id == data[i].item_batch_id)[0];
    //                 console.log('totalqty2', totalqty)
    //                 console.log('totalqty23', data)
    //                 // if(totalqty){
    //                 data[i].pack_size = totalqty?.pack_size
    //                 data[i].unit_price = totalqty?.unit_price
    //                 data[i].manufacturer = totalqty?.Manufacturer?.name
    //                 // }
    //                 // totalQty.push(totalqty[i]);
    //             }

    //             //   console.log('totalqty',totalQty)

    //             this.setState({
    //                 data: data,
    //                 loaded: true
    //                 // msdqty:totalQty,

    //             }, () => {
    //                 console.log('data', this.state.data)
    //             })

    //         }
    //         )
    //         console.log('itembatchdata', this.state.data)batch_no
    //     }
    // }
    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData
            },
            () => {
                this.loadData()
            }
        )
    }

    async loadData() {
        let item_id = this.state.selected_value
        this.setState({ loaded: false })
        let filterData = this.state.filterData
        let formData = this.state.formData

        console.log('cheking batch det', formData.batch_no)
        let params = {

            item_id: item_id,
            // search_type: "GROUP",
            ' order[0]': ['createdAt', 'DESC'],
            page: filterData.page,
            limit: 20,
            batch_no: formData.batch_no,
            // exp_date_grater_than_zero: true,
            owner_id: this.state.owner_id,
            all_status: true
        }
        // let batch_res = await InventoryService.fetchItemBatchByItem_Id(params)
        let batch_res = await WarehouseServices.getAllItemWarehouse(params)
        console.log('batchres2-----------------11111', batch_res)
        if (batch_res.status == 200) {
            // let data2 = batch_res.data.view.data

            this.setState({
                data: batch_res.data.view.data,
                totalItems: batch_res.data.view?.totalItems,
                // loaded: true,

            }, () => {
                this.loadTotalQTY()
                // this.loadItemData()
            })
            console.log('Batch Data', this.state.data)
            // this.setState({ loaded: true })
        }
    }
    // async loadTotalQTY(){
    //     let item_batches = []
    //     for (let index = 0; index < this.state.data.length; index++) {
    //         let item_batch_id = this.state.data[index]?.item_batch_id;
    //         item_batches.push(item_batch_id)
    //     }

    //     let params = {
    //         search_type:'SUM',
    //         group_by:'Batch',
    //         exp_date_grater_than_zero:true,
    //         item_batch_id:item_batches

    //     }
    //     console.log('batches',params)
    //     let batch_res = await WarehouseServices.getDrugReport(params)
    //     console.log("res2",batch_res)
    //     if (batch_res.status == 200) {
    //         console.log("res2",batch_res)
    //         // var id_arrray = batch_res.data.view.data                    
    //         //     let consignmentList = batch_res.data.view.data.map(data => data.item_id);
    //         let totalQty=[]
    //          for(let i=0; i<this.state.data?.length; i++) {
    //             totalQty.push({
    //          ...batch_res.data.view.data[i],...(this.state.data?.find((element) => element.item_batch_id === batch_res.data.view.data[i]?.item_batch_id))}
    //         );
    //       }
    //       console.log("newArray",totalQty)
    //       this.setState({
    //         totalQty:totalQty,

    //       })                  
    //         this.setState({
    //             loaded: true,

    //         })
    //     }


    // }
    async selectedFiles(file) {
        this.setState({ file: file }, () => {
            this.loadFile()
        })
    }

    // async loadFile() {
    //     const schema = this.state.schema

    //     if (this.state.file.fileList.length > 0) {
    //         let file = this.state.file.fileList[0].file

    //         readXlsxFile(file, { schema }).then(({ rows, errors }) => {
    //             console.log('table data ', rows)
    //             console.log('error', errors)
    //             this.setState({ tableData: rows })
    //         })
    //     } else {
    //         this.setState({ tableData: [] })
    //     }
    // }
    selectedRows(rowData, boolean) {
        this.setState({
            loading: false
        })
        if (boolean == true) {
            rowData.selected = 'Selected'
        } else {
            rowData.selected = null
        }
        let selectedBatch = []
        let selectedArray = this.state.data.filter((data) => data.selected === 'Selected')[0].item_batch_id
        // console.log("grn",selectedBatch)
        this.setState({
            selectedData: selectedArray,
            loading: true
        }, () => {
            console.log("selectedData", this.state.selectedData)
        })
        // let selected = this.state.data.filter((data)=> data.selected === 'Selected')
        console.log('selected3', rowData, boolean)
        // console.log('selected4',selected)
    }


    async componentDidMount() {
        let owner_id = await localStorageService.getItem('owner_id')
        this.setState({
            owner_id: owner_id
        })
        this.LoadDefects()
        this.getEmployees()
        //  this.loadData()
    }

    async LoadDefects() {
        let params = {
            type: 'Defects'
        }
        let res = await QualityAssuranceService.QAAssuranceSetup(params)
        console.log("all_defects", res.data.view.data)
        if (res.status == 200) {
            this.setState({
                all_defects: res?.data?.view?.data,
                // totalItems:res.data.view.totalItems,
                // loading: true
            }
            )
        }
    }
    async loadAllItems(search) {
        // let params = { "search": search }
        let data = {
            search: search
        }
        let filterData = this.state.filterData
        // this.setState({ loaded: false })
        let params = { limit: 10000, page: 0 }
        // let filterData = this.state.filterData
        let res = await InventoryService.fetchAllItems(data)
        console.log('all Items', res.data.view.data)

        if (res.status == 200) {
            this.setState({ sr_no: res.data.view.data })
        }
        //   console.log('items', this.state.left)
    }

    async submit() {
        let formData = this.state.formData
        // let owner_id = await localStorage.getItem("owner_id")
        console.log(data)
        let data = {
            log_date: new Date(),
            item_batch_id: this.state.selectedData,
            complaint_by: formData.complaint_by,
            complain_date: formData.complain_date,
            defects: formData.defects,
            defect_id: formData.defect_id,
            storage_conditions: formData.storage_conditions,
            remarks: formData.remarks,
            owner_id: this.state.owner_id != null ? this.state.owner_id : null,
            log_created_by: formData.log_created_by,
        }
        let res = await QualityAssuranceService.createSuspectedIssue(data)
        console.log('Res===========>', res)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Create Issue Successfully ', 
                severity: 'success',
            }, () => {
                window.location.reload()
            })
            this.LoadData()
        } else {
            this.setState({
                alert: true,
                message: 'Create Issue was Unsuccessful',
                severity: 'error',
            })
        }

        console.log("data", data)
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <ValidatorForm onSubmit={() => null}
                            onError={() => null}
                        >
                            <Typography variant="h6" className="font-semibold">
                                Report a Suspected Quality Issue 
                            </Typography>
                            <Grid container className='px-2 mt-2' spacing={3}>
                                <Grid
                                    item="item"
                                    lg={3}
                                    md={3}
                                    xs={12}>
                                    <SubTitle title="Select Item Name" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        // value={this.state.hsco.sr_no}
                                        // options={this.state.sr_no}
                                        options={this.state.sr_no}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData = this.state.filterData;
                                                filterData.sr_no = value.id;
                                                // this.loadItemData(value.id)

                                                console.log('SR no', filterData)
                                                this.setState({
                                                    filterData,
                                                    selected_value: value.id
                                                    // srNo:true
                                                }, () => {
                                                    this.loadData()
                                                })
                                                // let formData = this.state.formData;
                                                // formData.sr_no = value;

                                            }
                                            // else {
                                            //     let filterData = this.state.filterData;
                                            //     filterData.sr_no = null;
                                            //     this.setState({ filterData,
                                            //         srNo:false
                                            //     })
                                            // }
                                        }}
                                        getOptionLabel={(option) =>
                                            option.sr_no !== '' ? option.sr_no + '-' + option.long_description : null
                                            // let hsco =  this.state.hsco
                                            // if ( this.state.sr_no !== '' ) {

                                            // }
                                            // else{
                                            //    hsco.sr_no
                                            // }

                                            // this.state.hsco.sr_no === '' ? option.sr_no+'-'+option.long_description:this.state.hsco.sr_no
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Please type SR No"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    console.log("as", e.target.value)
                                                    if (e.target.value.length > 4) {
                                                        this.loadAllItems(e.target.value)
                                                        // let hsco =this.state.hsco
                                                        // hsco.sr_no = e.target.value

                                                        //     this.setState({
                                                        //         hsco,
                                                        //        srNo:false
                                                        //    })
                                                    }
                                                }}
                                            />
                                        )}
                                    />                    </Grid>

                                {/* <Grid
                        item="item"
                        lg={3}
                        md={3}
                        xs={12}>
                        <SubTitle title="Log Number" />
                        <TextValidator className='w-full' placeholder="Search by SR No" fullWidth="fullWidth" variant="outlined" size="small"
                            //value={this.state.formData.search} 
                           
                           onClick={this.loadAllItems}
                            // onChange={(e, value) => {
                            //     let filterData = this.state.filterData
                            //     if (e.target.value != '') {
                            //         filterData.search = e.target.value;
                            //     } else {
                            //         filterData.search = null
                            //     }
                            //     this.setState({ filterData })
                            //     console.log("form dat", this.state.filterData)
                            // }} onKeyPress={(e) => {
                            //     if (e.key == "Enter") {
                            //         let filterData = this.state.filterData;
                            //         filterData.page = 0;
                            //         this.setState({ filterData })

                            //         this.loadData()
                            //     }
                            // }}
                            /* validators={[
                            'required',
                            ]}
                            errorMessages={[
                            'this field is required',
                            ]} 
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon></SearchIcon>
                                    </InputAdornment>
                                )
                            }} />

                        </Grid>
                        <Grid
                        item="item"
                        lg={3}
                        md={3}
                        xs={12}
                       >
                        <SubTitle title="Log Date" />
                        <DatePicker
                                        className="w-full"
                                        value={
                                            this.state.filterData
                                                .manufacture_date
                                        }
                                        //label="Date From"
                                        placeholder="Manufacture Date"
                                        // minDate={new Date()}
                                        //maxDate={new Date("2020-10-20")}
                                        required={true}
                                        errorMessages="this field is required"
                                        onChange={(date) => {
                                            let filterData =
                                                this.state.filterData
                                            filterData.manufacture_date = date
                                            this.setState({ filterData })
                                        }}
                                    />
                        </Grid>   */}
                                <Grid
                                    item="item"
                                    lg={3}
                                    md={3}
                                    xs={12}
                                    style={{
                                        display: 'flex',
                                        flexDirection: "column"
                                    }}>
                                    <SubTitle title="Enter batch" />

                                    {/* <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={
                                            this.state.itembatchdata
                                        }
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                console.log("INST", value)
                                                let formData = this.state.formData
                                                formData.item_batch_id = value.batch_no
                                                this.setState({
                                                    formData,
                                                }, () => {
                                                    this.loadData()
                                                }
                                                )

                                            }
                                        }}

                                        // value={this.state.selected_consultant}
                                        getOptionLabel={(option) => option?.batch_no
                                        }
                                        renderInput={(params) => ( */}
                                            <TextValidator

                                                placeholder="Enter batch"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                onChange={(e, value) => {
                                                    // if (value != null) {
                                                        // console.log("INST", e)
                                                        let formData = this.state.formData
                                                        formData.batch_no = e.target.value
                                                        this.setState({
                                                            formData,
                                                        })
        
                                                    // }
                                                }}

                                                onKeyPress={(e) => {

                                                    if (e.key === 'Enter') {
                                                        this.loadData()
                                                    }
                                                }}

                                            />

                                        {/* )}
                                    /> */}


                                </Grid>
                            </Grid>
                        </ValidatorForm>
                        {this.state.loaded ?
                            <LoonsTable
                                //title={"All Aptitute Tests"}
                                id={'allAptitute'}
                                data={this.state.data}
                                columns={this.state.columns1}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    print: true,
                                    viewColumns: true,
                                    download: true,
                                    count: this.state.totalItems,
                                    rowsPerPage: 20,
                                    page: this.state.filterData.page,
                                    onTableChange: (
                                        action,
                                        tableState
                                    ) => {
                                        console.log(action, tableState)
                                        switch (action) {
                                            case 'changePage':
                                                this.setPage(
                                                    tableState.page
                                                )
                                                break
                                            case 'sort':
                                                //this.sort(tableState.page, tableState.sortOrder);
                                                break
                                            default:
                                                console.log(
                                                    'action not handled.'
                                                )
                                        }
                                    },
                                }}
                            ></LoonsTable>

                            : null}


                        <Dialog maxWidth="lg" open={this.state.addDailogView}>

                            {this.state.showDetails ?


                                <ValidatorForm onSubmit={() => this.submit()}
                                    onError={() => null}
                                    className="m-5"
                                >

                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Grid container spacing={2}>

                                            <Grid item>
                                                <h5>Item Name:-{this.state.formData?.medium_description}</h5>
                                            </Grid>
                                            <Grid item>
                                                <h5>Batch No:-{this.state.formData.batch_no}</h5>
                                            </Grid>






                                        </Grid>
                                        <Grid item>
                                            <IconButton aria-label="close" onClick={() => { this.setState({ addDailogView: false }) }}><CloseIcon /></IconButton>
                                        </Grid>

                                    </div>


                                    <Grid container spacing={2}>


                                        <Grid item xs={12} sm={12} md={4} lg={4}>
                                            <SubTitle title="Complaint Initiated by:" />
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.empData}
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData
                                                    if (value != null) {
                                                        formData.complaint_by = value.id
                                                    } else {
                                                        formData.complaint_by = null
                                                    }

                                                    this.setState({ formData })
                                                }}
                                                /*  defaultValue={this.state.all_district.find(
                                                (v) => v.id == this.state.formData.district_id
                                                )} */
                                                value={this.state.empData.find(
                                                    (v) =>
                                                        v.id == this.state.formData.complaint_by
                                                )}
                                                getOptionLabel={(option) =>
                                                    option.name ? option.name : ''
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Select Name"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />

                                        </Grid>
                                        <Grid item xs={12} sm={12} md={4} lg={4}>
                                            <SubTitle title="Complaint Initiated Date:" />

                                            <DatePicker
                                                minDate={new Date()}
                                                className="w-full"
                                                value={
                                                    this.state.formData.complain_date
                                                }
                                                //label="Date From"
                                                placeholder="Complaint Initiated Date:"
                                                // minDate={new Date()}
                                                //maxDate={new Date("2020-10-20")}
                                                required={true}
                                                errorMessages="This field is required"
                                                onChange={(date) => {
                                                    let formData =
                                                        this.state.formData
                                                    formData.complain_date = date
                                                    this.setState({ formData })
                                                }}
                                            />

                                        </Grid>
                                        <Grid item xs={12} sm={12} md={4} lg={4}>
                                            <SubTitle title="Log Initiated by:" />
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.empData}
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData
                                                    if (value != null) {
                                                        formData.log_created_by = value.id
                                                    } else {
                                                        formData.log_created_by = null
                                                    }

                                                    this.setState({ formData })
                                                }}
                                                /*  defaultValue={this.state.all_district.find(
                                                (v) => v.id == this.state.formData.district_id
                                                )} */
                                                value={this.state.empData.find(
                                                    (v) =>
                                                        v.id == this.state.formData.log_created_by
                                                )}
                                                getOptionLabel={(option) =>
                                                    option.name ? option.name : ''
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Select Name"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />

                                        </Grid>
                                        <Grid item xs={12} sm={12} md={4} lg={4}>
                                            <SubTitle title="Defect" />
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_defects}
                                                fullWidth
                                                row={3}
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData
                                                    if (value != null) {
                                                        formData.defect_id = value.id

                                                        this.setState({ formData })
                                                        // if(value.name == 'Other'){
                                                        //     this.setState({
                                                        //         otherText :true
                                                        //     })
                                                        // }
                                                        // else if(value.name != 'Other'){
                                                        //     // formData.ven_id = null
                                                        //     this.setState({
                                                        //         otherText :true
                                                        //     })
                                                        // }
                                                        // formData.ven_id = value.id
                                                    } else {
                                                        formData.defect_id = null
                                                        formData.defects = null
                                                        this.setState({ formData })
                                                    }


                                                }}
                                                /*  defaultValue={this.state.all_district.find(
                                                (v) => v.id == this.state.formData.district_id
                                                )} */
                                                // value={this.state.all_ven.find(
                                                //     (v) =>
                                                //         v.id == this.state.formData.ven_id
                                                // )}
                                                getOptionLabel={(option) =>
                                                    option.name ? option.name : ''
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Select Name"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth"
                                                        variant="outlined"
                                                        size="small"

                                                    />
                                                )}
                                            />

                                        </Grid>

                                        <Grid item xs={12} sm={12} md={4} lg={4}>
                                            <SubTitle title="Storage Conditions" />
                                            <TextValidator
                                                className='w-full'
                                                placeholder="Enter Storage Conditions"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                // value={
                                                //     this.state
                                                //         .formData
                                                //         .description
                                                // }
                                                row={3}
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData;
                                                    formData.storage_conditions = e.target.value
                                                    this.setState({ formData })

                                                }}
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            // errorMessages={[
                                            //     'This field is required',
                                            // ]}
                                            />

                                        </Grid>
                                        <Grid item xs={12} sm={12} md={4} lg={4}>
                                            <SubTitle title="Remarks" />
                                            <TextValidator
                                                className='w-full'
                                                placeholder="Enter Remark"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                // value={
                                                //     this.state
                                                //         .formData
                                                //         .description
                                                // }
                                                row={3}
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData;
                                                    formData.remarks = e.target.value
                                                    this.setState({ formData })

                                                }}
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            // errorMessages={[
                                            //     'This field is required',
                                            // ]}
                                            />

                                        </Grid>
                                        {this.state.otherText ?
                                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                                {/* <SubTitle title="Other" /> */}
                                                <TextValidator
                                                    className='w-full'
                                                    placeholder="Enter Reason"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    // value={
                                                    //     this.state
                                                    //         .formData
                                                    //         .description
                                                    // }
                                                    row={3}
                                                    onChange={(e, value) => {
                                                        let formData = this.state.formData;
                                                        formData.defects = e.target.value
                                                        this.setState({ formData })

                                                    }}
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'This field is required',
                                                // ]}
                                                />
                                            </Grid>
                                            : null}

                                        <Grid item xs={12} sm={12} md={4} lg={4} >

                                            <SubTitle title="Supporting Documents" className='mb-4' />
                                            {/* <SubTitle title="Image" /> */}
                                            {/* wont accept images for now*/}
                                            <FilePicker
                                                className='mt-2'
                                                id="file"
                                                singleFileEnable={true}
                                                multipleFileEnable={false}
                                                dragAndDropEnable={true}
                                                tableEnable={true}
                                                // documentName={true}
                                                // documentNameValidation={['required']}
                                                //documenterrorMessages={['this field is required']}
                                                accept=".xlsx, .xls, .csv"
                                                // maxFileSize={1048576}
                                                // maxTotalFileSize={1048576}
                                                maxFilesCount={1}
                                                validators={[
                                                    //'required',
                                                    // 'maxSize',
                                                    // 'maxTotalFileSize',
                                                    // 'maxFileCount',
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                    // 'file size too lage',
                                                    // 'Total file size is too lage',
                                                    // 'Too many files added',
                                                ]}
                                                selectedFileList={
                                                    this.state.file
                                                        .fileList
                                                }
                                                // label="Select Attachment"
                                                singleFileButtonText="Upload Data"
                                                // multipleFileButtonText="Select Files"
                                                selectedFiles={(files) =>
                                                    this.selectedFiles(
                                                        files
                                                    )

                                                }
                                            />

                                        </Grid>

                                    </Grid>





                                    <Grid item xs={12} sm={12} md={4} lg={4}>

                                    </Grid>


                                    <Grid container="container" className='mt-6' lg={12} md={12} xs={12}>
                                        {/* <Grid   item="item" lg={2} md={2} xs={4}></Grid> */}

                                        <Grid item="item" lg={2} md={12} xs={12}>
                                            <Button
                                                className="w-full"
                                                // style={{
                                                //     marginLeft: 4,
                                                //     marginTop:  3
                                                // }}
                                                progress={false}
                                                scrollToTop={false}
                                                type="submit"
                                                startIcon={<ReportProblemIcon />}
                                                color="secondary"
                                            >
                                                <span className="capitalize">
                                                    Report
                                                </span>
                                            </Button>
                                        </Grid>
                                    </Grid>

                                </ValidatorForm>

                                : null}
                        </Dialog>
                    </LoonsCard>
                </MainContainer>


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
            </Fragment >
        )
    }
}


export default ReportProblem;