import React from 'react'
import { PageContextProvider } from './AllOrderListPage/PageContext'
import PageHandler from './AllOrderListPage/PageHandler'

export default function AllOrderList() {
    return (
        <PageContextProvider>
            <PageHandler />
        </PageContextProvider>
    )
}
