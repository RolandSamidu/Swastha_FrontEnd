import React, { useContext } from 'react'
import { PageContextProvider, PageContext } from './PageContext'
import OrderList from './OrderList'
import CreatePO from './CreatePO'

function PageHanlder() {
    const [pageData] = useContext(PageContext)

    switch (pageData.slug) {
        case 'create':
            return <CreatePO />
        default:
            return <OrderList />

    }
}

export default function Main() {
    return (
        <PageContextProvider>
            <PageHanlder />
        </PageContextProvider>
    )
}
