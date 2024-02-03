import axios from 'myaxios';
import * as apiroutes from '../../apiroutes'
import localStorageService from './localStorageService'
import EmployeeServices from './EmployeeServices';

class PrescriptionService {
    fetchPrescriptions = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_PRESCRIPTIONS, {
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

    fetchPrescriptionsFromCloud = async (params) => {
        let accessToken = await localStorageService.getItem('accessToken_cloud')
       
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_PRESCRIPTIONS_FROM_CLOUD, {
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

    fetchPrescription = async (params,id) => {
        console.log(apiroutes.GET_PRESCRIPTIONS + `/${id}`);
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_PRESCRIPTIONS + `/${id}`, {
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

    fetchPrescriptionById = async (params,id) => {
        console.log(apiroutes.GET_PRESCRIPTIONS + `/${id}`);
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_PRESCRIPTIONS + `/${id}`, {
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

    createPrescription = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.ADD_PRESCRIPTION, data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error)

                })
        });
        return await a;
    }

    fetchPatientClinics = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.ASSIGNED_CLINIC_API, {
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

    fetchPatientClinicsFromCloud= async (params) => {
        let accessToken = await localStorageService.getItem('accessToken_cloud')
        
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.ASSIGNED_CLINIC_API_CLOUD, {
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

    fetchFrequencies = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_FREQUENCIES, {
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

    fetchRoutes = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_ROUTES, {
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

    fetchFavourites = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.FAVOURITES, {
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

    fetchFavourite = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.FAVOURITE_DRUGS, {
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
    fetchNPRrequests = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.NP_DRUGS, {
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

    fetchNPRequestById = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.NP_DRUGS+`/${id}`, {
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

    createFavourite = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.FAVOURITES, data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error)

                })
        });
        return await a;
    }

    createNPRequest = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.NP_DRUGS, data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error)

                })
        });
        return await a;
    }

    NPApproval = async (id,data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.put(apiroutes.NP_DRUGS_APPROVAL + `/${id}`, data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error)

                })
        });
        return await a;
    }

    BulkNPApproval = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.NP_DRUGS_BULK_APPROVAL, data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error)

                })
        });
        return await a;
    }

    getClinicBHTNo = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.FETCH_PATIENT_BYID,
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
        return await a;

    }

    getAllAgents = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_ALL_AGENTS,
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
        return await a;

    }

    BulkPlaceOrder = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.NP_PLACE_ORDER, data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }).then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error)

                })
        });
        return await a;
    }

    NP_Orders = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.NP_ORDERS, {
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

    // get details by id
    NP_Orders_By_Id = async (params, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.NP_ORDERS+"/"+id, {
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
    
    NP_Place_Orders = async (id,data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.post(apiroutes.NP_ORDERS + `/${id}`,data,
            {
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

    OrdersCreate = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.post(apiroutes.NP_ORDERS,data, {
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

    fetchTempStock = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_PRESCRIPTIONS, {
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
export default new PrescriptionService()
