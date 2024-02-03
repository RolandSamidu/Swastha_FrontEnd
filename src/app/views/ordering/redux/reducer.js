import initialValues from './intialValues'
import actionTypes from './actionTypes'

const orderingReducer = function (state = initialValues, action) {
    switch (action.type) {
        case actionTypes.START_GET_SINGLE_ORDER_ITEMS: {
            return {
                ...state,
                singleOneOrderItemStatus: null,
            }
        }

        case actionTypes.START_GET_SINGLE_ORDER_ITEMS_TRUE: {
            return {
                ...state,
                singleOneOrderItemStatus: true,
            }
        }

        case actionTypes.GET_SINGLE_ORDER_ITEM_SUCCESS: {
            return {
                ...state,
                singleOneOrderItemStatus: true,
                singleOneOrderItemData: action?.payload,
            }
        }
        case actionTypes.GET_SINGLE_ORDER_ITEM_FAILURE: {
            return {
                ...state,
                singleOneOrderItemStatus: false,
                singleOneOrderItemData: null,
            }
        }
        case actionTypes.START_GET_STRENGTH_ITEM: {
            return {
                ...state,
                strengthStatus: null,
            }
        }
        case actionTypes.GET_STRENGTH_ITEM_SUCESS: {
            return {
                ...state,
                strengthStatus: true,
                strengthList: action?.payload,
            }
        }
        case actionTypes.GET_STRENGTH_ITEM_FAILURE: {
            return {
                ...state,
                strengthStatus: false,
                strengthList: null,
            }
        }

        case actionTypes.START_FORECAST: {
            return {
                ...state,
                forecastStatus: null,
            }
        }

        case actionTypes.CREATE_FORECAST_SUCCESS: {
            return {
                ...state,
                forecastStatus: true,
            }
        }

        case actionTypes.CREATE_FORECAST_FAILURE: {
            return {
                ...state,
                forecastStatus: false,
            }
        }

        case actionTypes.START_MOVING_NON_MOVING: {
            return {
                ...state,
                movingNonMovingStatus: null,
            }
        }

        case actionTypes.GET_MOVING_NON_MOVING_SUCCESS: {
            return {
                ...state,
                movingNonMovingStatus: true,
                movingNonMovingList: action.payload,
            }
        }

        case actionTypes.GET_MOVING_NON_MOVING_FAILURE: {
            return {
                ...state,
                movingNonMovingStatus: false,
                movingNonMovingList: null,
            }
        }

        case actionTypes.START_AGENTS: {
            return {
                ...state,
                agentStatus: null,
            }
        }

        case actionTypes.GET_AGENTS_SUCCESS: {
            return {
                ...state,
                agentStatus: true,
                agentData: action.payload,
            }
        }

        case actionTypes.GET_AGENTS_FAILURE: {
            return {
                ...state,
                agentStatus: false,
                agentData: null,
            }
        }

        case actionTypes.START_GET_STRENGTH_ITEM: {
            return {
                ...state,
                installmentStatus: null,
            }
        }

        case actionTypes.GET_INSTALLMENTS_SUCCESS: {
            return {
                ...state,
                installmentStatus: true,
                installmentList: action.payload,
            }
        }

        case actionTypes.GET_INSTALLMENTS_FAILURE: {
            return {
                ...state,
                installmentStatus: false,
                installmentList: null,
            }
        }

        case actionTypes.START_CREATE_INSTALLMENTS: {
            return {
                ...state,
                createInstallmentStatus: null,
            }
        }

        case actionTypes.CREATE_INSTALLMENTS_SUCCESS: {
            return {
                ...state,
                createInstallmentStatus: true,
            }
        }

        case actionTypes.CREATE_INSTALLMENTS_FAILURE: {
            return {
                ...state,
                createInstallmentStatus: false,
            }
        }



        case actionTypes.START_MSD_STOCKS: {
            return {
                ...state,
                msdStockStatus: true,
            }
        }

        case actionTypes.GET_STOCK_MSD_SUCCESS: {
            return {
                ...state,
                msdStockStatus: true,
                msdStockList:action.payload
            }
        }

        case actionTypes.GET_STOCK_MSD_FAILURE: {
            return {
                ...state,
                msdStockStatus: false,
                msdStockList:action.payload
            }
        }


        case actionTypes.START_MSD_DATE_STOCKS: {
            return {
                ...state,
                msdStockDateStatus: true,
            }
        }

        case actionTypes.GET_STOCK_MSD_DATE_SUCCESS: {
            return {
                ...state,
                msdStockDateStatus: true,
                msdStockDateList:action.payload
            }
        }

        case actionTypes.GET_STOCK_MSD_DATE_FAILURE: {
            return {
                ...state,
                msdStockDateStatus: false,
                msdStockDateList:action.payload
            }
        }


        case actionTypes.START_INSITUTIONAL_STOCKS: {
            return {
                ...state,
                insitutionalStatus: null,
            }
        }

        case actionTypes.GET_STOCK_INSITUTIONAL_SUCCESS: {
            return {
                ...state,
                insitutionalStatus: true,
                insitutionalList:action.payload
            }
        }

        case actionTypes.GET_STOCK_INSITUTIONAL_FAILURE: {
            return {
                ...state,
                insitutionalStatus: false,
                insitutionalList:null
            }
        }

        case actionTypes.GET_STOCK_MSD_DATE_SUCCESS: {
            return {
                ...state,
                insitutionalStatus: true,
                insitutionalList:action.payload
            }
        }

        case actionTypes.GET_STOCK_MSD_DATE_FAILURE: {
            return {
                ...state,
                insitutionalStatus: false,
                insitutionalList:action.payload
            }
        }

        case actionTypes.START_INSITUTIONAL_DATE_STOCKS: {
            return {
                ...state,
                insitutionalDateStatus: true,
            }
        }

        case actionTypes.GET_STOCK_INSITUTIONAL_DATE_SUCCESS: {
            return {
                ...state,
                insitutionalDateStatus: true,
                insitutionalDateList:action.payload
            }
        }

        case actionTypes.GET_STOCK_INSITUTIONAL_DATE_FAILURE: {
            return {
                ...state,
                insitutionalDateStatus: false,
                insitutionalDateList:action.payload
            }
        }

        case actionTypes.START_ORDER_QUANTITY: {
            return {
                ...state,
                orderQuantityStatus: null,
            }
        }

        case actionTypes.UPDATE_ORDER_SUCCESS: {
            return {
                ...state,
                orderQuantityStatus: true,
            }
        }

        case actionTypes.UPDATE_ORDER_FAILURE: {
            return {
                ...state,
                orderQuantityStatus: false,
            }
        }


        case actionTypes.START_PUT_ORDER: {
            return {
                ...state,
                putOrderStatus: null,
            }
        }

        case actionTypes.PUT_ORDER_SUCCESS: {
            return {
                ...state,
                putOrderStatus: true,
            }
        }

        case actionTypes.PUT_ORDER_FAILURE: {
            return {
                ...state,
                putOrderStatus: false,
            }
        }

        case actionTypes.START_PLACE_ORDER: {
            return {
                ...state,
                placeOrderStatus: null,
            }
        }

        case actionTypes.CREATE_PLACE_ORDER_SUCCESS: {
            return {
                ...state,
                placeOrderStatus: true,
            }
        }

        case actionTypes.CREATE_PLACE_ORDER_FAILURE: {
            return {
                ...state,
                placeOrderStatus: false,
            }
        }

        case actionTypes.START_UPCOMING_ORDERS: {
            return {
                ...state,
                upcomingOrderStatus: null,
            }
        }

        case actionTypes.GET_UPCOMING_ORDERS_SUCCESS: {
            return {
                ...state,
                upcomingOrderStatus: true,
                upcomingOrderData:action.payload
            }
        }

        case actionTypes.GET_UPCOMING_ORDERS_FAILURE: {
            return {
                ...state,
                upcomingOrderStatus: false,
                upcomingOrderData:[]
            }
        }

        case actionTypes.ESTIMATIONS_SUCCESS: {
            return {
                ...state,
                estimationStatus: true,
                estimationData:action.payload
            }
        }

        case actionTypes.START_ESTIMATIONS_ORDERS: {
            return {
                ...state,
                estimationStatus: null,
            }
        }

        case actionTypes.ESTIMATIONS_FAILURE: {
            return {
                ...state,
                estimationStatus: false,
            }
        }

        case actionTypes.ESTIMATIONS_SUCCESS_MONTHLY: {
            return {
                ...state,
                estimationStatusMonthly: true,
                estimationDataMonthly:action.payload
            }
        }

        case actionTypes.START_ESTIMATIONS_ORDERS: {
            return {
                ...state,
                estimationStatusMonthly: null,
            }
        }

        case actionTypes.ESTIMATIONS_FAILURE: {
            return {
                ...state,
                estimationStatusMonthly: false,
            }
        }


        //
        case actionTypes.START_CONSUMPTIONS_ORDERS: {
            return {
                ...state,
                consumptionsStatus: null,
            }
        }

        case actionTypes.CONSUMPTIONS_SUCCESS: {
            return {
                ...state,
                consumptionsStatus: true,
                consumptionsData:action.payload
            }
        }

        case actionTypes.CONSUMPTIONS_FAILURE: {
            return {
                ...state,
                consumptionsStatus: false,
            }
        }

        case actionTypes.CONSUMPTIONS_SUCCESS_MONTHLY: {
            return {
                ...state,
                consumptionsStatusMonthly: true,
                consumptionsDataMonthly:action.payload
            }
        }

        case actionTypes.START_CONSUMPTIONS_ORDERS_MONTHLY: {
            return {
                ...state,
                consumptionsStatusMonthly: null,
                
            }
        }

        case actionTypes.CONSUMPTIONS_FAILURE_MONTHLY: {
            return {
                ...state,
                consumptionsStatusMonthly: false,
            }
        }

        case actionTypes.START_APPROVAL: {
            return {
                ...state,
                approvalStatus: null,
            }
        }

        case actionTypes.APPROVAL_SUCCESS: {
            return {
                ...state,
                approvalStatus: true,
                
            }
        }

        case actionTypes.APPROVAL_FAILURE: {
            return {
                ...state,
                approvalStatus: false,
            }
        }

        case actionTypes.START_BATCH_DETAILS: {
            return {
                ...state,
                batchStatus: null,
            }
        }

        case actionTypes.GET_BATCH_SUCCESS: {
            return {
                ...state,
                batchStatus: true,
                batchData:action.payload
                
            }
        }

        case actionTypes.GET_BATCH_SUCCESS: {
            return {
                ...state,
                batchStatus: false,
            }
        }


        case actionTypes.START_DUE_ON_ORDER: {
            return {
                ...state,
                dueStatus: null,
            }
        }

        case actionTypes.GET_DUE_ON_ORDER_SUCCESS: {
            return {
                ...state,
                dueStatus: true,
                dueData:action.payload
                
            }
        }

        case actionTypes.GET_DUE_ON_ORDER_FAILURE: {
            return {
                ...state,
                dueStatus: false,
            }
        }

        
        case actionTypes.START_ORDER_ITEMS: {
            return {
                ...state,
                orderStatus: null,
            }
        }

        case actionTypes.GET_ORDER_ITEMS_SUCCESS: {
            return {
                ...state,
                orderStatus: true,
                orderData:action.payload
                
            }
        }

        case actionTypes.GET_ORDER_ITEMS_FAILURE: {
            return {
                ...state,
                orderStatus: false,
            }
        }

        case actionTypes.START_HISTORY: {
            return {
                ...state,
                historyStatus: null,
            }
        }

        case actionTypes.GET_HISTORY_SUCCESS: {
            return {
                ...state,
                historyStatus: true,
                historyData:action.payload
                
            }
        }

        case actionTypes.GET_HISTORY_FAILURE: {
            return {
                ...state,
                historyStatus: false,
            }
        }

        case actionTypes.START_UPDATE: {
            return {
                ...state,
                installmentUpdateStatus: null,
            }
        }

        case actionTypes.UPDATE_INSTALLMENT_SUCCESS: {
            return {
                ...state,
                installmentUpdateStatus: true,
                
            }
        }

        case actionTypes.UPDATE_INSTALLMENT_FAILURE: {
            return {
                ...state,
                installmentUpdateStatus: false,
            }
        }

        case actionTypes.START_DELETE: {
            return {
                ...state,
                installmentDeleteStatus: null,
            }
        }

        case actionTypes.DELETE_INSTALLMENT_SUCCESS: {
            return {
                ...state,
                installmentDeleteStatus: true,
                
            }
        }

        case actionTypes.DELETE_INSTALLMENT_FAILURE: {
            return {
                ...state,
                installmentDeleteStatus: false,
            }
        }



        
        default: {
            return {
                ...state,
            }
        }
    }
}

export default orderingReducer
