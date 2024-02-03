import { LoonsTable, MainContainer, Widget, Button, CardTitle, LoonsCard } from "app/components/LoonsLabComponents";
import PrescriptionService from "app/services/PrescriptionService";
import React, { Fragment, useEffect, useState } from "react";
import { dateTimeParse } from "utils";
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import localStorageService from "app/services/localStorageService";
import ApartmentIcon from '@material-ui/icons/Apartment';
import WarehouseServices from 'app/services/WarehouseServices';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Dialog, Typography, Divider, Grid } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import EmployeeServices from "app/services/EmployeeServices";

const Referred = () => {

    const [prescription, setPrescription] = useState([]);
    const [selectWarehouseView, setSelectWarehouseView] = React.useState(false);
    const [selectWarehouseName, setSelectWarehouseName] = React.useState(null);
    const [allWarehouses, setAllWarehouses] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false)
    const [selectedWarehouse, setSelectedWarehouse] = React.useState();
    const columns = [
        {
            name: 'prescription_no',
            label: 'Prescription No',
            options: {
                display: true,
            },
        }, {
            name: 'updated',
            label: 'Last Update',
            options: {
                display: true,
            },
        }, {
            name: 'comment',
            label: 'Comment',
            options: {
                display: true,
            },
        }, {
            name: 'doctor',
            label: 'Doctor',
            options: {
                display: true,
            },
        }
    ];

    useEffect(() => {
        loadWarehouses();
    }, [selectedWarehouse]);

    async function loadWarehouses() {
        setLoaded(false)
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_front_desk_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Login_user_Clinic_prescription');
        if (!selected_warehouse_cache) {
            setSelectWarehouseView(true)
        }
        else {
            setSelectWarehouseView(false)
            setSelectWarehouseName(selected_warehouse_cache.name)
            setLoaded(true)
        }
        let params = { employee_id: id }
        let res = await EmployeeServices.getAsignEmployees({ employee_id: id, issuance_type: 'Clinic' });
        if (res.status == 200) {
            console.log("CPALLOders", res.data.view.data)

            res.data.view.data.forEach(element => {
                all_front_desk_dummy.push({
                    name: element.Pharmacy_drugs_store.name,
                    clinic_id: element.Pharmacy_drugs_store.id,
                    clinic_doctor_id:element.id
                })
            });


            console.log("warehouse", all_front_desk_dummy)
            setAllWarehouses(all_front_desk_dummy)
        }
    }
    const fetchPrescriptions = async () => {
        var selected_warehouse_cache = await localStorageService.getItem('Login_user_Clinic_prescription');
        console.log("params temp", selected_warehouse_cache)
        const body = {
            'order[0]': ['createdAt', 'DESC'],
            'status': 'Reffered Back',
            'clinic_id': selected_warehouse_cache.clinic_id,
            'no_druglist': true
        };


        PrescriptionService.fetchPrescriptions(body).then((obj) => {
            console.log("PatientPrescriptionHistory", obj.data ? obj.data.view.data : []);
            const pres = obj.data.view.data.map((item) => {
                return {
                    prescription_no: item.prescription_no,
                    updated: dateTimeParse(item.latest_update_date_time),
                    comment: item.pharmacist_remark,
                    doctor: item.Doctor ? item.Doctor.name : ""
                };
            });
            setPrescription([...pres]);
        });
    }

    useEffect(() => { fetchPrescriptions() }, [selectWarehouseView]);

    return <MainContainer>
        <LoonsCard>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" className="font-semibold">Referred Prescription</Typography>
                <div className='flex'>
                    <Grid
                        className="pt-1 pr-3"
                    >
                        <Typography>{selectWarehouseName !== null ? "You're in "+selectWarehouseName : null}</Typography>
                    </Grid>
                    <LoonsButton
                        color='primary'
                        onClick={() => {
                            setSelectWarehouseView(true)
                        }}>
                        <ApartmentIcon />
                        Change Warehouse
                    </LoonsButton>


                </div>
            </div>
            <Divider className='mb-3' />
            <Fragment>
                <LoonsTable
                    id={'referredPrescription'}
                    data={prescription}
                    columns={columns}
                    options={{
                        pagination: true,
                        rowsPerPage: 10
                    }}
                ></LoonsTable>
            </Fragment>
        </LoonsCard>


        <Dialog
            fullWidth="fullWidth"
            maxWidth="sm"
            open={selectWarehouseView}>

            <MuiDialogTitle disableTypography="disableTypography">
                <CardTitle title="Select Your Clinic" />
            </MuiDialogTitle>

            <div className="w-full h-full px-5 py-5">
                <ValidatorForm
                    onError={() => null} className="w-full">
                    <Autocomplete
                                        disableClearable className="w-full"
                        // ref={elmRef}
                        options={allWarehouses} onChange={(e, value) => {
                            if (value != null) {
                                localStorageService.setItem('Login_user_Clinic_prescription', value);
                                setSelectWarehouseView(false)
                                setSelectWarehouseName(value.name)
                                loadWarehouses()
                                setLoaded(true)
                                setSelectedWarehouse(value)

                            }
                        }} value={{
                            name: selectedWarehouse
                                ? (
                                    allWarehouses.filter((obj) => obj.id == selectedWarehouse).name
                                )
                                : null,
                            id: selectedWarehouse
                        }} getOptionLabel={(option) => option.name} renderInput={(params) => (
                            <TextValidator {...params} placeholder="Select Your Clinic"
                                //variant="outlined"
                                fullWidth="fullWidth" variant="outlined" size="small" />
                        )} />

                </ValidatorForm>
            </div>
        </Dialog>
    </MainContainer>
}

export default Referred;