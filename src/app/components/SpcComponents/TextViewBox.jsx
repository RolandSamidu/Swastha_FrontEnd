import { AlertTitle } from '@mui/material'
import { Alert } from '@mui/material'
import React from 'react'

const TextViewBox = ({ title, message, type }) => {
    return (
        <div
            style={{
                width: '300px',
                height: '100px',
                margin: '10px',
            }}
        >
            <Alert severity={type || 'info'} sx={{ borderRadius: '10px' }}>
                <AlertTitle>{title}</AlertTitle>
                {message}
            </Alert>
        </div>
    )
}

export default TextViewBox
