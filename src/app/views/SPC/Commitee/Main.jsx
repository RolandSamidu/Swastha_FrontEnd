import React, { useContext } from 'react'
import { PageContextProvider, PageContext } from './PageContext'
import AllCommitess from './AllCommitees'
import NewCommitee from './NewCommitee'
import ViewCommitee from './ViewCommitee'

function PageHanlder() {
    const [pageData] = useContext(PageContext)
    switch (pageData.slug) {
        case 'all':
            return <AllCommitess />
        case 'new':
            return <NewCommitee />
        default:
            return <ViewCommitee />
    }
}

export default function Main() {
    return (
        <PageContextProvider>
            <PageHanlder />
        </PageContextProvider>
    )
}
