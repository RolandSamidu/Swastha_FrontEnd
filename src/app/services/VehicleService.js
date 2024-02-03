import localStorageService from "./localStorageService";
import axios from 'myaxios';
import * as apiroutes from "../../apiroutes";

class VehicleService {
    createNewVehicleType = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            console.log(data)
            axios
                .post(apiroutes.VEHICLE_TYPE_API, data, {
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

    //Get All vehicles types
    getAllVehicleTypes = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.VEHICLE_API,
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

    //Get All employees
    getAllEmployees = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.EMPLOYEE,
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

    getVehicleUsers = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.EMPLOYEE,
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
        return await promise;
    }

    changeVehicleTypeStatus = async (id,data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.put(apiroutes.VEHICLE_API +"/status/" + id, data, {
                // params: params,
                headers: { Authorization: `Bearer ${accessToken}` }
            })
                .then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;
    }

    updateVehicleType = async (data) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.patch(apiroutes.VEHICLE_API + data.id, data, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
                .then(res => {
                    return resolve(res);
                })
                .catch((error) => {
                    console.log("error", error);
                    return resolve(error);
                })
        });
        return await promise;
    }

    //Get All vehicles
    fetchAllVehicles = async (params, owner_id) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.VEHICLES_API + owner_id,
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

    //Get All Employees
    getEmployees = async (params) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const promise = new Promise((resolve, reject) => {
            axios.get(apiroutes.EMPLOYEE,
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
        return await promise;
    }

    createVehicleUsers = async (data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            console.log(data)
            axios
                .post(apiroutes.CREATE_VEHICLE_USER, data, {
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


    createNewVehicle = async (data, owner_id) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            console.log(data)
            axios
                .post(apiroutes.VEHICLES_API + owner_id, data, {
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

    //Get All vehicle users
    getAllVehicleUsers = async (params, owner_id) => {
        const accessToken = await localStorageService.getItem("accessToken");
        const a = new Promise((resolve, reject) => {
            axios.get(apiroutes.VEHICLES_API + owner_id,
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

    changeVehicleStatus = async (vehicleId, ownerId, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            console.log(data)
            axios
                .put(apiroutes.VEHICLES_API + ownerId + `/status/${vehicleId}`, data, {
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

    updateDriver = async (vehicleId, ownerId, data) => {
        const accessToken = await localStorageService.getItem('accessToken')
        const promise = new Promise((resolve, reject) => {
            console.log(data)
            axios
                .patch(apiroutes.VEHICLES_API + ownerId + `/${vehicleId}`, data, {
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




//************* */



//Get All vehicle types
getAllVehicleTypes = async (params) => {
    const accessToken = await localStorageService.getItem("accessToken");
    const a = new Promise((resolve, reject) => {
        axios.get(apiroutes.VEHICLE_TYPE_API,
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

createNewVehicleUser = async (data) => {
    const accessToken = await localStorageService.getItem('accessToken')
    const promise = new Promise((resolve, reject) => {
        axios
            .post(apiroutes.EMPLOYEE, data, {
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

getVehicleUsers = async (params) => {
    const accessToken = await localStorageService.getItem("accessToken");
    const promise = new Promise((resolve, reject) => {
        axios.get(apiroutes.EMPLOYEE,
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
    return await promise;
}


changeVehicleUserStatus = async (id,data) => {
    const accessToken = await localStorageService.getItem("accessToken");
    const promise = new Promise((resolve, reject) => {
        axios.put(apiroutes.EMPLOYEE +"/status/" + id, data, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(res => {
           return resolve(res);
        })
        .catch((error) => {
            console.log("error", error);
            return resolve(error);
        })
    });
    return await promise;
}

updateVehicleUser = async (data) => {
    const accessToken = await localStorageService.getItem("accessToken");
    const promise = new Promise((resolve, reject) => {
        axios.patch(apiroutes.EMPLOYEE + data.id, data, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(res => {
           return resolve(res);
        })
        .catch((error) => {
            console.log("error", error);
            return resolve(error);
        })
    });
    return await promise;
}

  //Get All vehicles
  getAllVehicles = async () => {
    const accessToken = await localStorageService.getItem("accessToken");
    const promise = new Promise((resolve, reject) => {
        axios.get(apiroutes.VEHICLE_API,
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
getEmployeeByID = async (id) => {
    const accessToken = await localStorageService.getItem("accessToken");
    const promise = new Promise((resolve, reject) => {
        axios.get(apiroutes.EMPLOYEE+id,
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

msdVehicleInOut = async (data) => {
    const accessToken = await localStorageService.getItem('accessToken')
    const promise = new Promise((resolve, reject) => {
        console.log(data)
        axios
            .post(apiroutes.MSD_VEHICLE_INOUT, data, {
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

export default new VehicleService()
