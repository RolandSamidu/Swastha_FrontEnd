/*
Loons Lab Sub title component
Developed By Roshan
Loons Lab
*/
import React, { Fragment, useState, Component } from 'react'
import { Divider, Typography, Grid, Box } from '@material-ui/core'
import ReactToPrint from 'react-to-print'
import { any, string } from 'prop-types'
import { Button, SubTitle } from 'app/components/LoonsLabComponents'
import Barcode from 'react-jsbarcode'
import UtilityServices from 'app/services/UtilityServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import ChiefPharmacistServices from 'app/services/ChiefPharmacistServices'
import localStorageService from 'app/services/localStorageService'
import moment from 'moment'
import { convertTocommaSeparated, dateParse, dateTimeParse, msdServiceChargesCal, msdTotalChagesCal, timeParse } from 'utils'
import { margin } from '@mui/system'
import { roundDecimal } from 'utils'
import { padding } from '@mui/system'
import ClinicService from 'app/services/ClinicService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import EstimationService from 'app/services/EstimationService'


class NewlineText extends Component { }

class PrintSubmitLetter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Loaded: false,
            PrintData: [],
            employeesList: [],
            all_item_class: [],
            estimationsValues: null,
            institute: null,
            userName: null,
            owner_id: null,
            empCountPerPage: 10

        }
    }



    async loadItemClass() {

        let class_res = await ClassDataSetupService.fetchAllClass({ limit: 99999 })
        if (class_res.status == 200) {
            console.log('Classes load', class_res.data.view.data)
            this.loadEmployeeList(class_res?.data?.view?.data)

        }
    }

    async loadEmployeeList(classList) {

        let classIds = classList?.map(x => x.id)
        let params = {
            hospital_estimation_id: this.props.hospital_estimation_id,
            class_id: classIds
        }
        this.loadEstimatedAmmount(classIds)

        let res = await EstimationService.getEstimationsVerificationEmployees(params)

        if (res.status == 200) {
            console.log("estimation verification data", res?.data?.view?.data);

            let temp = []
            for (let index = 0; index < res?.data?.view?.data.length; index++) {
                const element = res?.data?.view?.data[index];

                temp.push({

                    id: element.id,
                    hospital_estimation_verify_id: element.hospital_estimation_verify_id,
                    class_id: element?.HospitalEstimateVerify?.class_id,
                    verified_date: element.createdAt,
                    employee: element?.Employee

                })
            }

            this.setState({ employeesList: temp }, () => {
                this.reArrangeData(classList)
            })


        }
    }



    async reArrangeData(data) {

        const user = await localStorageService.getItem('userInfo');

        const empCountPerPage = this.state.empCountPerPage
        let consumableClasses = []
        let nonConsumableClasses = []

        for (let index = 0; index < data.length; index++) {
            const classElement = data[index];


            let filteredEmployeesList = this.state.employeesList.filter(x => x.class_id == classElement.id)

            if (filteredEmployeesList.length > 0) {//Eployess are assigned to class
                for (let empIndex = 0; empIndex < filteredEmployeesList.length; empIndex++) {
                    const employeeElement = filteredEmployeesList[empIndex];

                    console.log("employee", employeeElement.employee?.name)
                    console.log("employee class", classElement.description)
                    if (classElement.description.trim().endsWith("Non Consumable")) { //grouping by consumable non-consiumable
                        nonConsumableClasses.push({
                            code: classElement.code,
                            class_id: classElement.id,
                            description: classElement.description,
                            employee_name: employeeElement.employee?.name || user.name,
                            employee_designation: employeeElement.employee?.designation,
                            newPage: nonConsumableClasses.length % empCountPerPage == 0 ? true : false,
                            contentType: "Non Consumable",
                            newClass: (empIndex == 0 || nonConsumableClasses.length % empCountPerPage == 0) ? true : false


                        })
                    } else {
                        consumableClasses.push({
                            code: classElement.code,
                            class_id: classElement.id,
                            description: classElement.description,
                            employee_name: employeeElement.employee?.name || user.name,
                            employee_designation: employeeElement.employee?.designation,
                            newPage: consumableClasses.length % empCountPerPage == 0 ? true : false,
                            contentType: "Consumable",
                            newClass: (empIndex == 0 || consumableClasses.length % empCountPerPage == 0) ? true : false



                        })
                    }


                }

            } else {// No any assined employees

                if (classElement.description.trim().endsWith("Non Consumable")) { //grouping by consumable non-consiumable
                    nonConsumableClasses.push({
                        code: classElement.code,
                        class_id: classElement.id,
                        description: classElement.description,
                        employee_name: user.name,
                        employee_designation: "",
                        newPage: nonConsumableClasses.length % empCountPerPage == 0 ? true : false,
                        contentType: "Non Consumable",
                        newClass: true


                    })
                } else {
                    consumableClasses.push({
                        code: classElement.code,
                        class_id: classElement.id,
                        description: classElement.description,
                        employee_name: user.name,
                        employee_designation: "",
                        newPage: consumableClasses.length % empCountPerPage == 0 ? true : false,
                        contentType: "Consumable",
                        newClass: true


                    })
                }
            }



        }

        console.log("estimation data from print", this.props.estimationData)
        console.log("all arranged Data", [...consumableClasses, ...nonConsumableClasses])
        if (this.props.estimationData?.Estimation?.consumables == "Y") {
            this.setState({ PrintData: consumableClasses, Loaded: true })
        } else if (this.props.estimationData?.Estimation?.consumables == "N") {
            this.setState({ PrintData: nonConsumableClasses, Loaded: true })
        } else {
            this.setState({ PrintData: [...consumableClasses, ...nonConsumableClasses], Loaded: true })
        }



    }

    async loadEstimatedAmmount(classes) {

        let params = {
            search_type: "EstimationAmount",
            class_id: classes,
            hospital_estimation_id: this.props.hospital_estimation_id
        }

        let res = await EstimationService.getAllEstimationITEMS(params)
        if (res.status == 200) {
            console.log("loaded data estimation", res.data?.view)
            this.setState({ estimationsValues: res.data?.view })

        }

    }

    async loadInstitiute() {
        let owner_id = await localStorageService.getItem("owner_id")
        const user = await localStorageService.getItem('userInfo');

        let params = {
            issuance_type: ["Hospital", "RMSD Main"],
            // limit: 1, 
            // page: 0,
            'order[0]': ['createdAt', 'ASC'],
            selected_owner_id: [owner_id]
        };

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status == 200) {

            let department = res.data?.view?.data[0]?.Department?.name
            let institute = res.data?.view?.data[0]?.name
            console.log("institiute", institute)
            this.setState({ institute: `${institute} (${department})`, owner_id: owner_id, userName: user.name })
        }

    }


    componentDidMount() {
        this.loadInstitiute()
        this.loadItemClass()
    }


    footer(pageRemineHeight, pageItemCount) {
        return (
            <div class="w-full" style={{ marginTop: `${pageRemineHeight}px` }}  >


            </div>)
    }


    async getClassValue(class_id) {
        let valueData = this.state.estimationsValues?.find(x => x.class_id == class_id)
        return convertTocommaSeparated(this.state.estimationsValues?.find(x => x.class_id == class_id)?.total_value || 0, 2)

    }

    render() {
        const {
            header,
            footer,
            refferenceSection,
            myNo,
            yourNo,
            date,
            address,
            title,
            letterBody,
            signature,
            letterTitle,
            drugList,
            patientInfo,
            user_roles,
            clinic,
        } = this.props
        /*  size: 297mm 420mm; */

        const batch_count_perPage = 16;

        const pageStyle = `

        @media print {
            @page {
                size: letter portrait; /* auto is default portrait; */
                 margin: 0 !important;
               // margin-left:50px !important;
                
           
            }
            .item_break{
                border-top: 1px solid #a5a4a4;
                }
            .page-break-after {
                display: block !important;
                page-break-after: always;
                counter-reset: page;
              }
            .page-break-before {
                display: block !important;
                page-break-before: always;
                counter-reset: page;
            }
            
            .page-number::after {
                counter-increment: page;
                content: counter(page);
              }
            .header {
                counter-reset: section;
                list-style-type: none;
              }
              
           
          
              .header, .header-space {
                height: 220px;
              }
             
              .footer, .footer-space {
                height: 340px;
              }
              .header {
                position: fixed;
                top: 0;
              }
              .footer {
                position: fixed;
                bottom: 0;
              }
             
              .row { display:flex;}
              .cell {display:inline-block;}
            
              .row-height{height:18px !important}
          }
          
       `;

        let pageNo = 0;
        let totalValue = 0;
        let footerActive = false;


        return (
            <div className="hidden"  >
                <Grid >
                    <ReactToPrint
                        trigger={() => (
                            <Button
                                id="print_signSheet_004"
                                size="small"
                                startIcon="print"
                            >
                                Print
                            </Button>
                        )}
                        //onAfterPrint={() => {  }}
                        pageStyle={pageStyle}
                        documentTitle={"Signature Sheet"}
                        //removeAfterPrint
                        content={() => this.componentRef}
                    />
                </Grid>
                {this.state.Loaded ?
                    <Grid
                        className="bg-light-gray  "
                        style={{ borderStyle: 'double', borderColor: '#a5a4a4' }}
                    >
                        <div className="bg-white px-5 " ref={(el) => (this.componentRef = el)} >

                            <div className='w-full' style={{ paddingLeft: 50 }}>
                                {this.state.PrintData?.map((x, index) => {

                                    if (x.newPage) {
                                        pageNo = pageNo + 1
                                        totalValue = 0

                                    } else {
                                        let val = this.state.estimationsValues?.find(item => item.class_id == x.class_id)?.total_value || 0
                                        console.log("total values", val)
                                        totalValue = totalValue + Number(val)
                                    }
                                    return (
                                        <div className={x.newPage ? 'page-break-before text-10 flex ' : 'text-10'} >

                                            {x.newPage &&
                                                <div className='w-full' style={{ paddingTop: 15 }}>
                                                    <div className='w-full flex ' style={{ justifyContent: 'space-between' }}>

                                                        <div>
                                                            <table>
                                                                <tr>
                                                                    <td>SIGNATURE PAGE</td>
                                                                    <td>: </td>
                                                                    <td>{pageNo}   - {x.contentType}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Institution Code</td>
                                                                    <td>: </td>
                                                                    <td>{this.state.owner_id} </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Name of Institution</td>
                                                                    <td>: </td>
                                                                    <td>{this.state.institute}</td>
                                                                </tr>
                                                            </table>


                                                        </div>
                                                        <div>
                                                            <table>
                                                                <tr>
                                                                    <td>Date</td>
                                                                    <td>: </td>
                                                                    <td>{dateParse(new Date())} </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Time</td>
                                                                    <td>: </td>
                                                                    <td>{timeParse(new Date())} </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>User</td>
                                                                    <td>: </td>
                                                                    <td>{this.state.userName}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Page</td>
                                                                    <td>: </td>
                                                                    <td>{pageNo}</td>
                                                                </tr>
                                                            </table>

                                                        </div>

                                                    </div>



                                                    <div className='mt-5' style={{ borderBottomStyle: 'solid', borderWidth: 2, borderColor: '#a5a4a4' }}></div>

                                                    <div className='w-full'>
                                                        <table className='w-full'>
                                                            <tr>
                                                                <th style={{ width: '40%', textAlign: 'left' }}>Item Class and Description</th>
                                                                <th style={{ width: '20%', textAlign: 'left' }}>Prepared By</th>
                                                                <th style={{ width: '10%', textAlign: 'left' }}>Signature</th>
                                                                <th style={{ width: '10%', textAlign: 'left' }}>Date</th>
                                                                <th style={{ width: '20%', textAlign: 'left' }}>Value</th>
                                                            </tr>
                                                            <tr>
                                                                <th style={{ width: '40%', textAlign: 'left' }}></th>
                                                                <th style={{ width: '20%', textAlign: 'left' }}>(Name/ Designation)</th>
                                                                <th style={{ width: '10%', textAlign: 'left' }}></th>
                                                                <th style={{ width: '10%', textAlign: 'left' }}></th>
                                                                <th style={{ width: '20%', textAlign: 'left' }}>(Rs)</th>
                                                            </tr>
                                                        </table>
                                                    </div>

                                                </div>
                                            }

                                            {x.newClass &&
                                                <div id="border" className='w-full'
                                                    style={{ borderBottomStyle: 'dotted', borderWidth: 2, borderColor: 'black' }}
                                                ></div>

                                            }
                                            <table className='w-full'>

                                                <tr >
                                                    <td className='py-4' style={{ width: '40%' }}>{x.newClass ? x.description : ''}</td>
                                                    <td className='py-4' style={{ width: '20%' }}>{x.employee_name}</td>
                                                    <td className='py-4' style={{ width: '10%' }}></td>
                                                    <td className='py-4' style={{ width: '10%' }}></td>
                                                    <td className='py-4' style={{ width: '20%' }}>{x.newClass ? convertTocommaSeparated(this.state.estimationsValues?.find(item => item.class_id == x.class_id)?.total_value || 0, 2) : ''}</td>
                                                </tr>
                                                {index == this.state.PrintData.length - 1 &&
                                                    <tr >
                                                        <td className='py-4' style={{ width: '40%' }}></td>
                                                        <td className='py-4' style={{ width: '20%' }}></td>
                                                        <td className='py-4' style={{ width: '10%' }}></td>
                                                        <td className='py-4' style={{ width: '10%' }}></td>
                                                        <td className='py-4' style={{ width: '20%' }}>{convertTocommaSeparated(totalValue || 0, 2)}</td>
                                                    </tr>
                                                }
                                            </table>




                                            {(this.state.PrintData[index + 1]?.newPage || index == this.state.PrintData.length - 1) &&

                                                <div className='w-full mt-15'>
                                                    <table>
                                                        <tr> {x.contentType}</tr>
                                                        <tr>
                                                            Approved by :{this.state.userName}
                                                        </tr>
                                                        <tr>
                                                            Approved Date/Time :{dateTimeParse(new Date())}
                                                        </tr>
                                                        <tr>
                                                            We hereby Certify that time the Annual Estimate for year {this.props.estimationYear}, has been prepared within the limits of the financial allocation appropriated for the Division / Institution.
                                                        </tr>

                                                        <tr>
                                                            {'Value of Forecasted Requirement for ' + x.contentType + ' in the year ' + this.props.estimationYear + " Total Rs. " + convertTocommaSeparated(totalValue, 2) + " ."}
                                                        </tr>
                                                    </table>


                                                    <table className='w-full mt-10'>
                                                        <tr>
                                                            <td>
                                                                1....................................................
                                                            </td>
                                                            <td>
                                                                2....................................................
                                                            </td>
                                                            <td>
                                                                3....................................................
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                            </td>
                                                            <td>
                                                            </td>
                                                            <td>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                .......................................................
                                                            </td>
                                                            <td>
                                                                .......................................................
                                                            </td>
                                                            <td>
                                                                .......................................................
                                                            </td>
                                                        </tr>
                                                    </table>

                                                </div>}


                                        </div>
                                    )

                                })}
                            </div>
                        </div>


                    </Grid >
                    : null
                }
            </div>
        )
    }
}

export default PrintSubmitLetter
