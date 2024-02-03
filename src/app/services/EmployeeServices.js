import axios from 'myaxios';
import * as apiroutes from '../../apiroutes';
import localStorageService from "./localStorageService";
import * as appconst from '../../appconst';
import axiosCloud from 'axios.js'
import jwtDecode from 'jwt-decode'

class EmployeeServices {

    //Get All district
    getEmployees = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.EMPLOYEES, {
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

    //Get Employees By ID
    getEmployeeByID = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.EMPLOYEES + `/${id}`, {
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

    getAsignEmployees = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.ASIGNED_EMPLOYEES, {
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

    createEmployeeCoverUp = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.COVERUP_EMPLOYEES, data, {
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

    deleteAssindedEmployeeByID = async (id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .delete(apiroutes.ASIGNED_EMPLOYEES + `${id}`, {
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

    createNewAssignEmployee = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.ASIGNED_EMPLOYEES, data, {
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
    getALLAsignEmployees = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.ASIGNED_EMPLOYEES,
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
    addAdditionalRoles = async (data, id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.EMPLOYEES + '/' + id, data, {
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


    userResetLink = async (data) => {
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.EMPLOYEES + "/password_reset", data).then(res => {
                return resolve(res);
            })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await a;

    }




    userLoginCloud = async () => {

        let accessToken = await localStorageService.getItem('accessToken_cloud')
        if (!accessToken) {
            let res = await this.getCloudToken();
            console.log("cloud login res 2", res)
            if (res.status == 200) {
                return true
            } else {
                return false
            }

        } else {
            const decodedToken = jwtDecode(accessToken)
            const currentTime = (Date.now() / 1000) | 0;
            if (decodedToken.exp > currentTime) {
                return true;
            } else {
                let res = await this.getCloudToken();
                console.log("cloud login res 3", res)
                if (res.status == 200) {
                    return true
                } else {
                    return false
                }
            }
        }


    }


    getCloudToken = async () => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        }

        let totp = '';
        let email = 'admin';
        let password = '4bav@tmo9oT';


        const a = new Promise((resolve, reject) => {
            axiosCloud.post(apiroutes.USER_LOGIN_CLOUD, `grant_type=password&client_id=${appconst.cloud_keycloak_client_id}&username=${email}&password=${password}&totp=${totp}&client_secret=${appconst.cloud_keycloak_client_secret}`,
                {
                    headers: headers
                }).then(res => {
                    if (res.status == '200') {
                        localStorageService.setItem('accessToken_cloud', res.data.access_token);
                        localStorageService.setItem('refresh_token_cloud', res.data.refresh_token)
                        return resolve(res);
                    }
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await a;

    }

}
export default new EmployeeServices()