import localStorageService from 'app/services/localStorageService'
import React, { createContext, useState, useEffect } from 'react'

const PageContext = createContext(null)

const pageData = {
    slug: 'all',
    approvalStatus: '',
    PONo: '',
    limit: 20,
    page: 0,
    filterPONo: '',
    filterIndentNo: '',
    filterSearch: '',
    POStatus: '',
    id: '',
    approval_id: '',
    userRoles: [],
    isApproved: false,
}

const PageContextProvider = ({ children }) => (
    <PageContext.Provider value={useState(pageData)}>
        {children}
    </PageContext.Provider>
)


export { PageContext, PageContextProvider }
