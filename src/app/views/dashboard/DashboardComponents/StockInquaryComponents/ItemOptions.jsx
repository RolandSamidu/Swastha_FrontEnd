import React, { Component, Fragment } from "react";
import {
    LoonsTable,
    LoonsCard,
    MainContainer,
    SubTitle,
    Button
} from "app/components/LoonsLabComponents";
import { Grid, InputAdornment, CircularProgress,Chip } from '@material-ui/core'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import WarehouseServices from "app/services/WarehouseServices";
import { convertTocommaSeparated, dateParse, yearParse } from "utils";
import InventoryService from "app/services/InventoryService";
import EstimationService from "app/services/EstimationService";
import SearchIcon from '@material-ui/icons/Search';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import { withStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const styles = {
    /*  root: {
         '& > * + *': {
             marginTop: theme.spacing(2),
         },
     }, */
    tableHeadCell: {
        width: '8.3%', textAlign: 'center', backgroundColor: '#05e383', fontWeight: 600
    },
    tabledataCell: {
        textAlign: 'center'
    }
};

class ItemOptions extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: true,

        }
    }

    /*  async getData() {
         this.props.item_id
     } */



    componentDidMount() {
        /*  if(this.props.item_id){
             this.setState({loaded:true})
         } */

    }



    render() {
        const { classes } = this.props
        
        return (
            <Fragment>
                <Grid container className="px-main-4 m-1">



                    {this.state.loaded ?

                        <div className="w-full">
                            <Grid container spacing={1}>
                                <Grid item>
                                <Chip
                                            //icon={<FaceIcon />}
                                            label="Item Description"
                                            clickable
                                            color="primary" 
                                            onDelete={() => {
                                               

                                            }}
                                            onClick={() => {
                                               // window.location.href = `/item-mst/view-item-mst/${this.props.item_id}`
                                                window.open(`/item-mst/view-item-mst/${this.props.item_id}`, '_blank')
                                            }}
                                            deleteIcon={<ArrowForwardIosIcon />}
                                            variant="outlined"
                                        />
                                </Grid>

                                <Grid item>
                                <Chip
                                            //icon={<FaceIcon />}
                                            label="NMRA"
                                            clickable
                                            color="primary" 
                                            onDelete={() => {
                                               

                                            }}
                                            onClick={() => {
                                               

                                            }}
                                            deleteIcon={<ArrowForwardIosIcon />}
                                            variant="outlined"
                                        />
                                </Grid>

                            </Grid>

                        </div>

                        :
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30} />
                        </Grid>
                    }


                </Grid>
            </Fragment>
        );
    }
}


export default withStyles(styles)(ItemOptions)