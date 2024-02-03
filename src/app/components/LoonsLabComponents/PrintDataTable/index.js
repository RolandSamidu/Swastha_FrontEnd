import {  Grid } from '@material-ui/core'
import React, { Fragment, useState, Component } from "react";
import SubTitle from '../SubTitle'
import MUIDataTable, { TableHeadRow } from 'mui-datatables'
import { merge } from 'lodash'
import ReactToPrint from 'react-to-print'
import { dateParse} from 'utils'
import {
    Button,
} from 'app/components/LoonsLabComponents'

const pageStyle = `
    @page {
        margin-left:5mm;
        margin-right:5mm;
        margin-bottom:5mm;
        margin-top:8mm;
    }

    @table {
        tr {
            width: 5px,
        }
    }


    @media print {

        .print-table tr:not(:first-child):nth-of-type(22n+1) {
            page-break-before: always;
        }
        .print-table tbody {
            counter-reset: rowNumber;
        }
        .print-table tbody tr:not(:first-child) {
            counter-increment: rowNumber;
        }
        .print-table tbody tr:not(:first-child):before {
            content: counter(rowNumber) ".";
            display: inline-block;
            margin-right: 0.5em;
        }

        .header, .header-space,
            {
                height: 2000px;
            }
    .footer, .footer-space {
                height: 55px;
            }
            .footer {
                position: fixed;
                bottom: 0;
            }

    }
    `

        function getPropByString(obj, propString) {
            if (!propString) return obj
        
            var prop,
                props = propString.split('.')
        
            for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
                prop = props[i]
        
                var candidate = obj[prop]
                if (candidate !== undefined) {
                    obj = candidate
                } else {
                    break
                }
            }
            return obj[props[i]]
        }
        
        var obj = {
            foo: {
                bar: {
                    baz: 'x',
                },
            },
        }
        
        console.log(getPropByString(obj, 'foo.bar.baz')) // x

class PrintDataTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: props.title,
            data: props.data,
            tableHeaders: props.tableHeaders,
            invisibleTable: props.invisibleTable,
            from: props.from,
            to: props.to,
            tableStructure: props.tableStructure,
            dateTime:props.dateTime,
            loginUser:props.loginUser
            // printFunction: props.printFunction()
        }
    }

    render(){
        return(
                <div className=' my-5' >
                    <div className='flex justify-end' >
                        <ReactToPrint
                                trigger={() => (
                                    <Button id={"print_button_001"} size="small" startIcon="print">
                                        Print
                                    </Button>
                                )
                            }
                            onBeforeGetContent={() => console.log("Clicked the Print")}
                            // onBeforeGetContent={() => this.props.printFunction}
                                pageStyle={pageStyle}
                                // documentTitle={letterTitle}
                                content={() => this.componentRef}
                            />
                    </div>
                    <div ref= {(el) => (this.componentRef = el)}>
                        
                        {/* <Grid container>
                            <Grid item sm={12}>
                                <div className='flex justify-center' >
                                    <h4>{this.state.title}</h4>
                                </div>
                            </Grid>
                            <Grid item sm={12}>
                                <div className='flex' >
                                    { this.state.from != null ?  <p className='pr-10'>From : {this.state.from}</p> : null }
                                    { this.state.to != null ?  <p>To : {this.state.to}</p> : null }
                                </div>
                            </Grid>
                            <Grid item sm={12}>
                                <div className='w-full'>
                                <table style={{width: 500}}>
                                <thead>
                                    <tr>
                                    {this.state.tableHeaders.map((item, key) => (
                                        <th key={key}>
                                        {item.label}
                                        </th>
                                    ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data.map((item, key) => (
                                    <tr key={key}>
                                        {this.state.tableStructure.map((data, i) => (
                                        <td key={i}>{getPropByString(item, `${data.name}`)}</td>
                                        ))}
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                               
                                </div>
                            </Grid>
                            <Grid item sm={12}>
                                    <div className='footer w-full flex' style={{position: 'fixed', bottom: '0'}}>
                                            <hr></hr>
                                            <p>Printed by {this.state.loginUser}, {this.state.dateTime}</p>
                                    </div>
                            </Grid>

                        </Grid> */}

                        <div className='w-full mx-auto'>

                            <div className='w-full flex justify-center mt-1' >
                                <h4>{this.state.title}</h4>
                            </div>
                            <div className='flex' >
                                { this.state.from != null ?  <p className='pr-10'>From : {this.state.from}</p> : null }
                                { this.state.to != null ?  <p>To : {this.state.to}</p> : null }
                            </div>
                            <div style={{maxWidth:'100%'}}>
                                {/* <table
                                    border="1px solid black"
                                    style={{
                                        borderCollapse: 'collapse',
                                        textAlign: 'center',
                                        width: 'auto',
                                        maxWidth: '100%',
                                        height:'90vh',
                                        margineBottom : '5vh'
                                    }}
                                >
                                <tbody style={{width:'100%'}}>
                                    <tr>
                                        { this.state.tableHeaders.map((item, key) => 
                                            <th key={key} style={{fontSize: "16px", padding: "6px" }}>
                                               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.label}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </th>
                                        ) }        
                                    </tr>
                                        { 
                                        this.state.data.map((item, key) => 
                                            
                                            <tr key={key} style={{padding: "2px" , width : '5px'}}>
                                                    { this.state.tableStructure.map((data) => 
                                                        <td style={{width: '5px'}}> 
                                                            {data.name === "ItemSnapBatch.exd"
                                                                ? dateParse(getPropByString(item, `${data.name}`))
                                                                : getPropByString(item, `${data.name}`)}
                                                        </td>
                                                    )}
                                            </tr>
                                        )}  

                                </tbody>
                            </table>  */}

                                <table
                                    className="print-table"
                                    border="1px solid black"
                                    style={{
                                        borderCollapse: 'collapse',
                                        textAlign: 'center',
                                        width: 'auto',
                                        maxWidth: '100%',
                                        // height:'90vh',
                                        // margineBottom : '5vh'
                                        
                                    }}
                                >
                                    <tbody>
                                        <tr>
                                            { this.state.tableHeaders.map((item, key) => 
                                                <th key={key}>
                                                {item.label}
                                                </th>
                                            ) }        
                                        </tr>
                                        { 
                                        this.state.data.map((item, key)  => 
                                            <tr key={key}>
                                                { this.state.tableStructure.map((data, index) => 
                                                    <td > 
                                                        {data.name === "ItemSnapBatch.exd"
                                                            ? dateParse(getPropByString(item, `${data.name}`))
                                                            : getPropByString(item, `${data.name}`)}
                                                    </td>
                                                )}
                                            </tr>
                                        )}  
                                    </tbody>
                                </table>


                            

                                
                            </div>
                            <div className='footer w-full flex mt-0 pt-0' style={{position: 'fixed', bottom: '0', height: '50px'}}>
                                    <hr></hr>
                                    <p>Printed by {this.state.loginUser}, {this.state.dateTime}</p>
                            </div>
                            
                            
                            
                       
                {/* <MUIDataTable
                    title={title}
                    data={data}
                    columns={columns}
                    options={options}
                /> */}
                
                
                        </div>

                            
                        
                        {/* <div className="page-number"></div> */}
                        
                    </div> 
                    
                </div>
            )
    }
        
    };


       
    

export default PrintDataTable