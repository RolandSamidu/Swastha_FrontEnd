import React, { useContext } from 'react'
import { PageContextProvider, PageContext } from './PageContext'
import AllOrders from './AllOrders'
import SingleOrders from './SingleOrders'

function PageHanlder() {
    const [pageData] = useContext(PageContext)

    if (pageData.slug === 0) {
        return <AllOrders />
    } else {
        return <SingleOrders />
    }
}

export default function Main() {
    return (
        <PageContextProvider>
            <PageHanlder />
        </PageContextProvider>
    )
}
