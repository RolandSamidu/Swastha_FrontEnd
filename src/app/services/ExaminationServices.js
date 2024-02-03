import axios from 'myaxios';
import * as apiroutes from '../../apiroutes'
import localStorageService from './localStorageService'
import EmployeeServices from './EmployeeServices';

class ExaminationServices {


    getData = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_PATIENTS_INFO,
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

    getDataFromCloud = async (params) => {
        let accessToken = await localStorageService.getItem("accessToken_cloud");
      
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.GET_PATIENTS_INFO_FROM_CLOUD,
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

    saveData = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.PATIENTS_EXAMINATION, data,
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



}
export default new ExaminationServices()
