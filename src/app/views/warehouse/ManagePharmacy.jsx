import {
    Card,
    Icon,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
    Grid,
    MenuItem,
    Select,
    Chip,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
import {
    Button,
    CardTitle,
    CheckboxValidatorElement,
    LoonsCard,
    LoonsSnackbar,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import DepartmentService from 'app/services/DepartmentService'
import DepartmentTypeService from 'app/services/DepartmentTypeService'
import PharmacyService from 'app/services/PharmacyService'
import WarehouseCommonFilter from '../common/WarehouseCommonFilter'
import 'date-fns'
import React, { Component, Fragment } from 'react'
import * as appConst from '../../../appconst'
import clsx from 'clsx'

const styleSheet = (theme) => ({})

class ManagePharmacy extends Component {
    constructor(props) {
        super(props)
        console.log('Props=============>', this.props)
        this.state = {
            allDepartmentTypes: [],
            allDepartments: [],
            alert: false,
            message: '',
            severity: 'success',
            allHigherLevels: [
                { name: 'level1', id: 1 },
                { name: 'lavel2', id: 2 },
                { name: 'lavel3', id: 3 },
            ],
            drugStore: [],
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
        }
    }

    async loadData() {
        //Fetch department data
        let dataStoreData = await PharmacyService.fetchAllDataStorePharmacy('001', {})
        if (200 == dataStoreData.status) {
            this.setState({
                drugStore: dataStoreData.data.view.data,
            })
        }
    }

    async saveStepOne() {
        let {
            store_id,
            name,
            // TODO - Check the purpose of this fild
            department_type,
            department,
            store_type,
            location,
            admin,
            counter,
            designated,
        } = this.state.formData

        const pharmacyObj = {
            name,
            store_id,
            department_id: department,
            store_type,
            // TODO - Check this field
            issuance_type: 'Main',
            location,
            is_admin: admin,
            is_counter: counter,
            is_drug_store: designated,
        }

        let res = await PharmacyService.creaetePharmacy(pharmacyObj, '001')
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Pharmacy Created Successfuly',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Pharmacy creation was Unsuccessful',
                severity: 'error',
            })
        }
    }

    componentDidMount() {
        this.loadData()
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

    handleFilterSubmit = (val) => {
        console.log('rop==============>', val)
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <Grid container spacing={1} className="flex">
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            className=" w-full"
                        >
                            <CardTitle title="Manage Pharmacy" />
                        </Grid>

                        {/* Table filters */}
                        <Grid item lg={12} className=" w-full mt-2">
                            <WarehouseCommonFilter
                                handleFilterSubmit={this.handleFilterSubmit}
                            />
                        </Grid>

                        {/* Table */}
                        <Grid item lg={12}>
                            <LoonsCard>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">
                                                ID
                                            </TableCell>
                                            <TableCell align="center">
                                                Name
                                            </TableCell>
                                            <TableCell align="center">
                                                Department
                                            </TableCell>
                                            <TableCell align="center">
                                                Designated Pharmacist
                                            </TableCell>
                                            <TableCell align="center">
                                                Location
                                            </TableCell>
                                            <TableCell align="center">
                                                Store Type
                                            </TableCell>
                                            <TableCell align="center">
                                                Drug Category
                                            </TableCell>
                                            <TableCell align="center">
                                                Action
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {this.state.drugStore.map((val) => (
                                            <TableRow>
                                                <TableCell align="center">
                                                    <div align="center">
                                                        <p>{val.id}</p>
                                                    </div>
                                                </TableCell>

                                                <TableCell align="center">
                                                    <div align="center">
                                                        <p>{val.name}</p>
                                                    </div>
                                                </TableCell>

                                                <TableCell align="center">
                                                    <div align="center">
                                                        <p>
                                                            {
                                                                val.designatedPharmacist
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div align="center">
                                                        <p>
                                                            {'Assigned' ==
                                                            val.designatedPharmacist ? (
                                                                <Chip
                                                                    color="primary"
                                                                    variant="outlined"
                                                                    label="Assigned"
                                                                />
                                                            ) : (
                                                                <Chip
                                                                    color="secondary"
                                                                    label="Not Assigned"
                                                                />
                                                            )}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div align="center">
                                                        <p>{val.location}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div align="center">
                                                        <p>
                                                            {val.drugCategory}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div
                                                        className="px-1"
                                                        align="center"
                                                    >
                                                        <p>
                                                            {val.drugCategory}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div align="center">
                                                        <Grid
                                                            container
                                                            className="flex"
                                                        >
                                                            <Grid
                                                                item
                                                                lg={4}
                                                                spacing={1}
                                                            >
                                                                <Button
                                                                    className="mt-2"
                                                                    progress={
                                                                        false
                                                                    }
                                                                    scrollToTop={
                                                                        true
                                                                    }
                                                                >
                                                                    <span className="capitalize">
                                                                        Update
                                                                    </span>
                                                                </Button>
                                                            </Grid>

                                                            <Grid item lg={6}>
                                                                <Button
                                                                    className="mt-2"
                                                                    progress={
                                                                        false
                                                                    }
                                                                    type="submit"
                                                                    scrollToTop={
                                                                        true
                                                                    }
                                                                    //navigate to assign drug screen
                                                                    onClick={() => {
                                                                        this.props.history.push(
                                                                            '/warehouse/phamacy/assign-pharmacist',
                                                                            //Pass the current drugstore object
                                                                            val
                                                                        )
                                                                    }}
                                                                >
                                                                    <span className="capitalize">
                                                                        Assign
                                                                        Drugs
                                                                    </span>
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </LoonsCard>
                        </Grid>
                    </Grid>
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(ManagePharmacy)
