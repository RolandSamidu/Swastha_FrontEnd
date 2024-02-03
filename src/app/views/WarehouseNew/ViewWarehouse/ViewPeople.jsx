import { FormControlLabel, Grid, Checkbox } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
import FlowDiagramComp from 'app/components/FlowDiagramComp/FlowDiagramComp'
import {
    Button,
    CardTitle,
    CheckboxValidatorElement,
    LoonsCard,
    LoonsSnackbar,
    MainContainer,
    SubTitle,
    CheckBox,
} from 'app/components/LoonsLabComponents'
import TablePagination from '@material-ui/core/TablePagination';
import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
//import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import DepartmentService from 'app/services/DepartmentService'
import DepartmentTypeService from 'app/services/DepartmentTypeService'
import PharmacyService from 'app/services/PharmacyService'
import EmployeeServices from 'app/services/EmployeeServices'
import TransferList from 'app/views/common/TransferList'
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'

const styleSheet = (theme) => ({

    root: {
        margin: 'auto',
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 200,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
})

class ViewPeople extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isUpdate:true,
            allDepartmentTypes: [],
            allDepartments: [],
            drugStoreData: [],
            selectedDrugStore: {
                id: '',
                name: '',
                store_type: '',
                location: '',
                is_admin: false,
                is_counter: false,
                is_drug_store: false,
            },
            alert: false,
            message: '',
            severity: 'success',
            allHigherLevels: [
                { name: 'level1', id: 1 },
                { name: 'lavel2', id: 2 },
                { name: 'lavel3', id: 3 },
            ],

            formData: {
                store_id: '',
                name: '',
                department_type: null,
                department: null,
                store_type: null,
                location: '',
                higher_levels: null,
                admin: false,
                counter: false,
                designated: false,
            },


            checked: [],

            loaded: false,
            totalItems: 0,
            totalPages: 0,
            filterData: {
                limit: 10, page: 0,
                designation: '',
                name: '',
                user_id: ''
                //type: '',
                //designation: ''
            },

            left: [],
            right: [],
        }
    }

    componentDidMount() {
        // this.loadData()]
        this.loadAllItems()
        console.log('Props=============>', this.props)

        const isUpdate = this.state.props

        if (!isUpdate) {
            //this.loadAllDataStoreData()
        }
    }

    loadAllDataStoreData = async () => {
        let dataStoreData = await PharmacyService.fetchAllDataStorePharmacy('001', {})
        if (200 == dataStoreData.status) {
            this.setState({
                drugStoreData: dataStoreData.data.view.data,
            })
        }
    }

    //Change the state based on the checkbox change
    handleChange = (val) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [val.target.name]: val.target.checked,
            },
        })
    }

    fetchDrugStoreById = async (id) => {
        let dataStoreData = await PharmacyService.fetchOneById(id, '001')
        if (200 == dataStoreData.status) {
            this.setState({
                selectedDrugStore: dataStoreData.data.view,
            })
        }
    }





    async loadAllItems() {
        let filterData = this.state.filterData
        this.setState({ loaded: false })
        let res = await EmployeeServices.getEmployees(filterData)
        console.log("all pharmacist", res.data.view.data)
        if (200 == res.status) {
            this.setState({
                left: res.data.view.data,
                totalPages: res.data.view.totalPages,
                totalItems: res.data.view.totalItems,
                loaded: true
            })
        }
    }

    async setPage(page) {//Change paginations
        let filterData = this.state.filterData;
        filterData.page = page;
        this.setState({
            filterData
        }, () => {
            this.loadAllItems()
        });
    }


    handleChangePage(newPage) {
        console.log("new page", newPage)
        let filterData = this.state.filterData;
        filterData.page = newPage;
        this.setState({ filterData }, () => {
            this.loadAllItems()
        })
    }
    handleChangeRowsPerPage(limit) {
        console.log("limit", limit)
        let filterData = this.state.filterData;
        filterData.limit = limit;
        this.setState({ filterData }, () => {
            this.loadAllItems()
        })
    }



    async assignPharmacist(list) {
        let drug_store_id = this.props.location.state.id;
        console.log("selected list", list)
        console.log("selected drugStore id", drug_store_id)

        let selectedEmployees = [];
        list.forEach(element => {
            selectedEmployees.push(element.id)
        });


        /*   let formData = {
              "employee_id": "de1edb22-6a9b-4ae8-889f-69cafa9bb777",
              "pharmacy_drugs_stores_id": drug_store_id,
              "type": "Pharmacist",
              "main": false,
              "personal": true
          }
  
  
          let res = await PharmacyService.assignPharmacist(formData);
          if (res.status == 201) {
              this.setState({
                  alert: true,
                  message: 'Checking Criteria Created',
                  severity: 'success',
              })
          } else {
              this.setState({
                  alert: true,
                  message: 'Checking Criteria Cannot Create',
                  severity: 'error',
              })
          } */

    }





    //******************************************************* */

    not(a, b) {
        return a.filter((value) => b.indexOf(value) === -1);
    }

    intersection(a, b) {
        return a.filter((value) => b.indexOf(value) !== -1);
    }

    union(a, b) {
        return [...a, ...this.not(b, a)];
    }

    handleToggle(value) {
        const currentIndex = this.state.checked.indexOf(value);
        const newChecked = [...this.state.checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked
        });
    }

    numberOfChecked(items) {
        return this.intersection(this.state.checked, items).length;
    }

    handleToggleAll(items) {
        if (this.numberOfChecked(items) === items.length) {
            this.setState({
                checked: this.not(this.state.checked, items)
            });
        } else {
            this.setState({
                checked: this.union(this.state.checked, items)
            });
        }
    }

    leftChecked() {
        return this.intersection(this.state.checked, this.state.left);
    }

    handleCheckedRight() {
        /*  this.setState({
             right: this.state.right.concat(this.leftChecked())
         }); */
        this.assignPharmacist(this.leftChecked())
        //console.log("aaa",this.state.right.concat(this.leftChecked()))

        this.setState({
            left: this.not(this.state.left, this.leftChecked())
        });

        this.setState({
            checked: this.not(this.state.checked, this.leftChecked())
        });
    }

    rightChecked() {
        return this.intersection(this.state.checked, this.state.right);
    }

    handleCheckedLeft() {
        this.setState({
            left: this.state.left.concat(this.rightChecked())
        });

        this.setState({
            right: this.not(this.state.right, this.rightChecked())
        });



        this.setState({
            checked: this.not(this.state.checked, this.rightChecked())
        });
    }

    customList(title, items) {
        return (
            <Card>
                <CardHeader
                    //className={classes.cardHeader}
                    avatar={
                        <Checkbox
                            onClick={() => this.handleToggleAll(items)}
                            checked={
                                this.numberOfChecked(items) === items.length &&
                                items.length !== 0
                            }
                            indeterminate={
                                this.numberOfChecked(items) !== items.length &&
                                this.numberOfChecked(items) !== 0
                            }
                            disabled={items.length === 0}
                            inputProps={{ "aria-label": "all items selected" }}
                        />
                    }
                    title={title}
                    subheader={`${this.numberOfChecked(items)}/${items.length} selected`}
                />
                <Divider />
                <List
                    className={'overflow-auto max-h-400 w-full '}
                    dense
                    component="div"
                    role="list"
                >
                    {items.map((value) => {
                        const labelId = `transfer-list-all-item-${value}-label`;

                        return (
                            <ListItem
                                key={value}
                                role="listitem"
                                button
                                onClick={() => this.handleToggle(value)}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={this.state.checked.indexOf(value) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ "aria-labelledby": labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${value.name}`} />
                            </ListItem>
                        );
                    })}

                    <ListItem />
                </List>
            </Card>
        );
    }


    render() {
        let { theme } = this.props
        const { classes } = this.props
        const isUpdate = this.state.isUpdate
        let dataStoreObj = null

      //   if (isUpdate) {
      //       dataStoreObj = this.props.location.state
      //   }

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="People " />

                        <div className="w-full">
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => this.saveStepOne()}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex ">
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Drug Store Id" />

                                        {isUpdate ? (
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Store ID"
                                                name="store_id"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                // value={dataStoreObj.id}
                                                disabled={true}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                            />
                                        ) : (
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    this.state.drugStoreData
                                                }
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        this.fetchDrugStoreById(
                                                            value.id
                                                        )
                                                    }
                                                }}
                                                getOptionLabel={(option) =>
                                                    option.name
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Drug Store Id"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state
                                                                .selectedDrugStore
                                                        }
                                                    />
                                                )}
                                            />
                                        )}
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Name" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Name"
                                            name="store_name"
                                            InputLabelProps={{ shrink: false }}
                                            disabled={true}
                                          //   value={
                                          //       isUpdate
                                          //           ? dataStoreObj.name
                                          //           : this.state
                                          //               .selectedDrugStore
                                          //               .name
                                          //   }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        {/* TODO - Check what is this. This is not submitted to backend */}
                                        <SubTitle title="Department Type" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Department Type"
                                            disabled={true}
                                            name="Department Type"
                                            InputLabelProps={{ shrink: false }}
                                          //   value={
                                          //       isUpdate
                                          //           ? dataStoreObj.name
                                          //           : this.state
                                          //               .selectedDrugStore
                                          //               .name
                                          //   }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Department" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Department"
                                            disabled={true}
                                            name="Department"
                                            InputLabelProps={{ shrink: false }}
                                          //   value={
                                          //       isUpdate
                                          //           ? dataStoreObj.name
                                          //           : this.state
                                          //               .selectedDrugStore
                                          //               .name
                                          //   }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Store Type" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Store Type"
                                            disabled={true}
                                            name="storeType"
                                            InputLabelProps={{ shrink: false }}
                                          //   value={
                                          //       isUpdate
                                          //           ? dataStoreObj.store_type
                                          //           : this.state
                                          //               .selectedDrugStore
                                          //               .store_type
                                          //   }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Location" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Location"
                                            disabled={true}
                                            name="storeType"
                                            InputLabelProps={{ shrink: false }}
                                          //   value={
                                          //       isUpdate
                                          //           ? dataStoreObj.location
                                          //           : this.state
                                          //               .selectedDrugStore
                                          //               .location
                                          //   }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        {/* TODO - Check what is this. This is not submitted to backend */}
                                        <SubTitle title="Higher Levels" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Higgher Levels"
                                            disabled={true}
                                            name="storeType"
                                            InputLabelProps={{ shrink: false }}
                                          //   value={
                                          //       isUpdate
                                          //           ? dataStoreObj.location
                                          //           : this.state
                                          //               .selectedDrugStore
                                          //               .location
                                          //   }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Pharmacists Types" />

                                        <Grid
                                            container
                                            spacing={1}
                                            className="flex"
                                        >
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    disabled={true}
                                                //     checked={
                                                //         isUpdate
                                                //             ? dataStoreObj.is_admin
                                                //             : this.state
                                                //                 .selectedDrugStore
                                                //                 .is_admin
                                                //     }
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            name="admin"
                                                            value="admin"
                                                        />
                                                    }
                                                    label="Admin Pharmacist"
                                                />
                                            </Grid>

                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    disabled={true}
                                                //     checked={
                                                //         isUpdate
                                                //             ? dataStoreObj.is_counter
                                                //             : this.state
                                                //                 .selectedDrugStore
                                                //                 .is_counter
                                                //     }
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            name="counter"
                                                            value="counter"
                                                        />
                                                    }
                                                    label="Counter Pharmacist"
                                                />
                                            </Grid>

                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    disabled={true}
                                                //     checked={
                                                //         isUpdate
                                                //             ? dataStoreObj.is_drug_store
                                                //             : this.state
                                                //                 .selectedDrugStore
                                                //                 .is_drug_store
                                                //     }
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            name="designated"
                                                            value="designated"
                                                        />
                                                    }
                                                    label="Designated Pharmacist"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                        </div>


                        <Grid className="mt-5" >
                            </Grid>
<Divider></Divider>

                        <Grid className="mt-5" container spacing={2} justify="center" >


                            <Grid className=" w-full "
                                item
                                lg={5}
                                md={5}
                                sm={12}
                                xs={12} >

                                <ValidatorForm
                                    className="pt-2"
                                    onSubmit={() => null}
                                    onError={() => null}
                                >
                                    <Grid container spacing={2}>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="User ID"
                                                name="user_id"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={this.state.filterData.user_id}
                                                onChange={(e) => {
                                                    let filterData = this.state.filterData;
                                                    filterData.user_id = e.target.value;
                                                    this.setState({ filterData })
                                                }}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>

                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Name"
                                                name="Name"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={this.state.filterData.name}
                                                onChange={(e) => {
                                                    let filterData = this.state.filterData;
                                                    filterData.name = e.target.value;
                                                    this.setState({ filterData })
                                                }}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>

                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Designation"
                                                name="Designation"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={this.state.filterData.designation}
                                                onChange={(e) => {
                                                    let filterData = this.state.filterData;
                                                    filterData.designation = e.target.value;
                                                    this.setState({ filterData })
                                                }}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>

                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <Button
                                                className="mt-2"
                                                progress={false}
                                                type="submit"
                                                scrollToTop={true}
                                                startIcon="save"
                                            // onClick={this.onSubmit}
                                            >
                                                <span className="capitalize">Search</span>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>

                                {this.customList("All Items", this.state.left)}

                                <TablePagination
                                    component="div"
                                    count={this.state.totalItems}
                                    page={this.state.filterData.page}
                                    onChangePage={(e, page) => { this.handleChangePage(page) }}
                                    rowsPerPageOptions={[]}
                                    rowsPerPage={this.state.filterData.limit}
                                    onRowsPerPageChange={(event, limit) => { this.handleChangeRowsPerPage(limit) }}
                                />

                            </Grid>

                            <Grid item
                                lg={2}
                                md={2}
                                sm={12}
                                xs={12}>
                                <Grid className='mt-20' container direction="column" alignItems="center" spacing={1}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        className='my-1'
                                        onClick={() => this.handleCheckedRight()}
                                        disabled={this.leftChecked().length === 0}
                                        aria-label="move selected right"
                                    >
                                        &gt;
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        className='my-1'
                                        onClick={() => this.handleCheckedLeft()}
                                        disabled={this.rightChecked().length === 0}
                                        aria-label="move selected left"
                                    >
                                        &lt;
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid className=" w-full "
                                item
                                lg={5}
                                md={5}
                                sm={12}
                                xs={12} >{this.customList("Assigned to Questions", this.state.right)}</Grid>
                        </Grid>





                        {/*  <FlowDiagramComp id="9650ff7e-285f-412b-a3a6-f698e8f7ec0a" /> */}
                    </LoonsCard>
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
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(ViewPeople)
