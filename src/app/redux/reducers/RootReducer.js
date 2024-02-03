import { combineReducers } from 'redux'
import ScrumBoardReducer from './ScrumBoardReducer'
import NotificationReducer from './NotificationReducer'
import EcommerceReducer from './EcommerceReducer'
import NavigationReducer from './NavigationReducer'
import returnReducer from '../../views/return/redux/returnReduer'
import orderingReducer from '../../views/ordering/redux/reducer'

const RootReducer = combineReducers({
    notifications: NotificationReducer,
    navigations: NavigationReducer,
    scrumboard: ScrumBoardReducer,
    ecommerce: EcommerceReducer,
    returnReducer: returnReducer,
    orderingReducer: orderingReducer,
})

export default RootReducer
