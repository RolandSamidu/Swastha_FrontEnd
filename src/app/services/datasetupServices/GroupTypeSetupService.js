import axios from 'myaxios';
import * as apiroutes from '../../../apiroutes'
import localStorageService from '../localStorageService'

class GroupTypeSetupService {
    fetchAllGroupType = async (filterData) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .get(apiroutes.GROUP_TYPE_API, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: filterData,
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

    createNewGroupType = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .post(apiroutes.GROUP_TYPE_API, data, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    return resolve(res)
                })
                .catch((error) => {
                    return resolve(error)
                })
        })
        return await promise
    }

    updateGroupType = async (id, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            axios
                .patch(apiroutes.GROUP_TYPE_API.concat(id), data, {
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
export default new GroupTypeSetupService()
