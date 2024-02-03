import { Button, Chip, Grid, Icon, IconButton } from '@material-ui/core'
import React, { Component, Fragment, useState } from 'react'
import Carousel from "react-multi-carousel"
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { LoonsTable } from '../..'
import CardTitle from '../../CardTitle'
import LabeledInput from '../../LabeledInput'
import LoonsCard from '../../LoonsCard'
import MainContainer from '../../MainContainer'
import * as appConst from '../../../../../appconst'
import ExaminationServices from 'app/services/ExaminationServices'
import { dateParse } from 'utils'

const responsive = {
    desktop: {
        breakpoint: {
          max: 3000,
          min: 1024
        },
        items: 3,
        partialVisibilityGutter: 40
      },
      mobile: {
        breakpoint: {
          max: 464,
          min: 0
        },
        items: 1,
        partialVisibilityGutter: 30
      },
      tablet: {
        breakpoint: {
          max: 1024,
          min: 464
        },
        items: 2,
        partialVisibilityGutter: 30
      }
};



class ViewProcedures extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [{
                    widget_input_id: this.props.itemId,
                    question: "procedure_history",
                    other_answers: {
                        date: new Date(),
                        answers: []   
                    }
                }

                ]
            },
            columns: [
                {
                    name: 'procedureInput', // field name in the row object
                    label: 'Procedure', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    }
                },
                
                {
                    name: 'remarkInput',
                    label: 'Remark',
                    options: {},
                },

            ],
            data: []
        }
    }

    async loadData() {
        this.setState({
            loaded: false,
            data: [],
        })
        let params = {
            patient_id: window.dashboardVariables.patient_id,
            // widget_input_id: this.props.itemId,
            question: 'procedure_history',
            'order[0]': [
                'createdAt', 'DESC'
            ],
            limit: 10
        }


        let res;
        if (this.props.loadFromCloud) {

            res = await ExaminationServices.getDataFromCloud(params)
        } else {

            res = await ExaminationServices.getData(params)
        }
        //console.log("Examination Data ", res)
        if (200 == res.status) {
            console.log("Examination Data Procedure History", res.data.view.data)
            this.setState({ data: [] })
            let data = [];
            // let other_answers = [];

            res.data.view.data.forEach(element => {
                data.push(element.other_answers)
                // other_answers.push(element.other_answers)
            });
            this.setState({ data: data, loaded: true })
            // console.log("Examination Data blood pressure grap", this.state.data)
        }


    }

    componentDidMount() {
        // console.log("item id", this.props.itemId)
        this.loadData()
        //this.interval = setInterval(() => this.loadData(), 5000);
    }

    render () {
        return (
            <Fragment>
                <Grid style={{ width: '1000px', margin: 'auto' }} className='' item="item" lg={12} md={12} sm={12} xs={12}>
                    <Carousel
                                additionalTransfrom={0}
                                arrows
                                autoPlaySpeed={3000}
                                centerMode={false}
                                className=""
                                containerClass="container-with-dots"
                                dotListClass=""
                                draggable
                                focusOnSelect={false}
                                // infinite
                                itemClass=""
                                keyBoardControl
                                minimumTouchDrag={80}
                                pauseOnHover
                                renderArrowsWhenDisabled={false}
                                renderButtonGroupOutside={false}
                                renderDotsOutside={false}
                                responsive={responsive}
                                rewind={false}
                                rewindWithAnimation={false}
                                rtl={false}
                                shouldResetAutoplay
                                showDots={false}
                                sliderClass=""
                                slidesToSlide={1}
                                swipeable
                            >
                                {this.state.data.map((item) => (
                                    <div className='mx-4' style={{ width: '350px' }} >
                                        <div className='w-full flex justify-center' > {dateParse(item.date)} </div>
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'Complaints'}
                                        data={item.answers}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: false,
                                            serverSide: true,
                                            print: false,
                                            viewColumns: false,
                                            download: false,
                                            onTableChange: (action, tableState) => {
                                                console.log(action, tableState)
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(
                                                            tableState.page
                                                        )
                                                        break
                                                    case 'sort':
                                                        //this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                        ></LoonsTable>
                                    </div>
                                    
                                )) }
                            </Carousel>
                </Grid>
                            
            </Fragment>
        )
    }
}



export default ViewProcedures