import React from "react";
import {authRoles} from "../../auth/authRoles";

const PricingRoutes = [
    {
        path: '/pricing/add_Item_pricing',
        component: React.lazy(() => import('./AddNewPricing')),
        auth: authRoles.pricing
    } ,
    {
      path: '/pricing/changed_item_prices/:id/:name',
      component: React.lazy(() => import('./ChangedPrices')),
      auth: authRoles.pricing
  }   
]

export default PricingRoutes
