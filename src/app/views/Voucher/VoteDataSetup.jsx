import { Divider, IconButton, Stack } from '@mui/material'
import { MenuItem } from '@mui/material'
import { Button } from '@mui/material'
import { TextareaAutosize } from '@mui/material'
import { Select } from '@mui/material'
import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { LoonsCard, LoonsTable } from 'app/components/LoonsLabComponents'
import { CircularProgress } from '@mui/material'

import SelectionTable from 'app/components/Table/SelectionTable'
import FinanceServices from 'app/services/FinanceServices'
import ModalLG from 'app/components/Modals/ModalLG'
import { LoonsSnackbar, CardTitle } from 'app/components/LoonsLabComponents'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import EditIcon from '@mui/icons-material/Edit';
import { roundDecimal } from 'utils'

const VoteDataSetup = () => {
    const [data, setData] = useState([])
    const [values, setValues] = useState({
        code: null,
        description: null,
        amount: 0,
        category: 'Standard',
        status: "Active"
    })
    const [selectedIndex, setSelectedIndex] = useState(null)

    const [editValues, setEditValues] = useState({
        code: null,
        description: null,
        category: null,
        amount: null,
        status: null
    })

    const [snackBar, setSnackBar] = useState({
        severity: 'success',
        alert: false,
        message: ''
    })

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        page: 0,
        limit: 10
    })

    const [totalItems, setTotalItems] = useState(0)

    const renderDetailCard = (label, value) => {
        return (
            <Grid
                container
                alignItems={'self-start'}
                sx={{ minHeight: '40px' }}
                spacing={0}
            >
                <Grid item xs={5}>
                    {label}
                </Grid>
                <Grid item xs={1}>
                    :
                </Grid>
                <Grid item xs={6}>
                    {value}
                </Grid>
            </Grid>
        )
    }
    const renderDropdown = (name, id, values, handleChange, options) => {
        return (
            <Select
                defaultValue={options[0]?.value}
                size="small"
                name={name}
                required
                id={id}
                value={values.category}
                onChange={handleChange}
            >
                {options.map((option) => {
                    return (
                        <MenuItem value={option?.value}>
                            {option?.label}
                        </MenuItem>
                    )
                })}
            </Select>
        )
    }

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleEditChange = (event) => {
        setEditValues({ ...editValues, [event.target.name]: event.target.value });
    };

    const columns = [
        {
            name: 'code',
            label: 'Vote Code',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.code ? data[dataIndex]?.code : "Not Available"
                }
            },
        },
        {
            name: 'description',
            label: 'Description',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.description ? data[dataIndex]?.description : "Not Available"
                }
            },
        },
        {
            name: 'status',
            label: 'Status',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.status ? data[dataIndex]?.status : "Not Available"
                }
            },
        },
        {
            name: 'amount',
            label: 'Amount',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return data[dataIndex]?.amount ? roundDecimal(data[dataIndex]?.amount, 2) : "Not Available"
                }
            },
        },
        {
            name: 'action',
            label: 'Action',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    return (
                        <div style={{}}>
                            <ModalLG
                                title={'Vote Data Edit - SPC'}
                                button={
                                    <IconButton onClick={() => {
                                        setSelectedIndex(dataIndex)
                                        setEditValues({
                                            amount: data[dataIndex]?.amount ? data[dataIndex]?.amount : 0,
                                            category: data[dataIndex]?.category ? data[dataIndex]?.category : "Standard",
                                            code: data[dataIndex]?.code ? data[dataIndex]?.code : null,
                                            description: data[dataIndex]?.description ? data[dataIndex]?.description : null,
                                            status: data[dataIndex]?.status ? data[dataIndex]?.status : 'Active'
                                        })
                                    }}>
                                        <EditIcon sx={{ color: '#000' }} />
                                    </IconButton>
                                }
                                actions={[
                                    <Button variant="contained" color="success" onClick={() => editSubmit()}>
                                        Save
                                    </Button>
                                ]}
                                close={
                                    <Button variant="contained" color="error">
                                        Cancel
                                    </Button>
                                }
                            >
                                <ValidatorForm className='pt-2' onError={() => null} onSubmit={() => null}>
                                    <br />
                                    <Stack spacing={2}>
                                        {renderDetailCard('Vote Code',
                                            <TextareaAutosize
                                                name='code'
                                                id='code'
                                                required
                                                value={editValues.code}
                                                onChange={handleEditChange}
                                                aria-label="minimum height"
                                                minRows={1}
                                                placeholder="Vote Code"
                                                style={{
                                                    width: 350,
                                                    padding: 10,
                                                    borderRadius: 10,
                                                }}
                                            />)}
                                        {renderDetailCard('Amount',
                                            <TextValidator
                                                className='w-full'
                                                InputLabelProps={{
                                                    shrink: false
                                                }}
                                                size="small"
                                                variant="outlined"
                                                name='amount'
                                                id='amount'
                                                required
                                                type='number'
                                                value={roundDecimal(editValues.amount, 2)}
                                                min={0}
                                                onChange={(e) => setEditValues({ ...editValues, amount: roundDecimal(e.target.value, 2) })}
                                                placeholder='Vote Amount'
                                                style={{
                                                    width: 350,
                                                    borderRadius: 10,
                                                }}
                                                validators={['minNumber:' + 0, 'required:' + true]}
                                                errorMessages={[
                                                    'Amount >= 0',
                                                    'This field is required'
                                                ]}
                                            />
                                            // <TextareaAutosize
                                            //     name='amount'
                                            //     id='amount'
                                            //     required
                                            //     inputMode='numeric'

                                            //     value={editValues.amount}
                                            //     onChange={handleEditChange}
                                            //     aria-label="minimum height"
                                            //     minRows={1}
                                            //     placeholder="Vote Amount"
                                            //     style={{
                                            //         width: 350,
                                            //         padding: 10,
                                            //         borderRadius: 10,
                                            //     }}
                                            // />
                                        )}
                                        {renderDetailCard(
                                            'Category',
                                            renderDropdown('category', 'category', editValues, handleEditChange, [
                                                { label: 'Standard', value: 'Standard' },
                                                { label: 'Medical', value: 'Medical' },
                                                { label: 'Other', value: 'Other' },
                                            ])
                                        )}
                                        {renderDetailCard(
                                            'Description',
                                            <TextareaAutosize
                                                name='description'
                                                required
                                                id='description'
                                                value={editValues.description}
                                                onChange={handleEditChange}
                                                aria-label="minimum height"
                                                minRows={3}
                                                placeholder="Remark"
                                                style={{
                                                    width: 350,
                                                    padding: 10,
                                                    borderRadius: 10,
                                                }}
                                            />
                                        )}
                                    </Stack>
                                </ValidatorForm>
                            </ModalLG>
                        </div>
                    )
                },
            },
        },
    ]

    const onSubmit = async () => {
        console.log("Values: ", values)
        let res = await FinanceServices.createFinanceVotes(values)
        if (res.status === 201) {
            setSnackBar({
                alert: true,
                message: "Vote Data has been Added Successfully",
                severity: 'success'
            })
            loadData()
        } else {
            setSnackBar({
                alert: true,
                message: "Failed Adding Vote Data",
                severity: 'error'
            })
        }
    }

    const editSubmit = async () => {
        console.log("Values: ", editValues)
        if ((editValues.code !== null && editValues.description !== null) && (editValues.code !== '' && editValues.description !== '')) {
            let res = await FinanceServices.changeFinanceVotes(data[selectedIndex]?.id, editValues)
            if (res.status === 200) {
                setSnackBar({
                    alert: true,
                    message: "Vote Data has been Added Modified",
                    severity: 'success'
                })
                loadData()
            } else {
                setSnackBar({
                    alert: true,
                    message: "Failed to Modify Vote Data",
                    severity: 'error'
                })
            }
        } else {
            setSnackBar({
                alert: true,
                message: "Please Fill out the Form to complete the action",
                severity: 'error'
            })
        }
    }

    const loadData = async () => {
        setLoading(false);
        let res = await FinanceServices.getFinanceVotes(formData)
        if (res.status === 200) {
            setData(res.data.view.data)
            setTotalItems(res.data.view.totalItems)
        }
        console.log("Votes: ", res.data.view.data)
        setLoading(true)
    }

    useEffect(() => {
        loadData()
    }, [formData])
    return (
        <div
            className="w-full"
            style={{
                display: 'flex',

                flexDirection: 'column',
                padding: '30px',
                alignItems: 'center',
            }}
        >
            {/* <div className="w-full" style={{ paddingBottom: '20px' }}>
                Vote Data Setup
            </div> */}
            <div
                style={{
                    width: '1000px',
                    paddingTop: '30px',
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '10px',
                }}
            >   <ValidatorForm className='pt-2' onError={() => null} onSubmit={() => onSubmit()}>
                    <CardTitle title={'Vote Data Setup'} />
                    <br />
                    <Stack spacing={2}>
                        {renderDetailCard('Vote Code',
                            <TextareaAutosize
                                name='code'
                                id='code'
                                required
                                value={values.code}
                                onChange={handleChange}
                                aria-label="minimum height"
                                minRows={1}
                                placeholder="Vote Code"
                                style={{
                                    width: 350,
                                    padding: 10,
                                    borderRadius: 10,
                                }}
                            />)}
                        {renderDetailCard('Vote Amount',
                            <TextValidator
                                className='w-full'
                                InputLabelProps={{
                                    shrink: false
                                }}
                                size="small"
                                variant="outlined"
                                name='amount'
                                id='amount'
                                required
                                type='number'
                                value={roundDecimal(values.amount, 2)}
                                min={0}
                                onChange={(e) => setValues({ ...values, amount: roundDecimal(e.target.value, 2) })}
                                placeholder='Vote Amount'
                                style={{
                                    width: 350,
                                    borderRadius: 10,
                                }}
                                validators={['minNumber:' + 0, 'required:' + true]}
                                errorMessages={[
                                    'Amount >= 0',
                                    'This field is required'
                                ]}
                            />
                        )}
                        {renderDetailCard(
                            'Category',
                            renderDropdown('category', 'category', values, handleChange, [
                                { label: 'Standard', value: 'Standard' },
                                { label: 'Medical', value: 'Medical' },
                                { label: 'Other', value: 'Other' },
                            ])
                        )}
                        {renderDetailCard(
                            'Description',
                            <TextareaAutosize
                                name='description'
                                required
                                id='description'
                                value={values.description}
                                onChange={handleChange}
                                aria-label="minimum height"
                                minRows={3}
                                placeholder="Remark"
                                style={{
                                    width: 350,
                                    padding: 10,
                                    borderRadius: 10,
                                }}
                            />
                        )}
                    </Stack>
                    <div className="w-full" style={{ paddingRight: '30px' }}>
                        <Stack direction={'row-reverse'} spacing={3}>
                            {/* <ModalLG
                            button={<Button variant="contained">Add</Button>}
                            title={'Votes'}
                        >
                            <SelectionTable selectionDisabled />
                        </ModalLG> */}
                            <Button variant="contained" type='submit'>Add</Button>
                        </Stack>
                    </div>
                </ValidatorForm>
            </div>
            <div
                style={{
                    width: '1000px',
                    paddingTop: '30px',
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '10px',
                    marginTop: '40px',
                }}
            >
                {loading ? <Grid container className="mt-5 pb-5">
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <CardTitle title="Vote Data Table" />
                        <LoonsTable
                            id={'completed'}
                            data={data}
                            columns={columns}
                            options={{
                                pagination: true,
                                serverSide: true,
                                count: totalItems,
                                rowsPerPage: formData.limit,
                                page: formData.page,
                                rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                selectableRows: false,
                                onTableChange: (action, tableSate) => {
                                    switch (action) {
                                        case 'changePage':
                                            setFormData({
                                                ...formData, // spread previous state object
                                                page: tableSate.page, // overwrite page property
                                            });
                                            break;
                                        case 'changeRowsPerPage':
                                            setFormData({
                                                ...formData,
                                                page: 0,
                                                limit: tableSate.rowsPerPage
                                            })
                                            break;
                                        default:
                                            console.log('action not handled');
                                    }
                                }

                            }}
                        ></LoonsTable>
                    </Grid>
                </Grid> : (
                    <Grid className='justify-center text-center w-full pt-12'>
                        <CircularProgress size={30} />
                    </Grid>
                )}
            </div>
            {/* <div
                style={{
                    width: '1000px',
                    paddingTop: '30px',
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '10px',
                    marginTop: '40px',
                }}
            >
                <SelectionTable selectionDisabled />
            </div> */}
            <LoonsSnackbar
                open={snackBar.alert}
                onClose={() => {
                    setSnackBar({ ...snackBar, alert: false })
                }}
                message={snackBar.message}
                autoHideDuration={3000}
                severity={snackBar.severity}
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>
        </div>
    )
}

export default VoteDataSetup
