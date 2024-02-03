import axios from 'myaxios';
import * as apiroutes from '../../apiroutes';
import localStorageService from "./localStorageService";

class FilesService {



    downloadFile = async (params) => {
        /*   const accessToken = await localStorageService.getItem("accessToken");
          const a = new Promise((resolve, reject) => {
              axios.get(apiroutes.FILE_VIEW,
                  {
                      params: params,
                      headers: { Authorization: `Bearer ${accessToken}` }
                  }).then(res => {
                      return resolve(res);
                  })
                  .catch((error) => {
                      console.log("error", error);
                  })
          });
          return await a; */
    }

}
export default new FilesService()