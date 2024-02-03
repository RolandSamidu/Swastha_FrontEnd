import axios from 'myaxios';
import * as apiroutes from '../../apiroutes';
import localStorageService from "./localStorageService";
import * as appConst from '../../appconst'

class ReportService {

    getToken = async () => {
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.REPORT_LOGIN, 'grant_type=password&username=admin&password=admin', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    auth: {
                        username: 'client',
                        password: 'secret'
                    }

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

    getAllReports = async () => {
        const accessToken = await localStorageService.getItem('reportAccessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GET_REPORTS, {
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
    generateReport = async (id, data) => {
        const accessToken = await localStorageService.getItem('reportAccessToken')

        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.GENERATE_REPORTS + id, data, {
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
    downloadReport = async (id, data) => {
        const accessToken = await localStorageService.getItem('reportAccessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.GENERATE_REPORTS + id, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    responseType: 'arraybuffer',
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


    async checkReportLogins() {
        const accessToken = localStorageService.getItem('reportAccessToken')
        if (await this.isValidToken(accessToken)) {
            
        } else {
            console.log("call to check report login 2")
            await this.getTokenBy()
        }
    }



    async isValidToken(accessToken) {
        if (!accessToken) {
            return false
        }
        const currentTime = (Date.now() / 1000) | 0

        if (accessToken.expires_in - currentTime < appConst.refresh_befor) {
            return false
        }
        if (accessToken.expires_in > currentTime) {
            return true
        }
    }

    async getTokenBy() {
        let response = await this.getToken()
        if (response) {
            console.log("call to check report login 2",response)
            this.setSession(response.data.access_token)
           return true
        }
    }

    setSession = (accessToken) => {
        if (accessToken) {
            localStorage.removeItem('reportAccessToken')
            localStorageService.setItem('reportAccessToken', accessToken)
        } else {
            localStorage.removeItem('reportAccessToken')
        }
    }

}
export default new ReportService()