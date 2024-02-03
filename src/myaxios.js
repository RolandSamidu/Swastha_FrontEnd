import axios from 'axios'
import localStorageService from 'app/services/localStorageService';
/* 
const instance = axios.create();

instance.interceptors.request.use(
  function(config) {
    const owner_id = localStorageService.getItem("owner_id");
    const accessToken =  localStorageService.getItem("accessToken")
  
      config.headers["Authorization"] = 'Bearer ' + accessToken;
      config.headers["Ownerid"] = owner_id?owner_id:'null';
    
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default instance */


const instance = axios.create();

instance.interceptors.request.use(
  function (config) {
    const owner_id = localStorageService.getItem("owner_id");
    const accessToken = localStorageService.getItem("accessToken")

    instance.defaults.headers.common = {
      Authorization: `Bearer ${accessToken}`,
      "Ownerid": owner_id ? owner_id : 'null'
    };

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance

const axiosInstance = axios.create()



/* async function setHeader(){
    let owner_id=await localStorageService.getItem("owner_id")
    console.log("owner Id",owner_id)
    const accessToken = await localStorageService.getItem("accessToken")
    axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${accessToken}`,
        "Ownerid": owner_id?owner_id:'null'
    };
}
 

setHeader()


export default axiosInstance  */
