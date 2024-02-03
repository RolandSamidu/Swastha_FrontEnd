import React from "react";
import {authRoles} from "../../auth/authRoles";

const VehicleRoutes = [
    {
        path: '/vehicles/user',
        component: React.lazy(() => import('./User')),
        auth: authRoles.vehicles_view_new
    },
    {
        path: '/vehicles/addVehicle',
        component: React.lazy(() => import('./AddVehicle')),
        auth: authRoles.vehicles_view_new
    },
    {
        path: '/vehicles/vehicleType',
        component: React.lazy(() => import('./VehicleType')),
        auth: authRoles.vehicles_view_new
    },
    {
        path: '/vehicles/vehicleUser',
        component: React.lazy(() => import('./VehicleUser')),
        auth: authRoles.vehicles_view_new
    },
   
   
    
   
]

export default VehicleRoutes
