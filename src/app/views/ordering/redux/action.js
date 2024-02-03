import axios from "../../../../myaxios"
import actionTypes from './actionTypes'
import * as apiroutes from '../../../../apiroutes'
const {
    default: localStorageService,
} = require('app/services/localStorageService')

export const getSingleOrderRequirementItem = (dispatch, id) => {
    dispatch({
        type: actionTypes.START_GET_SINGLE_ORDER_ITEMS,
    })
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.GET_SINGLE_ORDER + '/' + id,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    }

    axios(options)
        .then((result) => {
            dispatch({
                type: actionTypes.GET_SINGLE_ORDER_ITEM_SUCCESS,
                payload: result?.data?.view,
            })
            getStrenghts(dispatch, result?.data?.view?.sr_no)
        })
        .catch((error) => {
            dispatch({
                type: actionTypes.GET_SINGLE_ORDER_ITEM_FAILURE,
                payload: null,
            })
        })
}

export const getStrenghts = (dispatch, search) => {
    let string = search
    string = string.slice(0, -1)
    string = string.slice(0, -1)

    dispatch({
        type: actionTypes.START_GET_STRENGTH_ITEM,
    })
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.ITEMS_PATH_NEW,
        params: {
            search: string,
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    }

    axios(options)
        .then((result) => {
            dispatch({
                type: actionTypes.GET_STRENGTH_ITEM_SUCESS,
                payload: result?.data?.view?.data,
            })
        })
        .catch((error) => {
            dispatch({
                type: actionTypes.GET_STRENGTH_ITEM_FAILURE,
                payload: null,
            })
        })
}

export const createForeCast = (dispatch, payload, id,save_or_edit,payload2) => {
    console.log(save_or_edit,"save",payload2)
    dispatch({
        type: actionTypes.START_FORECAST,
    })
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.ITEMS_PATH + '/' + id,
        data: payload,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'PATCH',
    }

    axios(options)
        .then((result) => {
            dispatch({
                type: actionTypes.CREATE_FORECAST_SUCCESS,
                payload: true,
            })
            getSingleOrderRequirementItem(dispatch, id);
            if(save_or_edit === "save" || save_or_edit ==="update_and_send_for_approval"){
                approvalProcess(dispatch,payload2,id)
            }
        })
        .catch((error) => {
            dispatch({
                type: actionTypes.CREATE_FORECAST_FAILURE,
                payload: false,
            })
        })
}

export const stockEstimates = (dispatch, params) => {
    dispatch({
        type: actionTypes.START_MOVING_NON_MOVING,
    })
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.GET_ALL_MOVING_AND_NON_MOVING_ITEMS,
        params,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    }

    axios(options)
        .then((result) => {
            console.log(result, 'result>>>>')
            dispatch({
                type: actionTypes.GET_MOVING_NON_MOVING_SUCCESS,
                payload: result?.data?.view?.data,
            })
        })
        .catch((error) => {
            dispatch({
                type: actionTypes.GET_MOVING_NON_MOVING_FAILURE,
                payload: null,
            })
        })
}
export const getAllAgents = (dispatch, id) => {
    dispatch({
        type: actionTypes.START_AGENTS,
    })
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.GET_ALL_AGENTS,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    }

    axios(options)
        .then((result) => {
            dispatch({
                type: actionTypes.GET_AGENTS_SUCCESS,
                payload: result?.data?.view?.data,
            })

            getSingleOrderRequirementItem(dispatch, id)
        })
        .catch((error) => {
            dispatch({
                type: actionTypes.GET_AGENTS_FAILURE,
                payload: null,
            })
        })
}

export const sendOrderQuantity = (dispatch, payload, id) => {
    dispatch({
        type: actionTypes.START_ORDER_QUANTITY,
    })
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.ITEMS_PATH + '/' + id,
        data: payload,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'PATCH',
    }

    axios(options)
        .then((result) => {
            dispatch({
                type: actionTypes.UPDATE_ORDER_SUCCESS,
            })

            getSingleOrderRequirementItem(dispatch, id)
        })
        .catch((error) => {
            dispatch({
                type: actionTypes.UPDATE_ORDER_FAILURE,
            })
        })
}

export const placeOrder = (dispatch, payload) => {
    dispatch({
        type: actionTypes.START_PLACE_ORDER,
    })
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.ITEMS_PATH + '/order_exchange' ,
        data:payload,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
    }

    axios(options)
        .then((result) => {
            dispatch({
                type: actionTypes.CREATE_PLACE_ORDER_SUCCESS,
            })

        })
        .catch((error) => {
            dispatch({
                type: actionTypes.CREATE_PLACE_ORDER_FAILURE,
            })
        })
}


export const putOrder = (dispatch,id) => {
    dispatch({
        type: actionTypes.START_PUT_ORDER,
    })
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.ITEMS_PATH + '/status/' + id,
        data:{
            "status":"Order"
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'PUT',
    }

    axios(options)
        .then((result) => {
            dispatch({
                type: actionTypes.PUT_ORDER_SUCCESS,
            })
        })
        .catch((error) => {
            dispatch({
                type: actionTypes.PUT_ORDER_FAILURE,
            })
        })
}

export const putOrderRevert =(dispatch)=>{
    dispatch({
        type: actionTypes.START_PUT_ORDER,
    });
}

export const getInstallments = (dispatch, params) => {
    dispatch({
        type: actionTypes.START_INSTALLMENTS,
    })
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.GET_INSTALLMENTS,
        params,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    }

    axios(options)
        .then((result) => {
            dispatch({
                type: actionTypes.GET_INSTALLMENTS_SUCCESS,
                payload: result?.data?.view,
            })
        })
        .catch((error) => {
            dispatch({
                type: actionTypes.GET_INSTALLMENTS_FAILURE,
                payload: null,
            })
        })
}



export const getAllUpcomingOrders = (dispatch, params) => {
    dispatch({
        type: actionTypes.START_UPCOMING_ORDERS,
    })
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.GET_UPCOMING_ORDERS,
        params,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    }

    axios(options)
        .then((result) => {
            dispatch({
                type: actionTypes.GET_UPCOMING_ORDERS_SUCCESS,
                payload: result?.data?.view,
            })
        })
        .catch((error) => {
            dispatch({
                type: actionTypes.GET_UPCOMING_ORDERS_FAILURE,
                payload: null,
            })
        })
}

export const addInstallment = (dispatch, payload) => {
    dispatch({
        type: actionTypes.START_CREATE_INSTALLMENTS,
    })
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.GET_INSTALLMENTS,
        data: payload,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
    }

    axios(options)
        .then((result) => {
            dispatch({
                type: actionTypes.CREATE_INSTALLMENTS_SUCCESS,
            })

            getInstallments(dispatch, {
                requirement_item_id: payload.requirement_item_id,
            })
        })
        .catch((error) => {
            dispatch({
                type: actionTypes.CREATE_INSTALLMENTS_FAILURE,
            })
        })
}

export const getStockItems = (dispatch, params, type) => {
    if (type === 'stockMsd') {
        dispatch({
            type: actionTypes.START_MSD_STOCKS,
        })
    }
    if (type === 'insitutionalStock') {
        dispatch({
            type: actionTypes.START_INSITUTIONAL_STOCKS,
        })
    }
    if (type === 'insitutionalStockDate') {
        dispatch({
            type: actionTypes.START_INSITUTIONAL_DATE_STOCKS,
        })
    }

    if (type === 'stockMsdDate') {
        dispatch({
            type: actionTypes.START_MSD_DATE_STOCKS,
        })
    }
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.GET_STOCK,
        params,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    }

    axios(options)
        .then((result) => {
            if (type === 'stockMsd') {
                dispatch({
                    type: actionTypes.GET_STOCK_MSD_SUCCESS,
                    payload: result?.data?.view?.data,
                })
            }
            if (type === 'insitutionalStock') {
                dispatch({
                    type: actionTypes.GET_STOCK_INSITUTIONAL_SUCCESS,
                    payload: result?.data?.view?.data,
                })
            }
            if (type === 'insitutionalStockDate') {
                dispatch({
                    type: actionTypes.GET_STOCK_INSITUTIONAL_DATE_SUCCESS,
                    payload: result?.data?.view?.data,
                })
            }

            if (type === 'stockMsdDate') {
                dispatch({
                    type: actionTypes.GET_STOCK_MSD_DATE_SUCCESS,
                    payload: result?.data?.view?.data,
                })
            }
        })
        .catch((error) => {
            if (type === 'stockMsd') {
                dispatch({
                    type: actionTypes.GET_STOCK_MSD_FAILURE,
                })
            }
            if (type === 'insitutionalStock') {
                dispatch({
                    type: actionTypes.GET_STOCK_INSITUTIONAL_FAILURE,
                })
            }
            if (type === 'insitutionalStockDate') {
                dispatch({
                    type: actionTypes.GET_STOCK_INSITUTIONAL_DATE_FAILURE,
                })
            }

            if (type === 'stockMsdDate') {
                dispatch({
                    type: actionTypes.GET_STOCK_MSD_DATE_FAILURE,
                })
            }
        })
}

const fetchAgentTogether = async()=>{
    const accessToken = localStorageService.getItem('accessToken')
    const agentOptions = {
        url: apiroutes.GET_ALL_AGENTS,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    }

    return await axios(agentOptions);
}

const fetchUpcomingOrdersTogether =async()=>{
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.GET_UPCOMING_ORDERS,
        params:{
            page:1,
            limit:20,
            created_by:localStorageService.getItem("userInfo").id,

        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    }
    return await axios(options);

}

export const fecthBoth = (dispatch)=>{
    dispatch({
        type: actionTypes.START_AGENTS,
    })
    dispatch({
        type: actionTypes.START_UPCOMING_ORDERS,
    })


     Promise.all([fetchUpcomingOrdersTogether(),fetchAgentTogether()]).then((data)=>{


        dispatch({
            type: actionTypes.GET_AGENTS_SUCCESS,
            payload: data[1].data?.view?.data,
        })
        dispatch({
            type: actionTypes.GET_UPCOMING_ORDERS_SUCCESS,
            payload: data[0].data?.view,
        })
     })
     .catch((error)=>{
        dispatch({
            type: actionTypes.GET_AGENTS_FAILURE,
        })
        dispatch({
            type: actionTypes.GET_UPCOMING_ORDERS_FAILURE,
        })

     })

}





export const revertErrorStatus = (dispatch) => {
    dispatch({
        type: actionTypes.START_FORECAST,
    })
}

export const resetApproval=(dispatch)=>{
    dispatch({
        type: actionTypes.START_APPROVAL,
    })
}

export const approvalProcess = (dispatch, payload,id) => {

    dispatch({
        type: actionTypes.START_APPROVAL,
    })

    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.GET_SINGLE_ORDER+"/status/"+ id,
        data:payload,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'PUT',
    }

    axios(options)
        .then((result) => {
            dispatch({
                type: actionTypes.APPROVAL_SUCCESS,
            })

            getSingleOrderRequirementItem(dispatch,id);

        })
        .catch((e) => {
            dispatch({
                type: actionTypes.APPROVAL_FAILURE,
            })
        });

}


export const getEstimations = (dispatch, params,type) => {
    if(type==="annual"){
        dispatch({
            type: actionTypes.START_ESTIMATIONS_ORDERS,
        })
    }else if(type === "monthly"){
        dispatch({
            type: actionTypes.START_ESTIMATIONS_ORDERS_MONTHLY,
        }) 
    }
  
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.GET_ESTIMATION_ORDERS,
        params,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    }

    axios(options)
        .then((result) => {
           

            if(type==="annual"){
                dispatch({
                    type: actionTypes.ESTIMATIONS_SUCCESS,
                    payload: result?.data?.view,
                })
            }else if(type === "monthly"){
                dispatch({
                    type: actionTypes.ESTIMATIONS_SUCCESS_MONTHLY,
                    payload: result?.data?.view,
                })
            }
        })
        .catch((error) => {

            if(type==="annual"){
                dispatch({
                    type: actionTypes.ESTIMATIONS_FAILURE,
                    payload: null,
                })
            }else if(type === "monthly"){
                dispatch({
                    type: actionTypes.ESTIMATIONS_FAILURE_MONTHLY,
                    payload: null,
                })
            }
          
        })
}


export const getConsumptionData = (dispatch, params,type) => {
    console.log(type,"consumptionType")
    if(type==="annual"){
        dispatch({
            type: actionTypes.START_CONSUMPTIONS_ORDERS,
        })
    }else if(type === "monthly"){
        dispatch({
            type: actionTypes.START_CONSUMPTIONS_ORDERS_MONTHLY,
        }) 
    }
  
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.GET_CONSUMPTIONS,
        params,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    }

    axios(options)
        .then((result) => {
           

            if(type==="annual"){
                dispatch({
                    type: actionTypes.CONSUMPTIONS_SUCCESS,
                    payload: result?.data?.view,
                })
            }else if(type === "monthly"){
                dispatch({
                    type: actionTypes.CONSUMPTIONS_SUCCESS_MONTHLY,
                    payload: result?.data?.view,
                })
            }
        })
        .catch((error) => {
            
            if(type==="annual"){
                dispatch({
                    type: actionTypes.CONSUMPTIONS_FAILURE,
                    payload: null,
                })
            }else if(type === "monthly"){
                dispatch({
                    type: actionTypes.CONSUMPTIONS_FAILURE_MONTHLY,
                    payload: null,
                })
            }
          
        })
}



export const getBatch = (dispatch, params) => {
         dispatch({
            type: actionTypes.START_BATCH_DETAILS,
        }) 
   
  
    const accessToken = localStorageService.getItem('accessToken')
    const options = {
        url: apiroutes.GET_BATCH_DETAILS,
        params,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    }

    axios(options)
        .then((result) => {
           
                dispatch({
                    type: actionTypes.GET_BATCH_SUCCESS,
                    payload: result?.data?.view,
                })
            
        })
        .catch((error) => {

           
                dispatch({
                    type: actionTypes.GET_BATCH_FAILURE,
                    payload: null,
                })
            
          
        })
}

export const dueOnOrder = (dispatch, params) => {
    dispatch({
       type: actionTypes.START_DUE_ON_ORDER,
   }) 


const accessToken = localStorageService.getItem('accessToken')
const options = {
   url: apiroutes.GET_DUE_ON_ORDER,
   params,
   headers: {
       Authorization: `Bearer ${accessToken}`,
   },
   method: 'GET',
}

axios(options)
   .then((result) => {
      
           dispatch({
               type: actionTypes.GET_DUE_ON_ORDER_SUCCESS,
               payload: result?.data?.view,
           })
       
   })
   .catch((error) => {

      
           dispatch({
               type: actionTypes.GET_DUE_ON_ORDER_FAILURE,
               payload: null,
           })
       
     
   })
}

export const getAllOrderItems = (dispatch, params) => {
    dispatch({
       type: actionTypes.START_ORDER_ITEMS,
   }) 


const accessToken = localStorageService.getItem('accessToken')
const options = {
   url: apiroutes.GET_ALL_ITEMS,
   params,
   headers: {
       Authorization: `Bearer ${accessToken}`,
   },
   method: 'GET',
}

axios(options)
   .then((result) => {
      
           dispatch({
               type: actionTypes.GET_ORDER_ITEMS_SUCCESS,
               payload: result?.data?.view,
           })
       
   })
   .catch((error) => {

      
           dispatch({
               type: actionTypes.GET_ORDER_ITEMS_FAILURE,
               payload: null,
           })
       
     
   })
}

export const getHistory = (dispatch, params) => {
    dispatch({
       type: actionTypes.START_HISTORY,
   }) 


const accessToken = localStorageService.getItem('accessToken')
const options = {
   url: apiroutes.GET_HISTORY,
   params,
   headers: {
       Authorization: `Bearer ${accessToken}`,
   },
   method: 'GET',
}

axios(options)
   .then((result) => {
      
           dispatch({
               type: actionTypes.GET_HISTORY_SUCCESS,
               payload: result?.data?.view,
           })
       
   })
   .catch((error) => {

      
           dispatch({
               type: actionTypes.GET_HISTORY_FAILURE,
               payload: null,
           })
       
     
   })
}



export const updateInstallments = (dispatch, payload,id,params) => {
    dispatch({
       type: actionTypes.START_UPDATE,
   }) 


const accessToken = localStorageService.getItem('accessToken')
const options = {
   url: apiroutes.GET_INSTALLMENTS+"/"+id,
   data:payload,
   headers: {
       Authorization: `Bearer ${accessToken}`,
   },
   method: 'PATCH',
}

axios(options)
   .then((result) => {
      
           dispatch({
               type: actionTypes.UPDATE_INSTALLMENT_SUCCESS,
           })
           getInstallments(dispatch,params);
   })
   .catch((error) => {

      
           dispatch({
               type: actionTypes.UPDATE_INSTALLMENT_FAILURE,
           })
       
     
   })
}                                                    


export const deleteInstallment = (dispatch,id,params) => {
    dispatch({
       type: actionTypes.START_DELETE,
   }) 


const accessToken = localStorageService.getItem('accessToken')
const options = {
   url: apiroutes.GET_INSTALLMENTS+"/"+id,
   headers: {
       Authorization: `Bearer ${accessToken}`,
   },
   method: 'DELETE',
}

axios(options)
   .then((result) => {
      
           dispatch({
               type: actionTypes.DELETE_INSTALLMENT_SUCCESS,
           })
           getInstallments(dispatch,params);
   })
   .catch((error) => {

      
           dispatch({
               type: actionTypes.DELETE_INSTALLMENT_FAILURE,
           })
       
     
   })
}   