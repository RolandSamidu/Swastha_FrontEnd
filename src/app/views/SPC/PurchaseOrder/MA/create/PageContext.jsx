import React, { createContext, useState } from 'react'

const PageContext = createContext(null)

const pageData = {
    slug: 'all',
    userType: '',
    approvalStatus: '',
    orderNo: '',
    drugsType: '',
    limit: 20,
    page: 0,
    status: '',
    type: '',
    year: null,
    activeStep: 0,
    isPosted: false,
    PONo: null,
    dateTo: null,
    dateFrom: null,
    filterOrderNo: '',
    userRoles: [],
    orderId: ''
}

const PageContextProvider = ({ children }) => (
    <PageContext.Provider value={useState(pageData)}>
        {children}
    </PageContext.Provider>
)

export { PageContext, PageContextProvider }
