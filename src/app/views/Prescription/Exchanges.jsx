import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import { Grid } from '@material-ui/core'
import ExchangesToday from './components/pharmacist/ExchangesToday'
import ExchangeDetails from './components/pharmacist/ExchangeDetails'

const styleSheet = (palette, ...theme) => ({})

class Exchanges extends Component {
    constructor(props) {
        super(props)
        this.state = {
            patient: localStorage.getItem('patient'),
        }
    }

    render() {
        return (
            <>
                <Fragment>
                <div className="pb-24 pt-7 px-8 ">
                        <ExchangeDetails />
                    </div>
                <Grid
                        container
                        spacing={2}
                        style={{ display: 'flex', justifyContent: 'center' ,mt:"10px",mb:"10px" }}
                    >
                        <Grid item xs={3}>
                            <ExchangesToday />
                        </Grid>
                    </Grid>
                    
                    
                </Fragment>
            </>
        )
    }
}

export default withStyles(styleSheet)(Exchanges)
