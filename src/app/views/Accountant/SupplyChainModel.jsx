import React, { useEffect, useState } from 'react';
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Dialog,
    Grid,
    Divider,
    IconButton,
    Icon,
    Typography,
} from '@material-ui/core'

import {
    Button,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    LoonsTable,
} from 'app/components/LoonsLabComponents'

import CloseIcon from '@material-ui/icons/Close';
import ReportIcon from '@mui/icons-material/Report';

const SupplyChainModel = ({ open, setOpen, title, showSuccess, showError }) => {
    const type = ['Manufacture', 'Supplier', 'Local Agent']

    const [values, setValues] = useState({
        name: null,
        registration_no: null,
        contact_no: null,
        email: null
    });

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const createAgents = async () => {
        let res = await HospitalConfigServices.createLocalAgents(values)
        if (res.status == 201) {
            clearField()
            showSuccess()
            setTimeout(() => setOpen(false), 3000);
        } else {
            clearField()
            showError()
        }
    }

    const createSuppliers = async () => {
        let res = await HospitalConfigServices.createSuppliers(values)
        if (res.status == 201) {
            clearField()
            showSuccess()
            setOpen(false);
        } else {
            clearField()
            showError()
        }
    }

    const createManufactures = async () => {
        let res = await HospitalConfigServices.createManufactures(values)
        if (res.status == 201) {
            clearField()
            showSuccess()
            setTimeout(() => setOpen(false), 3000);
        } else {
            clearField()
            showError()
        }
    }

    const clearField = () => {
        setValues({
            name: '',
            registration_no: '',
            contact_no: '',
            email: ''
        })
    }

    const onSubmit = () => {
        switch (title) {
            case 'Supplier':
                createSuppliers();
                break;
            case 'Manufacture':
                createManufactures();
                break;
            case 'Local Agent':
                createAgents();
                break;
            default:
                break;
        }
    }

    return <Dialog open={open}
        onClose={() => setOpen(false)}>
        <MainContainer>
            {/* Filtr Section */}
            {type.includes(title) ?
                <>
                    <Grid
                        container="container"
                        style={{
                            alignItems: 'flex-end',
                            justifyContent: "space-between"
                        }}>
                        <Grid item="item" lg={11} md={9} xs={9}>
                            <Grid container="container" lg={12} md={12} xs={12}>
                                <CardTitle title={title} />
                            </Grid>
                        </Grid>
                        <Grid item="item" lg={1} md={1} xs={1}>
                            <IconButton aria-label="close" onClick={() => {
                                clearField()
                                setOpen(false)
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Divider className='mt-2' />

                    <ValidatorForm
                        className="pt-2"
                        onSubmit={() => onSubmit()}
                        onError={() => null}
                    >
                        {/* Main Grid */}
                        <Grid container spacing={2} direction="row">
                            {/* Filter Section */}
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                {/* Item Series Definition */}
                                <Grid container spacing={2}>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <Grid container spacing={2}>
                                            {/* Name */}
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
                                                    name="name"
                                                    InputLabelProps={{ shrink: false }}
                                                    value={values.name}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={handleChange}
                                                    validators={['required', "matchRegexp:^[A-z| |.]{1,}$"]}
                                                    errorMessages={[
                                                        'this field is required', "Please Enter a valid Name (Eg:A.B.C Perera)"
                                                    ]}
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
                                                <SubTitle title="Regitration Number" />

                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Registration No"
                                                    name="registration_no"
                                                    InputLabelProps={{ shrink: false }}
                                                    value={values.registration_no}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={handleChange}
                                                    validators={['required'/* , "matchRegexp:^[A-z| |.]{1,}$" */]}
                                                    errorMessages={[
                                                        'this field is required'/* , "Please Enter a valid Name (Eg:A.B.C Perera)" */
                                                    ]}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                            >
                                                <SubTitle title="Contact Number" />

                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Contact Number"
                                                    name="contact_no"
                                                    InputLabelProps={{ shrink: false }}
                                                    value={values.contact_no}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={handleChange}
                                                    validators={['required', "matchRegexp:((^|, )((0)[0-9]{9}|(7)[0-9]{8}))+$"]}
                                                    errorMessages={[
                                                        'this field is required', "Please enter a valid Contact Number(Eg:0712345678 or 712345678)"
                                                    ]}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full" item lg={6} md={6} sm={12} xs={12}
                                            >
                                                <SubTitle title="Email" />

                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Email"
                                                    name="email"
                                                    InputLabelProps={{ shrink: false }}
                                                    value={values.email}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={handleChange}
                                                    validators={['required', 'isEmail']}
                                                    errorMessages={[
                                                        'this field is required',
                                                        'Please enter a valid Email Address'
                                                    ]}
                                                />
                                            </Grid>

                                            {/* Submit and Cancel Button */}
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Grid container spacing={2}>
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
                                                        {/* Cancel Button */}
                                                        <Button
                                                            className="mt-2"
                                                            progress={false}
                                                            scrollToTop={
                                                                true
                                                            }
                                                            color="#cfd8dc"
                                                            onClick={() => clearField()}
                                                        >
                                                            <span className="capitalize">
                                                                Clear
                                                            </span>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </>
                :
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: "row" }}>
                    <ReportIcon style={{ width: '120px', height: '120px' }} />
                    <div>
                        <Typography variant='h6' style={{ textAlign: 'center' }}>
                            Warning
                        </Typography>
                        <Typography variant='body2' style={{ textAlign: "justify", textJustify: "inter-word" }}>

                            The specified type is not recognized. Only the following types are allowed:
                            <ul>
                                <li>Manufacture</li>
                                <li>Local Agent</li>
                                <li>Supplier</li>
                            </ul>
                        </Typography>
                    </div>
                </div>
            }
        </MainContainer>
    </Dialog>
}

export default SupplyChainModel;