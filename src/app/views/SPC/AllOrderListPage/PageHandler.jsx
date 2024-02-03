import React, { useContext } from 'react'
import { PageContext } from './PageContext'
import AllOrders from './AllOrders'
import SingleOrders from './SingleOrders'

export default function PageHanlder() {
    const [pageData] = useContext(PageContext)

    if (pageData.slug === 0) {
        return <AllOrders />
    } else {
        return <SingleOrders />
    }
}
