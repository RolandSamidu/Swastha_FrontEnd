import axios from 'myaxios';
import * as apiroutes from '../../apiroutes'
import localStorageService from './localStorageService'

class EstimationService {
    createEstimationSetup = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CREATE_ESTIMATION_SETUP, data, {
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
    EditEstimationSetup = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CREATE_ESTIMATION_SETUP + '/' + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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


    getEstimationsSetups = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.CREATE_ESTIMATION_SETUP, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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

    getEstimationsApprovals = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.ESTIMATION_APPROVALS, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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

    EditEstimationsApprovals = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.ESTIMATION_APPROVALS + '/' + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    createEstimation = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CREATE_ESTIMATION, data, {
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

    EditEstimation = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CREATE_ESTIMATION + '/' + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    getAllEstimations = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.CREATE_ESTIMATION, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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
    getEstimationById = async (id,params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.CREATE_ESTIMATION+`/${id}`, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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
    getAllEstimationITEMS = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_ALL_ESTIMATION_ITEMS, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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
    createHospitalItem = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CREATE_HOSPITAL_ITEMS, data, {
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



    getEstimations = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.CREATE_HOSPITAL_ITEMS, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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

    getTempEstimations = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.TEMP_ESTIMATIONS, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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

    getTempConsumption = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.TEMP_CONSUMPTIONS, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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

    getEstimationHistory = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.HOSPITAL_ESTIMATION_ITEM_HISTORIES, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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

    getEstimationItemHistory = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.SUB_ESTIMATION_ITEM_HISTORIES, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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

    getEstimationsById = async (id) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.CREATE_HOSPITAL_ITEMS + '/' + id, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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


    getEstimationsVerificationEmployees = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.HOSPITAL_ESTIMATION_VERIFICATION_EMPLOYEES, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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
    EditHospitalEstimation = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CREATE_HOSPITAL_ITEMS + '/' + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    deleteEstimation = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios.delete(apiroutes.CREATE_HOSPITAL_ITEMS + "/" + id, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
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


    addEstimationToItems = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.GET_ALL_ESTIMATION_ITEMS + '/' + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    getAllSubHospitalEstimation = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.CREATE_SUB_HOSPITAL_ESTIMATIONS, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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

    changeSubHospitalEstimationStatus = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .put(apiroutes.CREATE_SUB_HOSPITAL_ESTIMATIONS + "/status/" + `${id}`, data, {
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

    createSubHospitalEstimation = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CREATE_SUB_HOSPITAL_ESTIMATIONS, data, {
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
    EditSubHospitalEstimation = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CREATE_SUB_HOSPITAL_ESTIMATIONS + '/' + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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

    editStatusHospitalEstimationById = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .put(apiroutes.CREATE_HOSPITAL_ITEMS + "/status/" + `${id}`, data, {
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

    GenarateHospitalEstimation = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.GENERATE_HOSPITAL_ESTIMATIONS, data, {
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


    createSubHospitalEstimationItems = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.CREATE_SUB_HOSPITAL_ESTIMATIONS_ITEMS, data, {
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

    EditSubHospitalEstimationItems = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.CREATE_SUB_HOSPITAL_ESTIMATIONS_ITEMS + '/' + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` }
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
    getSubHospitalEstimationById = async (id) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.CREATE_SUB_HOSPITAL_ESTIMATIONS+"/"+id, {
               headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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

    getSubHospitalEstimationItems = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.CREATE_SUB_HOSPITAL_ESTIMATIONS_ITEMS, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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

    addItemEstimations = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.GET_ALL_ESTIMATION_ITEMS + '/' + id, data, {
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
    getHospitalEstimationsById = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_ALL_ESTIMATION_ITEMS + '/' + id, {
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
    addHospitalItemEstimations = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.GET_ALL_ESTIMATION_ITEMS, data, {
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



    hospitalEstimationVerify = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.HOSPITAL_ESTIMATION_VERIFICATION, data, {
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

    getAllWarehouses2 = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_WAREHOUSES_, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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

    getEstimationRelations = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_ESTIMATION_RELATION, {
                params: params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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

}
export default new EstimationService()
