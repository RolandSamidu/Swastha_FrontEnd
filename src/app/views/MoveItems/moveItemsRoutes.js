import { authRoles } from "app/auth/authRoles"
import React from "react"
const moveItemsRoutes = [
    {
        path:'/transfer',
        component: React.lazy(()=> import('./Warehouses')),
        auth:authRoles.transfering
    },
    {
        path:'/transfering/detailsView/:id',
        component: React.lazy(()=> import('./DetailsView')),
        auth:authRoles.transfering
    },

]


export default moveItemsRoutes