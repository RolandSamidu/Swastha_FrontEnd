import initialValues from './intialValues'
import actionTypes from './actionTypes'

const returnReducer = function (state = initialValues, action) {
    switch (action.type) {
        case actionTypes.GET_ALL_MOVING_AND_NONMOVING_ITEMS_SUCCESS: {
            return {
                ...state,
                movingAndNonMovingItemsStatus: true,
                returnModePagination: action?.pagination,
                movingAndNonMovingItemsLists: action.payload,
            }
        }
        case actionTypes.FETCH_MOVING_AND_NONMOVING_ITEMS: {
            return {
                ...state,
                movingAndNonMovingItemsStatus: null,
            }
        }
        case actionTypes.GET_ALL_MOVING_AND_NONMOVING_ITEMS_FAILURE: {
            return {
                ...state,
                movingAndNonMovingItemsStatus: false,
                returnModePagination: action?.pagination,
                movingAndNonMovingItemsLists: action.payload,
            }
        }
        case actionTypes.FETCH_ALL_CATEGORIES: {
            return {
                ...state,
                categoriesStatus: null,
            }
        }
        case actionTypes.GET_CATEGORIES_SUCCESS: {
            return {
                ...state,
                categoriesStatus: true,
                categoriesList: action.payload,
            }
        }
        case actionTypes.GET_CATEGORIES_FAILURE: {
            return {
                ...state,
                categoriesStatus: false,
                categoriesList: action.payload,
            }
        }
        case actionTypes.FETCH_ALL_GROUPS: {
            return {
                ...state,
                groupStatus: null,
            }
        }
        case actionTypes.GET_GROUPS_SUCCESS: {
            return {
                ...state,
                groupStatus: true,
                groupList: action.payload,
            }
        }
        case actionTypes.GET_GROUPS_FAILURE: {
            return {
                ...state,
                groupStatus: false,
                groupList: action.payload,
            }
        }
        case actionTypes.FETCH_ALL_CLASSES: {
            return {
                ...state,
                classStatus: null,
            }
        }
        case actionTypes.GET_CLASSES_SUCCESS: {
            return {
                ...state,
                classStatus: true,
                classList: action.payload,
            }
        }
        case actionTypes.GET_CLASSES_FAILURE: {
            return {
                ...state,
                classStatus: false,
                classList: action.payload,
            }
        }
        case actionTypes.FETCH_BATCH_DETAILS: {
            return {
                ...state,
                batchDetailsForReturnStatus: null,
            }
        }
        case actionTypes.GET_BATCH_DETAILS_SUCCESS: {
            return {
                ...state,
                batchDetailsForReturnStatus: true,
                batchDetailsForReturn: action.payload,
            }
        }
        case actionTypes.GET_BATCH_DETAILS_FAILURE: {
            return {
                ...state,
                batchDetailsForReturnStatus: false,
                batchDetailsForReturn: action.payload,
            }
        }
        case actionTypes.FETCH_DRUG_STORE_DETAILS: {
            return {
                ...state,
                drugStoreStatus: null,
            }
        }
        case actionTypes.GET_DRUG_STORE_DETAILS_SUCCESS: {
            return {
                ...state,
                drugStoreStatus: true,
                drugStoreDetails: action.payload,
            }
        }
        case actionTypes.GET_DRUG_STORE_DETAILS_FAILURE: {
            return {
                ...state,
                drugStoreStatus: false,
                drugStoreDetails: action.payload,
            }
        }
        case actionTypes.FETCH_RETURN_REQUESTS: {
            return {
                ...state,
                allReturnRequestStatus: null,
            }
        }
        case actionTypes.GET_RETURN_REQUESTS_SUCCESS: {
            return {
                ...state,
                allReturnRequestStatus: true,
                returnRequestsPagination: action?.pagination,
                allReturnRequestDetails: action.payload,
            }
        }
        case actionTypes.GET_RETURN_REQUESTS_FAILURE: {
            return {
                ...state,
                allReturnRequestStatus: false,
                returnRequestsPagination: action?.pagination,
                allReturnRequestDetails: action.payload,
            }
        }
        case actionTypes.FETCH_SINGLE_RETURN_REQUEST: {
            return {
                ...state,
                singleReturnStatus: null,
            }
        }
        case actionTypes.GET_SINGLE_RETURN_REQUEST_SUCCESS: {
            return {
                ...state,
                singleReturnStatus: true,
                singleReturnDetails: action.payload,
            }
        }
        case actionTypes.GET_SINGLE_RETURN_REQUEST_FAILURE: {
            return {
                ...state,
                singleReturnStatus: false,
                singleReturnDetails: action.payload,
            }
        }
        case actionTypes.FETCH_SINGLE_RETURN_REQUEST_DETAIL: {
            return {
                ...state,
                singleReturnDetailStatus: null,
            }
        }
        case actionTypes.GET_SINGLE_RETURN_REQUEST_DETAIL_SUCCESS: {
            return {
                ...state,
                singleReturnDetailStatus: true,
                singleReturnDetailsInfo: action.payload,
            }
        }
        case actionTypes.GET_SINGLE_RETURN_REQUEST_DETAIL_FAILURE: {
            return {
                ...state,
                singleReturnDetailStatus: false,
                singleReturnDetailsInfo: action.payload,
            }
        }
        case actionTypes.FETCH_WAREHOUSE_DETAILS: {
            return {
                ...state,
                wareHouseStatus: null,
            }
        }
        case actionTypes.GET_WARE_HOUSE_SUCCESS: {
            return {
                ...state,
                wareHouseStatus: true,
                wareHouseDetails: action.payload,
            }
        }
        case actionTypes.GET_WARE_HOUSE_FAILURE: {
            return {
                ...state,
                wareHouseStatus: false,
                wareHouseDetails: action.payload,
            }
        }
        case actionTypes.FETCH_REMARKS: {
            return {
                ...state,
                remarksStatus: null,
            }
        }
        case actionTypes.GET_REMARKS_SUCCESS: {
            return {
                ...state,
                remarksStatus: true,
                remarksDetails: action.payload,
            }
        }
        case actionTypes.GET_REMARKS_FAILURE: {
            return {
                ...state,
                remarksStatus: false,
                remarksDetails: action.payload,
            }
        }
        case actionTypes.INTIALIZE_STATUS: {
            return {
                ...state,
                orderRequestStatus: null,
            }
        }
        case actionTypes.CREATE_ORDER_REQUEST_SUCCESS: {
            return {
                ...state,
                orderRequestStatus: true,
            }
        }
        case actionTypes.CREATE_ORDER_REQUEST_FAILURE: {
            return {
                ...state,
                orderRequestStatus: false,
            }
        }
        case actionTypes.FETCH_PICK_UP_PERSONS: {
            return {
                ...state,
                pickupPersonStatus: null,
            }
        }
        case actionTypes.GET_PICKUP_PERSONS_SUCCESS: {
            return {
                ...state,
                pickupPersonStatus: true,
                pickupPersonDetails: action.payload,
            }
        }
        case actionTypes.GET_PICKUP_PERSONS_FAILURE: {
            return {
                ...state,
                pickupPersonStatus: false,
                pickupPersonDetails: action.payload,
            }
        }
        case actionTypes.MAKE_STATUS_FALSE: {
            console.log(action.payload, 'KKKKKK')
            return {
                ...state,
                wareHouseName: action.payload,
                wareHouseStatusModal: !state.wareHouseStatusModal,
            }
        }
        case actionTypes.INTIALIZE_APPROVE_OR_REJECT: {
            return {
                ...state,
                approveOrRejectStatus: null,
            }
        }
        case actionTypes.UPDATE_ADMIN_APPROVE_OR_REJECT_SUCCESS: {
            return {
                ...state,
                approveOrRejectStatus: true,
            }
        }
        case actionTypes.UPDATE_ADMIN_APPROVE_OR_REJECT_FAILURE: {
            return {
                ...state,
                approveOrRejectStatus: false,
            }
        }
        case actionTypes.GET_ITEMS_FROM_WAREHOUSE_INITIALIZE: {
            return {
                ...state,
                getWarehouseItemsStatus: null,
            }
        }
        case actionTypes.GET_ITEMS_FROM_WAREHOUSE_SUCCESS: {
            return {
                ...state,
                getWarehouseItemsStatus: true,
                getWarehouseItemsData: action.payload,
            }
        }
        case actionTypes.GET_ITEMS_FROM_WAREHOUSE_FAILURE: {
            return {
                ...state,
                getWarehouseItemsStatus: false,
                getWarehouseItemsData: action.payload,
            }
        }
        case actionTypes.INTIALIZE_ORDER_LINK: {
            return {
                ...state,
                orderLinkStatus: null,
            }
        }
        case actionTypes.GET_ORDER_LINK_SUCCESS: {
            return {
                ...state,
                orderLinkStatus: true,
                orderLink:action.payload
            }
        }
        case actionTypes.GET_ORDER_LINK_FAILURE: {
            return {
                ...state,
                orderLinkStatus: false,
                orderLink:[]
            }
        }
        default: {
            return {
                ...state,
            }
        }
    }
}

export default returnReducer
