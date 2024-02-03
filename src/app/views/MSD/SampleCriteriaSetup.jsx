import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    FormControlLabel,
    Checkbox,
    Hidden,
    FormGroup,
    TextField,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import ClinicService from 'app/services/ClinicService'
import PatientServices from 'app/services/PatientServices'
import PatientClinicService from 'app/services/PatientClinicService'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DateTimePicker } from '@material-ui/pickers'
import TablePagination from '@material-ui/core/TablePagination';
import {
    Button,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    CheckBox,
    ImageView,
    DatePicker,
    CheckboxValidatorElement,
    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'


import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
//import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import InventoryService from 'app/services/InventoryService'
import CriteriasService from 'app/services/CriteriasService'
import * as appConst from '../../../appconst'

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

class SampleCriteriaSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {

            alert: false,
            message: '',
            severity: 'success',

            checked: [],

            loaded: false,
            totalItems: 0,
            totalPages: 0,
            filterData: { limit: 10, page: 0 },


            left: [],
            right: [],

            formData: {
                //guardian detail
                question: null,
                type: '',
                answers: [],
                roles: [],
                fixed: false,
                items: []
            },
        }
    }



    async loadAllItems() {
        let filterData = this.state.filterData
        this.setState({ loaded: false })
        let res = await InventoryService.fetchAllItems(filterData)
        console.log("all items", res.data.view.data)
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

    async componentDidMount() {
        this.loadAllItems()
    }




    onSubmit = async () => {
        let formData = this.state.formData;
        let selectedList = this.state.right;
        formData.items = []
        if (selectedList.length == 0) {
            this.setState({
                alert: true,
                message: 'There is No Selected Item List',
                severity: 'error',
            })
        } else {
            selectedList.forEach(element => {
                formData.items.push({ item_id: element.id })
            });
            let res = await CriteriasService.createCheckList(formData);
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
            }



        }

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
        this.setState({
            right: this.state.right.concat(this.leftChecked())
        });

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
                                <ListItemText id={labelId} primary={`${value.short_description}`} />
                            </ListItem>
                        );
                    })}

                    <ListItem />
                </List>
            </Card>
        );
    }

    //******************************************************* */
    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Add New Queastion" />
                        {/* Content start*/}
                        <div className="w-full">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.onSubmit()}
                                onError={() => null}
                            >
                                <Grid container spacing={2}>
                                    <Grid className=" w-full" item lg={12} md={12} sm={12} xs={12}>
                                        <SubTitle title="Question" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Question"
                                            name="question"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.formData.question}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData = this.state.formData;
                                                formData.question = e.target.value;
                                                this.setState({ formData })
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>

                                    <Grid className=" w-full" item lg={4} md={4} sm={6} xs={12}>
                                        <SubTitle title="Question Type" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={[
                                                { label: 'Item Wise' },
                                                { label: 'Sample Wise' }
                                            ]}
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData;
                                                    formData.type = value.label;
                                                    this.setState({ formData })
                                                }
                                            }}
                                            defaultValue={{ label: 'Item Wise' }}
                                            value={{ label: this.state.formData.type }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Question Type"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid className=" w-full" item lg={4} md={4} sm={6} xs={12}>
                                        <SubTitle title="Posible Answer(s)" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            multiple={true}
                                            options={[
                                                { label: 'Yes' },
                                                { label: 'No' },
                                                { label: 'NA' },
                                            ]}
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData;
                                                    //formData.answers = value.label;
                                                    formData.answers = [];
                                                    value.forEach(element => {
                                                        formData.answers.push(element.label)
                                                    });
                                                    this.setState({ formData }, () => { console.log("val", this.state.formData) })
                                                }
                                            }}

                                            //defaultValue={{ label: 'NA' }}
                                            //value={{ label: this.state.formData.answers }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Posible Answer(s)"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid className=" w-full" item lg={4} md={4} sm={6} xs={12}>
                                        <SubTitle title="User Role(s) to Check" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            multiple={true}
                                            options={[{ role: "SCO" }, { role: "AD" }, { role: "Director" }]}
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData;
                                                    formData.roles = value;

                                                    this.setState({ formData })
                                                }
                                            }}

                                            //defaultValue={{ label: 'NA' }}
                                            value={this.state.formData.roles}
                                            getOptionLabel={(option) => option.role}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="User Role(s) to Check"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>


                                    <Grid className=" w-full" item lg={4} md={4} sm={6} xs={12}>
                                        <SubTitle title="Fixed" />
                                        <FormControlLabel
                                            label={"Fixed the Queastion"}
                                            control={
                                                <CheckBox
                                                    checked={this.state.formData.fixed}
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        formData.fixed = !this.state.formData.fixed
                                                        this.setState({ formData })
                                                    }
                                                    }
                                                    name="fixed"
                                                    color="primary"
                                                // value={this.state.formData.fixed == 'true' ? true : false}
                                                //checked={this.state.formData.agreement === false ? true : false}
                                                // validators={['required']}

                                                //disabled={this.state.approved_status != "Pending" ? true : false}
                                                />
                                            }
                                        />
                                    </Grid>



                                </Grid>








                                <Grid container spacing={2} justify="center" >
                                    <Grid className=" w-full "
                                        item
                                        lg={5}
                                        md={5}
                                        sm={12}
                                        xs={12} >{this.customList("All Items", this.state.left)}

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




                                <Grid
                                    className=" w-full flex justify-end"
                                    item
                                    lg={12}
                                    md={12}
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
                                        <span className="capitalize">Add</span>
                                    </Button>
                                </Grid>



                            </ValidatorForm>




                        </div>

                        {/* Content End */}
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

export default withStyles(styleSheet)(SampleCriteriaSetup)
