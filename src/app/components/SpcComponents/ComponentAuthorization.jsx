import React from 'react'

export default function ComponentAuthorization({
    accessList,
    currentUser,
    children,
}) {
    const isValide = accessList.includes(currentUser)

    if (isValide) {
        return children
    } else {
        return <></>
    }
}
