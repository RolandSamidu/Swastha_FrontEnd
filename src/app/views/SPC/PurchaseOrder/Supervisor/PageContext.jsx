import React, { createContext, useState } from 'react'

const PageContext = createContext(null)

const pageData = {
    slug: 'all',
    approvalStatus: '',
    PONo: '',
    limit: 10,
    page: 0,
    filterPONo:'',
    POStatus:'',
}

const PageContextProvider = ({ children }) => (
    <PageContext.Provider value={useState(pageData)}>
        {children}
    </PageContext.Provider>
)

export { PageContext, PageContextProvider }
