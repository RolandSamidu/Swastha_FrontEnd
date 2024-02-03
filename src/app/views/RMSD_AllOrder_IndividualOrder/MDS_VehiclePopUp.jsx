import { CircularProgress, Divider, Grid, Typography } from "@material-ui/core";
import { LoonsTable, MainContainer, SubTitle } from "app/components/LoonsLabComponents";
import MDSService from "app/services/MDSService";
import React, { Component } from "react";


class MDS_VehiclePopUp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            vehicle_id: null,
            vehicle:null,
            reservation_data:[],
            reservationDetailsLoaded:false,
            columns:[
                {
                    name: 'vehicle',
                    label: 'Vehicle Owner',
                    options: {
                        display: true,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // console.log('vehicle', tableMeta);
                        //     if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                        //         return 'N/A'
                        //     } else {
                        //         return (tableMeta.rowData[tableMeta.columnIndex].reg_no)
                        //     }
                        // }
                    }
                },
                {
                    name: 'vehicle',
                    label: 'Pick Up Date',
                    options: {
                        display: true,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // console.log('vehicle', tableMeta);
                        //     if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                        //         return 'N/A'
                        //     } else {
                        //         return (tableMeta.rowData[tableMeta.columnIndex].reg_no)
                        //     }
                        // }
                    }
                },
                {
                    name: 'vehicle',
                    label: 'Pick Up Time',
                    options: {
                        display: true,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // console.log('vehicle', tableMeta);
                        //     if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                        //         return 'N/A'
                        //     } else {
                        //         return (tableMeta.rowData[tableMeta.columnIndex].reg_no)
                        //     }
                        // }
                    }
                },
                {
                    name: 'vehicle',
                    label: 'Reserved Volume',
                    options: {
                        display: true,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // console.log('vehicle', tableMeta);
                        //     if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                        //         return 'N/A'
                        //     } else {
                        //         return (tableMeta.rowData[tableMeta.columnIndex].reg_no)
                        //     }
                        // }
                    }
                },
                {
                    name: 'vehicle',
                    label: 'Remaining Volume',
                    options: {
                        display: true,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // console.log('vehicle', tableMeta);
                        //     if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                        //         return 'N/A'
                        //     } else {
                        //         return (tableMeta.rowData[tableMeta.columnIndex].reg_no)
                        //     }
                        // }
                    }
                },
            ]

        }
    }

    async preLoadData(){
        this.setState({
            reservationDetailsLoaded:false
        })
        let res = await MDSService.getVehicleByID('null',this.state.vehicle_id)
        console.log('status',res);
        if(res.status && res.status == 200){
            this.setState({
                vehicle: res.data.view,
                reservationDetailsLoaded:true
            },() =>this.render())
        }
    }


    async componentDidMount() {

        this.setState({
            vehicle_id: this.props.id
        }, ()=> this.preLoadData())
    }


    render() {

        return (
            <MainContainer>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" className="font-semibold">RESERVED</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={7}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="font-semibold">Vehicle Registration Number :</Typography>
                                <SubTitle title={`${this.state.reservationDetailsLoaded ? this.state.vehicle.reg_no : ''}`} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="font-semibold">Vehicle Name :</Typography>
                                <SubTitle title={'Name'} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="font-semibold">Vehicle Type :</Typography>
                                <SubTitle title={'Type'} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="font-semibold">Vehicle Make :</Typography>
                                <SubTitle title={`${this.state.reservationDetailsLoaded ? this.state.vehicle.make : ''}`} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="font-semibold">Vehicle Description :</Typography>
                                <SubTitle title={`${this.state.reservationDetailsLoaded ? this.state.vehicle.description : ''}`} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={5}>
                        <h6> Image</h6>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" className="font-semibold">Specifications</Typography>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" className="font-semibold">Max Volume (m3):</Typography>
                        <SubTitle title={`${this.state.reservationDetailsLoaded ? this.state.vehicle.max_volume:''}`} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" className="font-semibold">Max Weight (Kg):</Typography>
                        <SubTitle title={`${this.state.reservationDetailsLoaded ? this.state.vehicle.max_weight:''}`} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" className="font-semibold">Average Loading Time :</Typography>
                        <SubTitle title={`${this.state.reservationDetailsLoaded ? this.state.vehicle.average_loading_time:''}`} />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h6' className="font-semibold"> Reservation Details</Typography>
                        <Divider />
                        {
                            this.state.reservationDetailsLoaded
                                ? (
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.reservation_data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: false,
                                            serverSide: true,
                                            print: false,
                                            download: false,
                                            viewColumns: false
                                            // count: this.state.totalItems,
                                            // rowsPerPage: this.state.filterData.limit,
                                            // page: this.state.filterData.page,
                                            // onTableChange: (action, tableState) => {
                                            //     console.log('trigg', action, tableState)
                                            //     switch (action) {
                                            //         case 'changePage':
                                            //             this.setPage(tableState.page)
                                            //             break
                                            //         case 'sort':
                                            //             //this.sort(tableState.page, tableState.sortOrder);
                                            //             break
                                            //         default:
                                            //             console.log('action not handled.')
                                            //     }
                                            // }
                                        }}></LoonsTable>
                                )
                                : (
                                    //load loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )
                        }
                    </Grid>
                </Grid>
            </MainContainer>
        )
    }
}

export default MDS_VehiclePopUp