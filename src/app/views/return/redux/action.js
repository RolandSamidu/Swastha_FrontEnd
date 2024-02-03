import axios from "axios";
import actionTypes from "./actionTypes";
import * as apiroutes from '../../../../apiroutes';
const { default: localStorageService } = require("app/services/localStorageService");

export const closewareHouseModal = (dispatch, name) => {
  dispatch({
    type: actionTypes.MAKE_STATUS_FALSE,
    payload: name
  })
}
export const getAllMovingAndNonMovingItems = (dispatch, params) => {
  dispatch({
    type: actionTypes.FETCH_MOVING_AND_NONMOVING_ITEMS
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GET_ALL_MOVING_AND_NON_MOVING_ITEMS,
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_ALL_MOVING_AND_NONMOVING_ITEMS_SUCCESS,
      payload: result?.data?.view,
      pagination: { page: params.page, limit: params.limit }
    })

  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_ALL_MOVING_AND_NONMOVING_ITEMS_FAILURE,
      pagination: { page: params.page, limit: params.limit },
      payload: []
    })
  });

}

export const getAllCategories = (dispatch) => {
  dispatch({
    type: actionTypes.FETCH_ALL_CATEGORIES
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.CATEGORY_API,
    params: {
      limit: 9999
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_CATEGORIES_SUCCESS,
      payload: result?.data?.view?.data
    })

  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_CATEGORIES_FAILURE,
      payload: []
    })
  });

}

export const getAllClasses = (dispatch) => {
  dispatch({
    type: actionTypes.FETCH_ALL_CLASSES
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.CLASS_API,
    params: {
      limit: 9999
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_CLASSES_SUCCESS,
      payload: result?.data?.view?.data
    })

  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_CLASSES_FAILURE,
      payload: []
    })
  });

}


export const getAllGroups = (dispatch) => {
  dispatch({
    type: actionTypes.FETCH_ALL_GROUPS
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GROUP_API,
    params: {
      limit: 9999
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_GROUPS_SUCCESS,
      payload: result?.data?.view?.data
    })

  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_GROUPS_FAILURE,
      payload: []
    })
  });

}


export const getBathDetailsForReturn = (dispatch, id, params) => {
  dispatch({
    type: actionTypes.FETCH_BATCH_DETAILS
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GET_BATCHES_INFO_RETURN_REQUEST,
    params: {
      moving_item_id: id,
      page: params.page,
      limit: params.limit
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_BATCH_DETAILS_SUCCESS,
      payload: result?.data?.view
    })

  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_BATCH_DETAILS_FAILURE,
      payload: []
    })
  });

}


export const getDrugStoreDetails = (dispatch, params, userType, id) => {
  console.log(params, userType, id, "hhhhhhh")
  dispatch({
    type: actionTypes.FETCH_DRUG_STORE_DETAILS
  });
  const accessToken = localStorageService.getItem('accessToken');
  let API = userType === 'Drug Store Keeper'||userType === 'Chief MLT'||userType === 'Chief Radiographer' ? apiroutes.GET_ALL_WAREHOUSE + `/${null}` : apiroutes.GET_ALL_WAREHOUSE + `/${id}`;
  const options = {
    url: API,
    params: userType === 'Drug Store Keeper'||userType === 'Chief MLT'||userType === 'Chief Radiographer' ? params : '',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_DRUG_STORE_DETAILS_SUCCESS,
      payload: result?.data?.view
    })

  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_DRUG_STORE_DETAILS_FAILURE,
      payload: []
    })
  });
}


export const getWareHouseDetails = (dispatch, params) => {
  dispatch({
    type: actionTypes.FETCH_WAREHOUSE_DETAILS
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GET_WAREHOUSE_USERS,
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_WARE_HOUSE_SUCCESS,
      payload: result?.data?.view?.data
    })

  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_WARE_HOUSE_FAILURE,
      payload: []
    })
  });

}


export const getRemarks = (dispatch, params) => {
  dispatch({
    type: actionTypes.FETCH_REMARKS
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GET_RETURN_REMARKS,
    params: {
      limit: 10,
      page: 0,
      type: "Item Return Remark"
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_REMARKS_SUCCESS,
      payload: result?.data?.view?.data
    })

  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_REMARKS_FAILURE,
      payload: []
    })
  });

}



export const getAllReturnRequests = (dispatch, params) => {
  dispatch({
    type: actionTypes.FETCH_RETURN_REQUESTS
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GET_ALL_RETURN_REQUESTS,
    params: { ...params, 'order[0]': ['updatedAt', 'DESC'] },
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_RETURN_REQUESTS_SUCCESS,
      payload: result?.data?.view,
      pagination: { page: params.page, limit: params.limit }
    })

  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_RETURN_REQUESTS_FAILURE,
      pagination: { page: params.page, limit: params.limit },
      payload: []
    })
  });

}


export const getSingleReturnRequestItems = (dispatch, id, params) => {
  dispatch({
    type: actionTypes.FETCH_SINGLE_RETURN_REQUEST
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GET_SINGLE_RETURN_REQUESTS,
    params: {
      return_request_id: id,
      ...params
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_SINGLE_RETURN_REQUEST_SUCCESS,
      payload: result?.data?.view
    })

  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_SINGLE_RETURN_REQUEST_FAILURE,
      payload: []
    })
  });

}


export const getSingleReturnRequestDetails = (dispatch, id) => {
  dispatch({
    type: actionTypes.FETCH_SINGLE_RETURN_REQUEST_DETAIL
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GET_ALL_RETURN_REQUESTS + `/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    method: "GET"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_SINGLE_RETURN_REQUEST_DETAIL_SUCCESS,
      payload: result?.data?.view
    })

  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_SINGLE_RETURN_REQUEST_DETAIL_FAILURE,
      payload: []
    })
  });

}


export const createReturnRequests = (dispatch, payload, history) => {
  dispatch({
    type: actionTypes.INTIALIZE_STATUS
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GET_ALL_RETURN_REQUESTS,
    data: payload,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      contentType: "application/json"
    },
    method: "POST"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.CREATE_ORDER_REQUEST_SUCCESS
    });
  }).catch((error) => {
    dispatch({
      type: actionTypes.CREATE_ORDER_REQUEST_FAILURE,
    })
  });

}

export const resetCreateRequestStatus = (dispatch) => {
  dispatch({
    type: actionTypes.INTIALIZE_STATUS
  });
}


export const getPickupPersons = (dispatch) => {
  dispatch({
    type: actionTypes.FETCH_PICK_UP_PERSONS
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GET_PICKUP_PERSON_DETAILS,
    params: {
      page: 0,
      limit: 20,
      "type[0]": ["Helper", "Driver", "Pharmacist", "Counter Pharmacist",'Dispenser']
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      contentType: "application/json"
    },
    method: "GET"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_PICKUP_PERSONS_SUCCESS,
      payload: result?.data?.view?.data
    });
  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_PICKUP_PERSONS_FAILURE,
    })
  });

}


export const updatePickupPersons = (dispatch, payload, params, id) => {
  dispatch({
    type: actionTypes.INTIALIZE_PICKUP_PERSONS
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GET_ALL_RETURN_REQUESTS + "/" + id,
    data: payload,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      contentType: "application/json"
    },
    method: "PATCH"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.UPDATE_PICKUP_PERSONS_SUCCESS,
    });
    getAllReturnRequests(dispatch, { from: params.warehouse_id, page: params.page, limit: params.limit })
  }).catch((error) => {
    dispatch({
      type: actionTypes.UPDATE_PICKUP_PERSONS_FAILURE,
    })
  });

}



export const createReturnDeliveryRequests = (dispatch, payload, history) => {
  dispatch({
    type: actionTypes.INTIALIZE_CREATE_DELIVERY_RETURN_REQUESTS
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.RETURN_BULK_CHECKOUT,
    data: payload,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      contentType: "application/json"
    },
    method: "PUT"
  }

  console.log(history, "history")
  axios(options).then((result) => {
    dispatch({
      type: actionTypes.UPDATE_RETURN_BULK_CHECKOUT_SUCCESS,
    });
    history.push("/return/return-requests")
  }).catch((error) => {
    dispatch({
      type: actionTypes.UPDATE_RETURN_BULK_CHECKOUT_FAILURE,
    })
  });
}



export const adminApproveOrReject = (dispatch, id, payload) => {
  dispatch({
    type: actionTypes.INTIALIZE_APPROVE_OR_REJECT
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GET_ALL_RETURN_REQUESTS + "/" + id,
    data: payload,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      contentType: "application/json"
    },
    method: "PATCH"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.UPDATE_ADMIN_APPROVE_OR_REJECT_SUCCESS,
    });
  }).catch((error) => {
    dispatch({
      type: actionTypes.UPDATE_ADMIN_APPROVE_OR_REJECT_FAILURE,
    })
  });
}

export const adminApproveOrRejectReset = (dispatch) => {
  dispatch({
    type: actionTypes.INTIALIZE_APPROVE_OR_REJECT
  });
}


export const getItemsFromWarehouse = (dispatch, payload) => {
  dispatch({
    type: actionTypes.GET_ITEMS_FROM_WAREHOUSE_INITIALIZE,
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.GET_WAREHOUSE_ITEMS,
    data: payload,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      contentType: "application/json"
    },
    method: "POST"
  }

  axios(options).then((result) => {
    dispatch({
      type: actionTypes.GET_ITEMS_FROM_WAREHOUSE_SUCCESS,
      payload: result?.data?.posted?.data
    });
  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_ITEMS_FROM_WAREHOUSE_FAILURE,
      payload: []
    })
  });

}




export const linkToOrder  = (id,dispatch)=>{
  dispatch({
    type: actionTypes.INTIALIZE_ORDER_LINK
  });
  const accessToken = localStorageService.getItem('accessToken');
  const options = {
    url: apiroutes.ALL_ORDERS,
    params: {
      return_request_id:id
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      contentType: "application/json"
    },
    method: "GET"
  }

  axios(options).then((result) => {
    console.log(result?.data?.view?.data,"viewwww")
    dispatch({
      type: actionTypes.GET_ORDER_LINK_SUCCESS,
      payload:result?.data?.view?.data
    });
  }).catch((error) => {
    dispatch({
      type: actionTypes.GET_ORDER_LINK_FAILURE,
    })
  });

}