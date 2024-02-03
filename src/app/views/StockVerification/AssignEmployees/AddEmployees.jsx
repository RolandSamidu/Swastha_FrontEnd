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
import { LoonsSnackbar, MainContainer, SubTitle, CardTitle, } from "../../../components/LoonsLabComponents";
import TextField from '@mui/material/TextField';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import LoonsTable from "../../../components/LoonsLabComponents/Table/LoonsTable";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Tooltip from "@material-ui/core/Tooltip";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';









const AddEmployees = ({ children, button, title }) => {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }



    return (


        <div>


            <AddCircleOutlineOutlinedIcon variant="outlined" onClick={handleClickOpen} />

            <Dialog open={open} onClose={handleClose}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <DialogTitle>Add Employee</DialogTitle>
                    <IconButton aria-label="close" onClick={handleClose}><CloseIcon /></IconButton>
                </div>
                <LoonsCard >


                    <LoonsTable

                        data={[
                            { name: "ABCD", nic_no: "567884836V", user_type: "Stock Verification Officer", designation: "Stock Verification Officer" },
                            { name: "ABCD", nic_no: "567884836V", user_type: "Stock Verification Officer", designation: "Stock Verification Officer" },
                            { name: "ABCD", nic_no: "567884836V", user_type: "Stock Verification Officer", designation: "Stock Verification Officer" },
                            { name: "ABCD", nic_no: "567884836V", user_type: "Stock Verification Officer", designation: "Stock Verification Officer" },
                            { name: "ABCD", nic_no: "567884836V", user_type: "Stock Verification Officer", designation: "Stock Verification Officer" },



                        ]}
                        columns={[
                            {
                                name: 'name',
                                label: 'Name',
                                options: {
                                    filter: true,

                                },
                            },

                            {
                                name: 'nic_no',
                                label: 'NIC No',
                                options: {
                                    filter: true,
                                },

                            },

                            {
                                name: 'user_type',
                                label: 'User Type',
                                options: {
                                    filter: true,
                                },

                            },

                            {
                                name: 'designation',
                                label: 'Designation',
                                options: {
                                    filter: true,
                                },
                            },
                            {
                                name: "select",
                                label: "Select",
                                options: {
                                    filter: false,
                                    sort: false,
                                    empty: true,
                                    print: false,
                                    download: false,
                                    customBodyRender: (value, tableMeta, updateValue) => {
                                        return (
                                            <Grid className="flex items-center">
                                                <Tooltip title="Add">
                                                    <IconButton
                                                        className="px-2"
                                                        onClick={() => {
                                                            console.log("Hello World!")


                                                        }}
                                                        size="small"
                                                        aria-label="view"
                                                    >
                                                        <RadioGroup
                                                            row
                                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                                            name="row-radio-buttons-group"
                                                        >
                                                            <FormControlLabel value="add" control={<Radio />} />
                                                        </RadioGroup>
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        );
                                    }

                                }
                            },






                        ]}

                    >{ }</LoonsTable>



                </LoonsCard>
            </Dialog>
        </div>

    )
}


export default AddEmployees