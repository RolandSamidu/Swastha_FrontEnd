import { Grid } from '@mui/material'
import { Button } from '@mui/material'
import { Stack } from '@mui/material'
import React from 'react'

const PaymentVoucher = () => {
    const renderDetailCard = (label, value) => {
        return (
            <Grid
                container
                alignItems={'center'}
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

    return (
        <div
            style={{
                width: '600px',
                padding: '40px',
            }}
        >
            <div className="w-full">
                <Stack spacing={1}>
                    {renderDetailCard('Report ID', '#4556')}
                    {renderDetailCard('Voucher No', 'sadf46')}
                    {renderDetailCard('Supplier Code', 'SPC')}
                    {renderDetailCard('Pay By Date', '2023/02/08')}
                </Stack>
            </div>
            {/* <div
                className="w-full"
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    paddingRight: '20px',
                    paddingTop: '20px',
                }}
            >

            </div> */}
        </div>
    )
}

export default PaymentVoucher
