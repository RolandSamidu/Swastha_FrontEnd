import { Grid } from "@material-ui/core";
import { Button } from "app/components/LoonsLabComponents";
import React, { Fragment } from "react";

const NPDrugStatus = () => {
    return ( 
        <Fragment>
            <Grid
                className="pt-5 flex justify-center"
                container
                spacing={2}
            >
                <Grid
                    item
                >
                    <Button
                        variant="outlined"
                    >
                        Consultant : 4
                    </Button>
                </Grid>
                <Grid
                    item
                >
                    <Button
                        variant="outlined"
                    >
                        TO be approved by Director-hospital : 4
                    </Button>
                </Grid>
                <Grid
                    item
                >
                    <Button
                        variant="outlined"
                    >
                        CP : 4
                    </Button>
                </Grid>
                <Grid
                    item
                >
                    <Button
                        variant="outlined"
                    >
                        SCO : 4
                    </Button>
                </Grid>
                <Grid
                    item
                >
                    <Button
                        variant="outlined"
                    >
                        AD MSD : 4
                    </Button>
                </Grid>
                <Grid
                    item
                >
                    <Button
                        variant="outlined"
                    >
                        Director MSD : 4
                    </Button>
                </Grid>
                <Grid
                    item
                >
                    <Button
                        variant="outlined"
                    >
                        DDG MSD : 4
                    </Button>
                </Grid>
                <Grid
                    item
                >
                    <Button
                        variant="outlined"
                    >
                        DDHS : 4
                    </Button>
                </Grid>
                <Grid
                    item
                >
                    <Button
                        variant="outlined"
                    >
                        Secretary : 4
                    </Button>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default NPDrugStatus;