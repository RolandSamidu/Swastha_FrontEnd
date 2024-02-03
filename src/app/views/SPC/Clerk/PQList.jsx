import React, { useState } from 'react'
import { LoonsTable } from 'app/components/LoonsLabComponents'

const defaultFilter = {
    order_list_item_id: '',
    limit: 10,
    page: 0,
}

export default function PQList() {
    const [tableData, setTableData] = useState([])
    const [filter, setFilter] = useState(defaultFilter)
    // const [dataIsLoading, setDataIsLoading] = useState(true)

    // TODO: handle api

    const tableColumns = [
        {
            name: 'OrderListItem',
            label: 'Manufacturer',
            options: {
                display: true,
                filter: true,
                sort: true,
            },
        },
        {
            name: 'OrderListItem',
            label: 'Country',
            options: {
                display: true,
                filter: true,
                sort: true,
            },
        },
        {
            name: 'OrderListItem',
            label: 'Local Agent',
            options: {
                display: true,
                filter: true,
                sort: true,
            },
        },
        {
            name: 'OrderListItem',
            label: 'NMRA Valid Up TO',
            options: {
                display: true,
                filter: true,
                sort: true,
            },
        },  {
            name: 'OrderListItem',
            label: 'PQ Valid Up Tou',
            options: {
                display: true,
                filter: true,
                sort: true,
            },
        },
    ]
    return (
        <div style={{minHeight:'40vh'}}>
            <LoonsTable
                id={'PQList'}
                data={tableData}
                columns={tableColumns}
            ></LoonsTable>
        </div>
    )
}
