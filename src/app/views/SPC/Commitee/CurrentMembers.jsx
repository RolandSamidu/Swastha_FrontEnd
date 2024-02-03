import React, { useState } from 'react'
import {
    Grid,
    CircularProgress,
    Card,
    CardActions,
    CardContent,
} from '@material-ui/core'
import { MainContainer } from 'app/components/LoonsLabComponents'
import PersonIcon from '@mui/icons-material/Person'

const fontStyle = {
    fontWeight: 600,
    fontSize: '18px',
    padding:'1rem',
    background: '#CDE9FF',
    color: '#1400C7',
}

const fontStyle2 ={
    margin:0,
    textAlign:'center'
}

export default function CurrentMembers() {
    return (
        <MainContainer>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <p style={fontStyle}>Commitee Head</p>
                    <Card style={{width:"250px"}} variant="outlined">
                        <CardContent>
                            <PersonIcon
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    margin: '0 auto',
                                    display: 'flex',
                                    
                                }}
                            />
                            <p style={fontStyle2}>Dr.L.K. Perera</p>
                            <p style={fontStyle2}>Chairman</p>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <p style={fontStyle}>Commitee Head</p>
                </Grid>
                <Grid item xs={12}>
                    <p style={fontStyle}>Commitee Head</p>
                </Grid>
            </Grid>
        </MainContainer>
    )
}
