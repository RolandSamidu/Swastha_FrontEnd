import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import {
    Card,
    TextField,
    MenuItem,
    IconButton,
    Icon,
    Grid,
    Button,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import { themeColors } from "app/components/MatxTheme/themeColors";
import LoonsTable from "app/components/LoonsLabComponents/Table/LoonsTable";

const styleSheet = ((theme) => ({

}));

class AllTest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [
                {
                    year: "2020/21",
                    status: "Ongoing",
                    start_date: "05/08/2021",
                    end_date: "29/08/2021",
                    test_fee: "3000.00",
                    advertisment_status: "Pending"
                },
                {
                    year: "2019/20",
                    status: "Ongoing",
                    start_date: "14/08/2020",
                    end_date: "14/09/2020",
                    test_fee: "2500.00",
                    advertisment_status: "Published"
                }

            ],

            columns: [
                {
                    name: 'year', // field name in the row object
                    label: 'Acedemic Year', // column title that will be shown in table
                    options: {
                        filter: true,
                        //display: false
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'start_date',
                    label: 'Application Start Date',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'end_date',
                    label: 'Application End Date',
                    options: {
                        filter: true,
                    },
                },

                {
                    name: 'test_fee',
                    label: 'Aptitude Test Fee',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: "Action",
                    options: {
                        filter: false,
                        sort: false,
                        empty: true,
                        print: false,
                        download: false,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <Grid>
                                    <IconButton size="small" aria-label="delete">
                                        <VisibilityIcon className="text-green" />
                                    </IconButton>
                                    <IconButton size="small" className="text-secondary" aria-label="delete">
                                        <EditIcon />
                                    </IconButton>

                                </Grid>
                            );
                        }
                    }
                }
            ]

        }
    }

    loadPagination() {
        console.log("called")
    }

    render() {
        let { theme } = this.props;
        const { classes } = this.props


        return (
            <Fragment>
                <div className="pb-24 pt-7 px-main-8 ">
                    <Card elevation={6} className="px-main-8 py-10">
                        <LoonsTable
                            //title={"All Aptitute Tests"}
                            id={"allAptitute"}
                            data={this.state.data}
                            columns={this.state.columns}
                            options={{
                                serverSide: true,
                                count: 22,
                                rowsPerPage: 10,
                                page: 0,
                                onTableChange: (action, tableState) => {
                                    console.log(action, tableState);
                                    switch (action) {
                                        case 'changePage':
                                            console.log("okk", tableState.page)
                                            //this.changePage(tableState.page, tableState.sortOrder);
                                            break;
                                        case 'sort':
                                            //this.sort(tableState.page, tableState.sortOrder);
                                            break;
                                        default:
                                            console.log('action not handled.');
                                    }
                                }

                            }
                            }
                        ></LoonsTable>
                    </Card>

                </div>

            </Fragment >

        );
    }
}

export default withStyles(styleSheet)(AllTest);
