import React, { useContext } from 'react'
import { PageContextProvider, PageContext } from './PageContext'
import OrderList from './AllPurchaseOrder'
import PurchaseOrder from './PurchaseOrder'

function PageHanlder() {
    const [pageData] = useContext(PageContext)

    switch (pageData.slug) {
        case 'po':
            return <PurchaseOrder />
        default:
            return <OrderList />
    }
}

export default function Reject() {
    return (
        <PageContextProvider>
            <PageHanlder />
        </PageContextProvider>
    )
}
