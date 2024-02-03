import axios from 'myaxios';
import * as apiroutes from '../../apiroutes';
import localStorageService from './localStorageService'

class FinanceServices{
    getFinanceDocuments = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.FINANCE_DOCUMENTS,
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
        return await promise;
    }
    
    getFinanceVotes = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.FINANCE_VOTES,
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
        return await promise;
    }

    getFinanceVouchers = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.FINANCE_VOUCHERS,
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
        return await promise;
    }

    getFinanceCheques = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.FINANCE_CHEQUES,
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
        return await promise;
    }

    getVouchersTotalPrint = async (params) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.FINANCE_VOUCHERS, {
                    params:params,
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

    getVoucherPrint = async (params, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.FINANCE_VOUCHERS+`/${id}`, {
                    params:params,
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

    getConsignmentByRefID = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.CONSIGNMENT+`/${params}`,
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
 

    createFinanceVotes = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.post(apiroutes.FINANCE_VOTES, data, 
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
        return await promise;
    }

    createFinanceVouchers = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.post(apiroutes.FINANCE_VOUCHERS, data, 
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
        return await promise;
    }


    FinanceVouchersUpdate = async (id, data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.patch(apiroutes.FINANCE_VOUCHERS+`/${id}`, data,
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
        return await promise;
    }

    createFinanceCheques = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.post(apiroutes.FINANCE_CHEQUES, data, 
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
        return await promise;
    }

    // update cheque details
    changeCheque = async (id, data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.patch(apiroutes.FINANCE_CHEQUES+`/${id}`, data,
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
        return await promise;
    }


    changeFinanceVotes = async (id, data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.patch(apiroutes.FINANCE_VOTES+`/${id}`, data,
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
        return await promise;
    }
}

export default new FinanceServices()