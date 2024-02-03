import { Drawer, Grid, Icon } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
import {
    Button,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import ScrollDialog from 'app/components/LoonsLabComponents/ScrollModal/ScrollDialog'
import React, { Component, Fragment } from 'react'
import ReactGridLayout from 'react-grid-layout'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'

const styleSheet = (theme) => ({})

//Layout structure
const layout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
    { i: 'b', x: 1, y: 1, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: 'c', x: 2, y: 2, w: 1, h: 2 },
    { i: 'd', x: 3, y: 4, w: 2, h: 2, isDraggable: false },
]

//Dashboard categories
let dashBoardCategories = [
    { id: 1, name: 'Cardio' },
    { id: 2, name: 'Ulcer' },
    { id: 3, name: 'Abdomen' },
    { id: 4, name: 'Thyroid' },
]

//set of widgets basing the categories (cat to widget ====> one to many)
let widgetSet = [
    //thyroid
    { id: 1, type: 'cancer', detail1: 'sad1', name: 'Thyroid', catId: 4 },
    { id: 2, type: 'cancer', detail1: 'sad2', name: 'Thyroid Gland', catId: 4 },
    {
        id: 3,
        type: 'cancer',
        detail1: 'sad3',
        name: 'Clinical Conclusion',
        catId: 4,
    },
    { id: 4, type: 'cancer', detail1: 'sad4', name: 'Thyroid', catId: 4 },
    //cardio
    { id: 5, period: 4, detail: 'n/a', name: 'Pulse', catId: 1 },
    { id: 6, period: 4, detail: 'n/a', name: 'Chest Determities', catId: 1 },
    { id: 7, period: 4, detail: 'n/a', name: 'Apex', catId: 1 },
    { id: 8, period: 4, detail: 'n/a', name: 'Murinmar', catId: 1 },
]

function Widget({ id, backgroundColor, transferObj }) {
    return (
        <div style={{ width: '100%', height: '100%', backgroundColor }}>
            {JSON.stringify(transferObj)}
        </div>
    )
}

export class DashBoardView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formData: {
                dashboardCatId: null,
            },
            //applicable widget set for the selected dashboard category
            widgetSet: [],
            panelOpen: false,
            //finally selectd widget set which is rendered to the dashboard
            selectedWidgetSet: [],
            //modal which is opended when add widget is selected
            scrollActive: false,
            //widget selected
            selectedWidget: null,
            //object which represents the applicable fields
            finalSelectedWidgetSet: [],
            //layout of the grid items
            layoutDatSet: [],
        }
    }

    //Toggle the draw4er
    handleDrawerToggle = () => {
        this.setState({
            panelOpen: !this.state.panelOpen,
        })
    }

    //Category wise dash board submit
    handleCategoryDashboardSubmit = () => {
        this.setState({
            panelOpen: true,
        })
    }

    //Select the widget set
    handleWidgetSelect = (val) => {
        this.setState({
            selectedWidget: val,
            scrollActive: true,
        })
    }

    //everytime layout is changed this call back is called
    handleLayoutChange = (layout) => {
        // console.log('Layout ===>', layout)
    }

    //toggle the scroll bar
    handleScrollClose = () => {
        this.setState({ scrollActive: false })
    }

    handleFinalSelectedWidgetSubmit = (val) => {
        let previousState = this.state.layoutDatSet

        console.log('Before Updated Array=====>', previousState)

        let x = this.generateCurrentLayout(this.state.selectedWidget)
        previousState.push(x)

        console.log('Generated x==========>', x)
        console.log('Updated Array=====>', previousState)
        // set laout id
        val.layoutId = this.state.selectedWidget.id
        this.setState(
            {
                finalSelectedWidgetSet: [
                    ...this.state.finalSelectedWidgetSet,
                    val,
                ],
                layoutDatSet: previousState,
                //close the modal
                scrollActive: false,
            },
            () => {
                console.log('Updated state===>', this.state.layoutDatSet)
            }
        )
    }

    //generate the layouy object basing the current divs x and y coordinates
    generateCurrentLayout = (selectedWidget) => {
        let layoutObj
        let incrementer = 2

        //initial layout ==> no data is present in the dashboard
        if (0 == this.state.layoutDatSet.length) {
            layoutObj = { i: selectedWidget.id, x: 0, y: 0, w: 1, h: 2 }
        } else {
            //get the last object and increment by incrmeented
            let lastObj =
                this.state.layoutDatSet[this.state.layoutDatSet.length - 1]

            console.log('lat Obj========>', this.state.layoutDatSet.length)
            console.log('lat Obj========>', lastObj)

            lastObj.i = selectedWidget.id
            lastObj.x += incrementer
            lastObj.y += incrementer

            console.log('lat Obj After========>', lastObj)

            layoutObj = lastObj
        }

        return layoutObj
    }

    render() {
        return (
            <Fragment>
                <ScrollDialog
                    toggle={this.state.scrollActive}
                    handleScrollClose={this.handleScrollClose}
                    selectedWidget={this.state.selectedWidget}
                    handleFinalSelectedWidgetSubmit={
                        this.handleFinalSelectedWidgetSubmit
                    }
                />
                <MainContainer>
                    <ValidatorForm
                        className="pt-2"
                        onSubmit={() => this.handleDataSubmit()}
                        onError={() => null}
                    >
                        <Grid container spacing={3}>
                            {/* Dashboard Category */}
                            <Grid item lg={4} md={4} sm={4} xs={4}>
                                <SubTitle title="Dashboard Category" />
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={dashBoardCategories}
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            let formData = this.state.formData
                                            formData.dashboardCatId = value.id

                                            //set the applicable widget set
                                            let applicableWidgets =
                                                widgetSet.filter(
                                                    (widgetObj) =>
                                                        widgetObj.catId ==
                                                        value.id
                                                )

                                            this.setState({
                                                formData,
                                                widgetSet:
                                                    applicableWidgets.length
                                                        ? applicableWidgets
                                                        : [],
                                            })
                                        }
                                    }}
                                    value={dashBoardCategories.find(
                                        (obj) =>
                                            obj.id ==
                                            this.state.formData.dashboardCatId
                                    )}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Dashboard Category"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Submit  */}
                            <Grid item lg={6} md={6} sm={4} xs={4}>
                                {/* Submit and cancel */}
                                <Grid container spacing={2}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        {/* Submit Button */}
                                        <Button
                                            className="mr-2 mt-4"
                                            progress={false}
                                            // type="submit"
                                            scrollToTop={true}
                                            startIcon="save"
                                            onClick={
                                                this
                                                    .handleCategoryDashboardSubmit
                                            }
                                        >
                                            <span className="capitalize">
                                                {this.state.isUpdate
                                                    ? 'Update'
                                                    : 'Submit'}
                                            </span>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ValidatorForm>

                    {/* React - grid-start */}
                    <ReactGridLayout
                        className="layout"
                        layout={this.state.layoutDatSet}
                        cols={12}
                        rowHeight={60}
                        width={1200}
                        onLayoutChange={this.handleLayoutChange}
                    >
                        {this.state.finalSelectedWidgetSet.map((obj) => {
                            return (
                                <div key={obj.layoutId}>
                                    <Widget
                                        id={obj.layoutId}
                                        backgroundColor="#867ae9"
                                        transferObj={obj}
                                    />
                                </div>
                            )
                        })}
                    </ReactGridLayout>

                    {/* Grid layout */}

                    {/* Drawer for widgets */}
                    <Drawer
                        width={'300px'}
                        variant="temporary"
                        anchor={'right'}
                        open={this.state.panelOpen}
                        onClose={this.handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        <div className="">
                            <div className="notification__topbar elevation-z6 flex items-center p-4">
                                <Icon color="primary">notifications</Icon>
                                <h5 className="ml-2 my-0 font-medium">
                                    Notifications
                                </h5>
                            </div>

                            {this.state.widgetSet.map((obj) => {
                                return (
                                    <>
                                        <h6>{obj.name}</h6>
                                        <button
                                            onClick={() => {
                                                this.handleWidgetSelect(obj)
                                            }}
                                        >
                                            Add This
                                        </button>
                                    </>
                                )
                            })}
                        </div>
                    </Drawer>
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(DashBoardView)
