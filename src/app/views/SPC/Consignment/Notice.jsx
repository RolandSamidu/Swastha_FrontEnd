import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import {
    IconButton,
    Dialog
} from '@material-ui/core'
import {
    CardTitle,
    Button
} from 'app/components/LoonsLabComponents'
import { Alert } from '@material-ui/lab'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { ValidatorForm } from 'app/components/LoonsLabComponents'

const styleSheet = (theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    specialNotice: {
        color: 'red',
        fontSize: 16,
        marginTop: 5

    }
})

class Notice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showNotice: false,
            notice: null
        }
    }

    async componentDidMount() {
        const { notice } = this.props;
        if (notice) {
            this.setState({ notice: notice })
        }
    }

    render() {
        let { theme } = this.props;
        const { classes } = this.props

        return (
            <Fragment>
                <Dialog maxWidth="md" fullWidth={true} open={this.state.showNotice}
                    onClose={() => {
                        // this.setState({ showNotice: false })
                    }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="NOTICE" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ showNotice: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className=" px-5 py-5">
                        <Alert severity='info'>
                            <div dangerouslySetInnerHTML={{ __html: this.state.notice }} />
                        </Alert>
                        <ValidatorForm onSubmit={() => {
                            this.setState({ showNotice: false })
                        }}>
                            <Button
                                className="mt-5"
                                //startIcon={<CancelIcon />}
                                type="submit"
                            >OK</Button>
                        </ValidatorForm>
                    </div>
                </Dialog>
            </Fragment >

        );
    }
}

export default withStyles(styleSheet)(Notice);
