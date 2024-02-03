import axios from 'myaxios';
import * as apiroutes from '../../apiroutes'
import localStorageService from './localStorageService'

class LocalPurchaseServices {
    createLPRequest = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.LOCAL_PURCHASE, data,
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

    poApproval = async (id,data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.put(apiroutes.LOCAL_PURCHASE + `/status/${id}`, data,
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

    createLPQuotation = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.QUOTATION_REQURST, data,
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

    getLPQuotationInfo = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.QUOTATION_REQURST,
                {
                    params: params,
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

    getLPRequestApprovals = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.LOCAL_PURCHASE_APPROVALS,
                {
                    params: params,
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

    createLPUnitPrice = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.LP_REQURST_PRICING, data,
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

    getLPSupplierDet = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.LP_REQURST_PRICING,
                {
                    params: params,
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

    getLPRequestApprovalByID = async (id, params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.LOCAL_PURCHASE_APPROVALS+`/${id}`,
                {
                    params: params,
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

    patchLPRequestApprovals = async (id, data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.patch(apiroutes.LOCAL_PURCHASE_APPROVALS+`/${id}`, data,
                {
                    // params: params,
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

    getLPRequest = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.LOCAL_PURCHASE,
                {
                    params: params,
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

    // set item_wise
    getLPRequestItem = async (params, id) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.LOCAL_PURCHASE+'/'+id,
                {
                    params: params,
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

    getLPRequestByID = async (id) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.LOCAL_PURCHASE+`/${id}`,
                {
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
        return await promise;
    }

    getLPPOApprovals = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.NP_ORDER_APPROVALS,
                {
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
        return await promise;
    }

    changeLPPOApprovals = async (data, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const a = new Promise((resolve, reject) => { 
            axios
                .patch(apiroutes.NP_ORDER_APPROVALS + `/${id}`, data, {
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
        return await a
    }

    changeLPRequest = async (id, data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.patch(apiroutes.LOCAL_PURCHASE+`/${id}`, data,
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


    // getIssues = async (params) => {
    //     const accessToken = await localStorageService.getItem("accessToken");
    //     const a = new Promise((resolve, reject) => {
    //         axios.get(apiroutes.CREATE_ISSUE,
    //             {
    //                 params: params,
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`,
    //                 }
    //             }).then(res => {
    //                 return resolve(res);
    //             })
    //             .catch((error) => {
    //                 console.log("error", error);
    //                 return resolve(error)

    //             })
    //     });
    //     return await a;
    // }

    // createIssue = async (data) => {
    //     const accessToken = await localStorageService.getItem("accessToken");
    //     const a = new Promise((resolve, reject) => {
    //         axios.post(apiroutes.CREATE_ISSUE, data,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`,
    //                     "Content-Type": "multipart/form-data"
    //                 }
    //             }).then(res => {
    //                 return resolve(res);
    //             })
    //             .catch((error) => {
    //                 console.log("error", error);
    //                 return resolve(error)

    //             })
    //     });
    //     return await a;
    // }

    // editIssue = async (data,id) => {
    //     const accessToken = await localStorageService.getItem('accessToken')
    //     const promise = new Promise((resolve, reject) => {
    //         axios.patch(apiroutes.CREATE_ISSUE+`/${id}`, data, {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`
    //                 },
    //             })
    //             .then((res) => {
    //                 return resolve(res)
    //             })
    //             .catch((error) => {
    //                 console.log('error', error)
    //                 return resolve(error)
    //             })
    //     })
    //     return await promise
    // }

    // commentIssue = async (data) => {
    //     const accessToken = await localStorageService.getItem("accessToken");
    //     const a = new Promise((resolve, reject) => {
    //         axios.post(apiroutes.CREATE_ISSUE_COMMENT, data,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`
    //                 }
    //             }).then(res => {
    //                 return resolve(res);
    //             })
    //             .catch((error) => {
    //                 console.log("error", error);
    //                 return resolve(error)

    //             })
    //     });
    //     return await a;
    // }

    // getHelpVideoLink = async (params) => {
    //     const accessToken = await localStorageService.getItem("accessToken");
    //     const a = new Promise((resolve, reject) => {
    //         axios.get(apiroutes.GET_HELP_VIDEO_LINK,
    //             {
    //                 params: params,
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`,
    //                 }
    //             }).then(res => {
    //                 return resolve(res);
    //             })
    //             .catch((error) => {
    //                 console.log("error", error);
    //                 return resolve(error)

    //             })
    //     });
    //     return await a;
    // }

}
export default new LocalPurchaseServices()
