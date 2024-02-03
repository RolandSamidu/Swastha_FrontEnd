import axios from 'axios'

const axiosInstance = axios.create()

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || 'Something went wrong!'
        )
)

export function axiosSetOwnerId(owner_id){
    axios.defaults.headers.common = {
        "Ownerid": owner_id
       };
       axios.defaults.headers.post['header1'] = 'value'
       //axios.defaults.headers.post['Ownerid']=owner_id;

       axios.defaults.headers.post = {
        "Ownerid": owner_id
       };
       axiosInstance.defaults.headers.common = {
        "OwneridNew": owner_id
       };

       
}

export default axiosInstance
