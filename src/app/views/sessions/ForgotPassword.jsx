import React, { useState } from 'react'
import { Card, Grid, Button } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import EmployeeServices from 'app/services/EmployeeServices'
import { LoonsSnackbar } from 'app/components/LoonsLabComponents'

const useStyles = makeStyles(({ palette, ...theme }) => ({
    cardHolder: {
        background: '#1A2038',
    },
    card: {
        maxWidth: 800,
        borderRadius: 12,
        margin: '1rem',
    },
}))

const ForgotPassword = () => {
    const [state, setState] = useState({})

    const classes = useStyles()

    const handleChange = ({ target: { name, value } }) => {
        setState({
            ...state,
            [name]: value,
        })
    }

    let { username } = state

    const handleFormSubmit = async (event) => {
        console.log("formdata", username)
        let formData = {
            "username": username,
            "type": "Reset Link"
        };

        let res = await EmployeeServices.userResetLink(formData)
        console.log("Examination Data added", res)
        if (201 == res.status) {
            console.log("res",res)
            setState({
                ...state,
                snackOpen: true,
                severity: "Success",
                snackMessage: "Successfully Send the Reset Link"

            })

        } else {
         setState({
                ...state,
                snackOpen: true,
                severity: "error",
                snackMessage: "Can not Send the Reset Link"

            }) 
        }

    }





    return (
        <div
            className={clsx(
                'flex justify-center items-center  min-h-full-screen',
                classes.cardHolder
            )}
        >
            <Card className={classes.card}>
                <Grid container>
                    <Grid item lg={5} md={5} sm={5} xs={12}>
                        <div className="p-8 flex justify-center items-center h-full">
                            <img
                                className="w-full"
                                src="/assets/images/illustrations/dreamer.svg"
                                alt=""
                            />
                        </div>
                    </Grid>
                    <Grid item lg={7} md={7} sm={7} xs={12}>
                        <div className="p-8 h-full bg-light-gray relative">
                            <ValidatorForm onSubmit={handleFormSubmit}>
                                <TextValidator
                                    className="mb-6 w-full"
                                    variant="outlined"
                                    label="User Name"
                                    onChange={handleChange}
                                    type="text"
                                    name="username"
                                    size="small"
                                    value={username || ''}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                                <div className="flex items-center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                    >
                                        Reset Password
                                    </Button>
                                    <span className="ml-4 mr-2">or</span>
                                    <Link to="/session/signin">
                                        <Button className="capitalize">
                                            Sign in
                                        </Button>
                                    </Link>
                                </div>
                            </ValidatorForm>
                        </div>
                    </Grid>
                </Grid>
            </Card>
            <LoonsSnackbar
                open={state.snackOpen}
                onClose={() => {
                    setState({
                        ...state,
                        snackOpen: true,
                    })
                }}
                message={state.snackMessage}
                elevation={2}
                autoHideDuration={3000}
                severity={state.severity}
                variant="filled"
            ></LoonsSnackbar>
        </div>
    )
}

export default ForgotPassword
