import React, { createContext, useState } from 'react'

const PageContext = createContext(null)

const pageData = {
    slug: 0,
    userType: '',
    approvalStatus: '',
    orderNo: '',
    drugsType: '',
    limit: 10,
    page: 0,
    status: 'SPC.APPROVED',
}

const PageContextProvider = ({ children }) => (
    <PageContext.Provider value={useState(pageData)}>
        {children}
    </PageContext.Provider>
)

export { PageContext, PageContextProvider }
