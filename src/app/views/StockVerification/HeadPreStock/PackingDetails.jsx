import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Grid, Typography } from '@material-ui/core'
import LoonsCard from "../../../components/LoonsLabComponents/LoonsCard";
import { LoonsSnackbar, MainContainer, SubTitle } from "../../../components/LoonsLabComponents";
import TextField from '@mui/material/TextField';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import LoonsTable from "../../../components/LoonsLabComponents/Table/LoonsTable";









const PackingDetails = ({ children, button, title }) => {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }



    return (


        <div>

            <Button variant="outlined" onClick={handleClickOpen}>
                <ArrowDropDownIcon />
            </Button>
            <Dialog open={open} onClose={handleClose}>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <DialogTitle>Packing Details</DialogTitle>
                    <IconButton aria-label="close" onClick={handleClose}><CloseIcon /></IconButton>
                </div>
                <LoonsCard >

                    <Grid container spacing={1} className="flex m-5 " alignItems="center">

                        <Grid
                            className=" w-full  " item lg={6} md={6} sm={12} xs={12}
                        >

                            <SubTitle title="UOM " />
                            <SubTitle title="Width(cm) " />
                            <SubTitle title="Net.Weight " />


                        </Grid>

                        <Grid
                            className=" w-full  " item lg={6} md={6} sm={12} xs={12}
                        >

                            <SubTitle title="Height(cm) " />
                            <SubTitle title="Length(cm) " />
                            <SubTitle title="Gross.Weight " />


                        </Grid>





                    </Grid>

                    <LoonsTable

                        data={[{ pack_size: "Level 1", uom: "test1234", quantity: 55, conversion: 34, mini_pack_size: 6, remark: 12, },
                        { pack_size: "Level 2", uom: "test1234", quantity: 55, conversion: 34, mini_pack_size: 6, remark: 12, },


                        ]}
                        columns={[
                            {
                                name: 'pack_size',
                                label: 'Pack Size',
                                options: {
                                    filter: true,

                                },
                            },

                            {
                                name: 'uom',
                                label: 'UOM',
                                options: {
                                    filter: true,
                                },

                            },

                            {
                                name: 'quantity',
                                label: 'Quantity',
                                options: {
                                    filter: true,
                                },

                            },
                            {
                                name: 'mini_pack_size',
                                label: 'Mini Pack Size',
                                options: {
                                    filter: true,
                                },

                            },
                            {
                                name: 'conversion',
                                label: 'Conversion',
                                options: {
                                    filter: true,
                                },
                            },
                            {
                                name: 'remark',
                                label: 'Remark',
                                options: {
                                    filter: true,
                                },
                            },





                        ]}

                    >{ }</LoonsTable>



                </LoonsCard>

            </Dialog>
        </div>

    )
}


export default PackingDetails