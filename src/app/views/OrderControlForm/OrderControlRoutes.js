import React from 'react'
import { authRoles } from '../../auth/authRoles'

const OrderControlRoutes = [
    {
        path: '/order_control_form',
        component: React.lazy(() => import('./OrderControlForm')),
        auth: authRoles.msd_estimation_view_sco,
    },
   


]

export default OrderControlRoutes
