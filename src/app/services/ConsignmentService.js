import axios from 'myaxios';
import * as apiroutes from '../../apiroutes'
import localStorageService from './localStorageService'
import { CONSIGNMENT_REDO_REASONS, CONSIGNMENT_SAMPLES_API } from "../../apiroutes";

class ConsignmentService {
    //get the consignment order list
    getConsignmentOrderList = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.CONSIGNMENT_ORDER_LIST, {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getConsignmentById = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.CONSIGNMENT + '/' + `${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getSPCConsignmentById = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.SPC_CONSIGNMENT_ORDER + '/' + `${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    editConsignmentById = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CONSIGNMENT + `/${id}`, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }


    editStatusConsignmentById = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .put(apiroutes.CONSIGNMENT + "/status/" + `${id}`, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }


    getConsignmentItems = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.CONSIGNMENT_ITEMS, {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getConsignmentItemsById = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.CONSIGNMENT_ITEMS + '/' + `${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }
    getConsignmentItemsByIdWithParams = async (id,params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.CONSIGNMENT_ITEMS + '/' + `${id}`, {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getTempPacksize = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.TEMP_PACK_SIZE_DET, {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    createConsignment = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CONSIGNMENT, data, {

                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getAditionalDetails = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.CONSIGNMENT_ADITIONAL_DETAILS + `${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getBalanceDueOnOrder = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_DUE_ON_ORDER ,{
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    editAditionalDetails = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CONSIGNMENT_ADITIONAL_DETAILS + `${id}`, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getUoms = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.UOMS, {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    //Get All consignments
    getAllConsignments = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.CONSIGNMENT_API,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await a;
    }
    //Get Consignment by id
    getConsignmentById = async (id) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.CONSIGNMENTS + id,
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;
    }


    //Get All consignment samples
    fetchConsignmentSamples = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.CONSIGNMENT_SAMPLES_API,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        })
        return await a;
    }

    getConsignmentHistory = async (consignmentId, params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_CONSIGNMENT + consignmentId + '/histories',
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;
    }

    //Get All redo reasons
    fetchRedoReason = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.CONSIGNMENT_REDO_REASONS,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        })
        return await a;
    }



    //Get SCO from Employees
    getScoFromEmployees = async (params) => {
        console.log("params", params);
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.EMPLOYEE,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;
    }

    createNewRedoReason = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.post(apiroutes.CONSIGNMENT_REDO_REASONS, data, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise;
    }

    saveNewSCO = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CONSIGNMENTS_SAMPLE, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    confirmSampleCollected = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .put(apiroutes.CONSIGNMENT_SAMPLES_API + "status/" + `${id}`, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }
    //Get Consignment Sample by id
    getConsignmentSampleById = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.CONSIGNMENTS_SAMPLE,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;

    }

    //Get Consignment Sample by id in url
    getConsignmentSampleByIdByURL = async (id) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.CONSIGNMENTS_SAMPLE + id,
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;

    }



    // this is not be here, should chage service
    //Get criterias
    getCheckingCriterias = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.CRITERIA_CHECKING,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;

    }

    consignmentSampleValidating = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.post(apiroutes.SAMPLE_VALIDATING, data,
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;

    }

    getValidatedSamples = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.SAMPLE_VALIDATING,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;

    }


    
    getConsignmentContainers = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.CONSIGNMENT_CONTAINERS,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;

    }


    patchConsignmentItem = async (id,data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CONSIGNMENT_ITEMS+`/${id}`, data, {

                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    patchConsignmentContainer = async (id,data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CONSIGNMENT_CONTAINERS+`/${id}`, data, {

                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }


    //ORDER DELIVERY REQUESTS
    getOrderDeliveryVehicleReuqests = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.MSD_VEHICLE_REQUESTS_API,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;

    }
    patchOrderDeliveryVehicleReuqests = async (id,data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.MSD_VEHICLE_REQUESTS_API+`/${id}`, data, {

                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    
    getOrderDeliveryVehicleTypes = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => {
            axios
                .get(
                    apiroutes.MSD_VEHICLE_TYPES,
                    {
                        params: params,
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                )
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await a
    }


    createGRN = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            console.log(data)
            axios
                .post(apiroutes.CREATE_GRN, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getGRN = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.CREATE_GRN,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;
    }

    // get grn by id 
    getGRNByID = async (params, id) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.GRN_ITEMS+'/'+id,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;

    }
 
    editGRNStatus = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .put(apiroutes.CREATE_GRN + "/status/"  + `${id}`, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getGRNItems = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.GRN_ITEMS,
                {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;

    }


    editGRNItem = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.GRN_ITEMS+"/" + `${id}`, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }
    
    addGRNToBin = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            console.log(data)
            axios
                .post(apiroutes.GRN_ITEMS_ADDTO_BIN, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }


    getDabitNoteTypes = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_ALL_DEBIT_NOTE_TYPES, {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getDabitNoteSubTypes = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_ALL_DEBIT_NOTE_SUB_TYPES, {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }


    createApproved = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.GET_ALL_DEBIT_NOTE_APPROVAL+"/" + `${id}`, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getDabitNoteApproval = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_ALL_DEBIT_NOTE_APPROVAL, {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }


    getDabitNoteApprovalCharges = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_ALL_DEBIT_NOTE_CHARGES, {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }

    getDabitNoteApprovalIndividualRequest = async (params, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_ALL_DEBIT_NOTE_APPROVAL+'/'+id, {
                    params: params,
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    console.log('error', error)
                    return resolve(error)
                })
        })
        return await promise
    }
}
export default new ConsignmentService()
