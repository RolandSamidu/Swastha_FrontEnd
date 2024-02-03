/*
Loons Lab Table component
Developed By Roshan
Loons Lab
*/
import React, { useRef, useState, useEffect, useCallback } from 'react'
import MUIDataTable from 'mui-datatables'
import { merge } from 'lodash'
import { WidthProvider } from 'react-grid-layout'

const LoonsTable = (data) => {
    const [isAlive, setIsAlive] = useState(true)
    const [userList, setUserList] = useState([])

    let drag = false
    let onTable = false
    const isDragging = useRef(false)
    const dragHeadRef = useRef()
    const [position, setPosition] = useState(0)

    const onMouseDown = useCallback((e) => {
        if (dragHeadRef.current && dragHeadRef.current.contains(e.target)) {
            isDragging.current = true
        }
    }, [])

    const onMouseUp = useCallback(() => {
        if (isDragging.current) {
            isDragging.current = false
        }
    }, [])

    const onMouseMove = useCallback((e) => {
        let tableele = document.getElementById(data.id)
        tableele.scroll(tableele.scrollLeft - e.movementX, 0)
    }, [])

    useEffect(() => {
        setUserList(data.data)

        let ele = document.getElementById(data.id + 'outer')
        //ele[0].id = "newID";
        let tableel = ele.getElementsByTagName('table')
        let tablebodyElement = tableel[0].closest('div')

        tablebodyElement.id = data.id
        tablebodyElement.classList.add('grabbable')
        console.log('el', tablebodyElement)

        document.addEventListener('mousedown', () => (drag = true))
        document.addEventListener('drop', () => (drag = false))
        document.addEventListener('mouseup', () => (drag = false))
        document.addEventListener('mousedown', () => (drag = true))
        document
            .getElementById(data.id)
            .addEventListener('mousemove', (e) =>
                drag ? onMouseMove(e) : null
            )
        document
            .getElementById(data.id)
            .addEventListener('dragover', (e) => (drag ? onMouseMove(e) : null))

        //document.addEventListener('mouseup', () => console.log("mouse up"));
        //document.addEventListener('dragenter', () => console.log("mouse dragenter"));
        //document.getElementById('tablediv').addEventListener('mousemove', (e) => drag ? console.log(e.movementX) : null);
    }, [onMouseMove, onMouseDown, onMouseUp])

    useEffect(() => {
        setUserList(data.data)
    }, [data])

    return (
        <div
            className='w-full'
            id={data.id + 'outer'}
            onMouseEnter={() => (onTable = true)}
            onMouseLeave={() => (onTable = false)}
        >
            <MUIDataTable
                title={data.title}
                data={userList}
                columns={data.columns}
                options={merge({}, defaultOptions, data.options)}

            />
        </div>
    )
}

const defaultOptions = {
    filterType: 'textField',
    sort: false,
    responsive: 'standard',
    //responsive: 'scrollMaxHight',
    //responsive: "vertical",
    //responsive: "scroll",
    //responsive: 'vertical',
    //tableBodyHeight: '500px',
    selectableRows: 'none', // set checkbox for each row
    search: false, // set search option
    filter: false, // set data filter option
    download: true, // set download option
    downloadOptions: {
        filterOptions: {
            useDisplayedColumnsOnly: true,
            useDisplayedRowsOnly: true,
        },
    },
    //resizableColumns: true,
    draggableColumns: {
        enabled: true,
    },
    // print: false, // set print option
    pagination: false, //set pagination option
    // viewColumns: false, // set column option
    elevation: 0,
    rowsPerPageOptions: [],
}

export default LoonsTable
