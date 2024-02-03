import React, { useState, useEffect, useCallback } from 'react'
import { LoonsTable } from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility'
import ModalLG from '../../../components/Modals/ModalLG'
import { IconButton, Tooltip, CircularProgress } from '@material-ui/core'
import PreProcumentService from 'app/services/PreProcumentService'

const defaultFilterData = {
    limit: 10,
    page: 0,
    orderlist_not_in: ''
}


const SingleItemViewPre = ({ singleOrderId }) => {
    const [filterData, setFilterData] = useState(defaultFilterData)
    const [noOfData, setNoOfData] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [dataIsLoading, setDataIsLoading] = useState(true)



    useEffect(() => {
        if (singleOrderId) {
            const params = { ...defaultFilterData, orderlist_not_in: singleOrderId };
            setFilterData(params);
        }
    }, [singleOrderId])

    const loadTableData = useCallback((params) => {
        setDataIsLoading(true);

        PreProcumentService.getPreviousItemList(params)
            .then((result) => {
                const { data, totalItems } = result.data.view;
                setNoOfData(totalItems);
                setTableData(data);
            })
            .catch((err) => {
                console.log("🚀 ~ file: SingleItemViewPre.jsx:144 ~ PreProcumentService.getPreviousItemList ~ err:", err);
            })
            .finally(() => {
                setDataIsLoading(false);
            });
    }, []);


    const tableColumn = [
        {
            name: 'procurement_number',
            label: 'Procurement Number',
            options: {
                display: true,
            },
        },
        {
            name: 'OrderList',
            label: 'Order list number',
            options: {
                display: true,
                filter: true,
                sort: true,
                customBodyRender: (OrderListItem) => OrderListItem.order_no,
            },
        },
        {
            name: 'quantity',
            label: 'QTY',
            options: {
                display: true,
            },
        },
        {
            name: 'ItemSnap',
            label: 'Item Price',
            options: {
                display: true,
                filter: true,
                sort: true,
                customBodyRender: (ItemSnap) => ItemSnap.item_unit_size,
            },
        },
        {
            name: 'ttotal_calculated_cost',
            label: 'Total Cost (LKR)M',
            options: {
                display: true,
            },
        },
        {
            name: 'OrderList',
            label: 'Priority Level',
            options: {
                display: true,
                filter: true,
                sort: true,
                customBodyRender: (OrderList) => OrderList.type,
            },
        },
        {
            name: 'procurement_method',
            label: 'Procurement Method',
            options: {
                display: true,
            },
        },
        {
            name: 'authority_level',
            label: 'Authority Level',
            options: {
                display: true,
            },
        },
        {
            name: 'stock_availability',
            label: 'Stock Availability',
            options: {
                display: false,
            },
        },
        {
            name: 'status',
            label: 'Status',
            options: {
                display: true,
            },
        },
        // {
        //     name: 'action',
        //     label: 'Action',
        //     options: {
        //         display: true,
        //         customBodyRenderLite: () => {
        //             return (
        //                 <ModalLG
        //                     title={`Procurement Number : DHS/P/ICB18/02`}
        //                     button={
        //                         <Tooltip title="View Document">
        //                             <IconButton>
        //                                 <VisibilityIcon color="primary" />
        //                             </IconButton>
        //                         </Tooltip>
        //                     }
        //                 >
        //                     {ViewProcurement()}
        //                 </ModalLG>
        //             )
        //         },
        //     },
        // },
    ]


    useEffect(() => {
        if(filterData.orderlist_not_in){
            loadTableData(filterData);
        }
    }, [filterData, loadTableData]);



    const tablePageHandler = (pageNumber) => {

        const updatedFilterData = { ...filterData, page: pageNumber };
        setFilterData(updatedFilterData);

    }


    return (
        <div>
            <div className="w-full">

                {dataIsLoading &&
                    <div
                        className="justify-center text-center w-full pt-12"
                        style={{ height: '40vh' }}
                    >
                        <CircularProgress size={30} />
                    </div>}
                {!dataIsLoading &&
                    <LoonsTable
                        id={'allOrderList'}
                        data={tableData}
                        columns={tableColumn}
                        options={{
                            pagination: true,
                            serverSide: true,
                            count: noOfData,
                            rowsPerPage: filterData.limit,
                            page: filterData.page,
                            onTableChange: (action, tableState) => {
                                switch (action) {
                                    case 'changePage':
                                        tablePageHandler(tableState.page)
                                        break
                                    case 'sort':
                                        //this.sort(tableState.page, tableState.sortOrder);
                                        break
                                    default:
                                        console.log('action not handled.')
                                }
                            },
                        }}
                    ></LoonsTable>
                }
            </div>
        </div>
    )
}

export default SingleItemViewPre

const ViewProcurement = () => {



    const HEADERS = [
        {
            name: 'expected_date',
            label: 'Expected Date',
            options: {
                display: true,
            },
        },
        {
            name: 'quantity',
            label: 'Quantity',
            options: {
                display: true,
            },
        },
        {
            name: 'estimated_unit_price',
            label: 'Estimated Unit Price (LKR)',
            options: {
                display: true,
            },
        },
        {
            name: 'estimated_cost',
            label: 'Estimated Cost',
            options: {
                display: true,
            },
        },
    ]
    const DATA = [
        {
            expected_date: '12/05/2022',
            quantity: '1800',
            estimated_unit_price: '324',
            estimated_cost: '21363.00',
        },
        {
            expected_date: '12/06/2022',
            quantity: '1322',
            estimated_unit_price: '234',
            estimated_cost: '1363.00',
        },
        {
            expected_date: '12/05/2022',
            quantity: '1800',
            estimated_unit_price: '324',
            estimated_cost: '21363.00',
        },
    ]

    return (
        <div style={{ minWidth: '800px' }}>
            <LoonsTable
                id={'procurement'}
                data={DATA}
                columns={HEADERS}
            ></LoonsTable>
        </div>
    )
}
