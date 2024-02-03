import axios from 'myaxios';
import * as apiroutes from '../../apiroutes'
import localStorageService from './localStorageService'

class EHRServices {
    uploadData= async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.post(apiroutes.EHR_DATA_LOCAL, data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                        
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


    getData = async (params) => {
        let accessToken = await localStorageService.getItem('accessToken_cloud')
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.EHR_DATA,
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
}

export default new EHRServices()