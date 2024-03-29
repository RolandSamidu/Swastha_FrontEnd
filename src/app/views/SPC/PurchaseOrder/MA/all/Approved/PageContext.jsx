import React, { createContext, useState } from 'react'

const PageContext = createContext(null)

const pageData = {
    slug: 'all',
    approvalStatus: '',
    PONo: '',
    limit: 20,
    page: 0,
    status: '',
    total: 0,
    exchangeRate: 0,
    filterPONo: '',
    filterIndentNo: '',
    filterSearch: '',
    POStatus: '',
    id: '',
    isApproved: false,
}

const PageContextProvider = ({ children }) => (
    <PageContext.Provider value={useState(pageData)}>
        {children}
    </PageContext.Provider>
)

export { PageContext, PageContextProvider }
