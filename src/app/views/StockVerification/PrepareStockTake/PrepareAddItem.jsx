import React from 'react'
import { Button, } from 'app/components/LoonsLabComponents'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';
import { Grid, Typography } from '@material-ui/core'
import LoonsCard from "../../../components/LoonsLabComponents/LoonsCard";
import { LoonsSnackbar, MainContainer, SubTitle } from "../../../components/LoonsLabComponents";
import TextField from '@mui/material/TextField';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import LoonsTable from "../../../components/LoonsLabComponents/Table/LoonsTable";
import { style } from 'd3'









const PrepareAddItem = ({ children, button, title }) => {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }



    return (


        <div >

            <Button className="button-primary" variant="outlined" onClick={handleClickOpen}>
                <AddIcon />
                Add Item
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose}>
                <DialogTitle>Add Item</DialogTitle>
                <LoonsCard>



                    <ValidatorForm >

                        <LoonsTable

                            id={"clinicDetails"}
                            data={[{ pack_size: 23, uom: "test1234", quantity: 55, conversion: 34, min_pack_size: 6, remark: 12, },



                            ]}
                            columns={[
                                {
                                    name: 'expiry_date',
                                    label: 'Expiry Date',

                                    options: {
                                        filter: true,

                                        customBodyRender: (value) => {
                                            return (
                                                <>
                                                    <TextValidator
                                                        {...value}
                                                        placeholder="Text Input"
                                                        fullWidth

                                                        variant="outlined"
                                                        size="small"
                                                        style={{
                                                            width: 150,
                                                        }}


                                                    />
                                                </>
                                            )
                                        }

                                    },
                                },

                                {
                                    name: 'serviceable_quantity',
                                    label: 'Serviceable Quantity',

                                    options: {
                                        filter: true,

                                        customBodyRender: (value) => {
                                            return (
                                                <>
                                                    <TextValidator
                                                        {...value}
                                                        placeholder="Text Input"
                                                        fullWidth

                                                        variant="outlined"
                                                        size="small"
                                                        style={{
                                                            width: 150,
                                                        }}

                                                    />
                                                </>
                                            )
                                        }

                                    },
                                },
                                {
                                    name: 'used_quantity',
                                    label: 'Used Quantity',

                                    options: {
                                        filter: true,

                                        customBodyRender: (value) => {
                                            return (
                                                <>
                                                    <TextValidator
                                                        {...value}
                                                        placeholder="Text Input"
                                                        fullWidth

                                                        variant="outlined"
                                                        size="small"
                                                        style={{
                                                            width: 150,
                                                        }}

                                                    />
                                                </>
                                            )
                                        }

                                    },
                                },

                                {
                                    name: 'expired_quantity',
                                    label: 'Expired Quantity',

                                    options: {
                                        filter: true,

                                        customBodyRender: (value) => {
                                            return (
                                                <>
                                                    <TextValidator
                                                        {...value}
                                                        placeholder="Text Input"
                                                        fullWidth

                                                        variant="outlined"
                                                        size="small"
                                                        style={{
                                                            width: 150,
                                                        }}

                                                    />
                                                </>
                                            )
                                        }

                                    },
                                },

                                {
                                    name: 'Issued_quantity_and_status',
                                    label: 'Issued Quantity and status',

                                    options: {
                                        filter: true,

                                        customBodyRender: (value) => {
                                            return (
                                                <>
                                                    <TextValidator
                                                        {...value}
                                                        placeholder="Text Input"
                                                        fullWidth

                                                        variant="outlined"
                                                        size="small"
                                                        style={{
                                                            width: 150,
                                                        }}

                                                    />
                                                </>
                                            )
                                        }

                                    },
                                },

                                {
                                    name: 'freeze_quantity',
                                    label: 'Freeze Quantity',

                                    options: {
                                        filter: true,

                                        customBodyRender: (value) => {
                                            return (
                                                <>
                                                    <TextValidator
                                                        {...value}
                                                        placeholder="Text Input"
                                                        fullWidth

                                                        variant="outlined"
                                                        size="small"
                                                        style={{
                                                            width: 150,
                                                        }}

                                                    />
                                                </>
                                            )
                                        }

                                    },
                                },

                                {
                                    name: 'count_quantity',
                                    label: 'Count Quantity',

                                    options: {
                                        filter: true,

                                        customBodyRender: (value) => {
                                            return (
                                                <>
                                                    <TextValidator
                                                        {...value}
                                                        placeholder="Text Input"
                                                        fullWidth

                                                        variant="outlined"
                                                        size="small"
                                                        style={{
                                                            width: 150,
                                                        }}

                                                    />
                                                </>
                                            )
                                        }

                                    },
                                },

                                {
                                    name: 'remark',
                                    label: 'Remark',

                                    options: {
                                        filter: true,

                                        customBodyRender: (value) => {
                                            return (
                                                <>
                                                    <TextValidator
                                                        {...value}
                                                        placeholder="Text Input"
                                                        fullWidth

                                                        variant="outlined"
                                                        size="small"
                                                        style={{
                                                            width: 150,
                                                        }}

                                                    />
                                                </>
                                            )
                                        }

                                    },
                                },








                            ]}

                        >{ }</LoonsTable>
                    </ValidatorForm>



                    <Grid className='flex justify-end mt-3' justifyContent="space-between">

                        <DialogActions>
                            <Button onClick={handleClose} className='button-danger'>Close</Button>

                        </DialogActions>


                        <DialogActions>
                            <Button onClick={handleClose} className='button-primary'>Submit</Button>

                        </DialogActions>

                    </Grid>



                </LoonsCard>

            </Dialog>
        </div >

    )
}


export default PrepareAddItem