import React, {Component, Fragment} from 'react'
import {withStyles} from '@material-ui/core/styles'
import {Grid} from '@material-ui/core'
import {Button} from 'app/components/LoonsLabComponents'

const styleSheet = (theme) => ({})

class LowStockWarning extends Component {
    constructor(props) {
        super(props)
        this.state = {
            itemName: "Medicine",
            storeName: "Drug Store"
        }
    }

    componentDidMount() {
        let selectedObj = this
            .props
            .medDetails
            this
            .setState({itemName: selectedObj.itemName, storeName: selectedObj.drugStore})

    }
    render() {
        return (
            <Fragment>
                <div>
                    <p>{this.state.itemName}
                        stock balance is insufficient in {this.state.storeName}. Would you like to place the order from suggested Drug Store?</p>
                    <Grid
                        container="container"
                        style={{
                            justifyContent: 'flex-end'
                        }}>
                        <Grid
                            className="w-full flex justify-end"
                            item="item"
                            lg={6}
                            md={6}
                            sm={6}
                            xs={6}>
                            <Button className="mt-2" progress={false} type="submit" scrollToTop={true} startIcon="save"
                                // onClick={this.onSubmit}
                            >
                                <span className="capitalize">Yes</span>
                            </Button>

                            <Button
                                className="mt-2 ml-2"
                                progress={false}
                                type="submit"
                                scrollToTop={true}
                                startIcon="close"
                                onClick={() => {
                                    this.setState({lowStockWarning: false})
                                }}>
                                <span className="capitalize">No</span>

                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(LowStockWarning)