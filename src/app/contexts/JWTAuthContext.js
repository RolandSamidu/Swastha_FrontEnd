import React, { createContext, useEffect, useReducer } from 'react'
import jwtDecode from 'jwt-decode'
import axios, { axiosSetOwnerId } from 'axios.js'
//import axios from 'axios'
import { MatxLoading } from 'app/components'
import * as apiroutes from '../../apiroutes';
import * as appconst from '../../appconst';
import localStorageService from 'app/services/localStorageService';
import EmployeeServices from 'app/services/EmployeeServices';
import ClinicService from 'app/services/ClinicService';

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}

const isValidToken = async (accessToken) => {
    console.log("checking")
    console.log("accessToken", accessToken)
    if (!accessToken) {
        return false
    }

    const decodedToken = jwtDecode(accessToken)
    const currentTime = (Date.now() / 1000) | 0;
    console.log("decodeToken", decodedToken)
    console.log("current time", currentTime)

    let refresh_token = await localStorageService.getItem("refresh_token")
    const decodedRefreshToken = jwtDecode(refresh_token)


    if (/\\\\\\\\\\/.test(accessToken)) {
        console.log("invalid token")
    }

    //86400
    if (/\\\\\\\\\\/.test(accessToken) || (decodedToken.exp - currentTime < appconst.refresh_befor)) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        }

        axios.post(apiroutes.USER_LOGIN, `grant_type=refresh_token&client_id=${appconst.keycloak_client_id}&refresh_token=${refresh_token}&client_secret=${appconst.keycloak_client_secret}`, {
            headers: headers
        })
            .then((response) => {
                setSession(response.data.access_token);
                setRefreshToken(response.data.refresh_token);

            })
            .catch((error) => {

            })
    }

    if (decodedToken.exp > currentTime) {
        return true;
    } else if (decodedRefreshToken.exp < currentTime) {
        return false;
    }

}

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.removeItem('accessToken')
        localStorageService.setItem('accessToken', accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {

        localStorage.removeItem('accessToken')
        delete axios.defaults.headers.common.Authorization
    }
}


const setRefreshToken = (token) => {
    if (token) {
        localStorage.removeItem('refresh_token')
        localStorageService.setItem('refresh_token', token)
        //axios.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
        //localStorage.removeItem('refresh_token')
        //delete axios.defaults.headers.common.Authorization
    }
}



const setUser = (user) => {

    if (user) {
        localStorageService.setItem("userInfo", user)
    } else {
        localStorage.removeItem('userInfo')
    }
}




const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, user, error } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                error: null
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => { Promise.resolve() },
    register: () => Promise.resolve(),
})



export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const login = async (email, password, totp) => {

        window.localStorage.clear()


        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        const response = await axios.post(apiroutes.USER_LOGIN, `grant_type=password&client_id=${appconst.keycloak_client_id}&username=${email}&password=${password}&totp=${totp}&client_secret=${appconst.keycloak_client_secret}`, {
            headers: headers
        }
        )

        //let res = await EmployeeServices.userLoginCloud()

        /*  const response_cloud = await axios.post(apiroutes.USER_LOGIN_CLOUD, `grant_type=password&client_id=${appconst.cloud_keycloak_client_id}&username=${'admin'}&password=${'4bav@tmo9oT'}&totp=${totp}&client_secret=${appconst.cloud_keycloak_client_secret}`, {
             headers: headers
         }
         ) */

        // const { accessToken, user } = response.data
        console.log("login data", response.data)
        setSession(response.data.access_token)
        setRefreshToken(response.data.refresh_token)

        //setSessionCloud(response_cloud.data.access_token)
        //setRefreshTokenCloud(response_cloud.data.refresh_token)

        const decodedToken = jwtDecode(response.data.access_token)
        let user = {
            id: decodedToken.userId,
            type: decodedToken.type,
            avatar: "null",
            email: decodedToken.email,
            name: decodedToken.name,
            roles: decodedToken.realm_access.roles,
            //  hospital_id: '5f7822cd-efcf-4122-a1d5-5cb7c44b27b2'
        };
        let res = await getOwnerId(decodedToken.userId)

        if (res) {
            dispatch({
                type: 'LOGIN',
                payload: {
                    user,
                },
            })
            return user


        } else {
            dispatch({
                type: 'LOGOUT',
                payload: {
                    user,
                },
            })
            logout()
            return { error: true, message: "User Institution Dose Not Exist. Please Try again!. If This Error Occurs Continuosly, Please Contact System Admin" }
        }
        //setUser(user);

    }

    const getOwnerId = async (userId) => {
        try {

            await localStorageService.setItem("owner_id", null)

        } catch (error) {

        }
        let getAsignedEmployee = await EmployeeServices.getAsignEmployees({
            employee_id: userId,
            limit: 1,
            page: 0
        })
        console.log("getAsignedEmployee", getAsignedEmployee)

        let owner_id_temp = getAsignedEmployee.data.view.data[0]?.owner_id
        // let owner_id_temp='1234'

        let params2 = { issuance_type: ["Hospital", "MSD Main", "RMSD Main"], limit: 20, page: 0 }
        let getAsignedEmployeeHospital = await ClinicService.fetchAllClinicsNew(params2, owner_id_temp);
        /*   let getAsignedEmployeeHospital = await EmployeeServices.getAsignEmployees({
              employee_id: userId,
              issuance_type:'hospital',
              limit: 1,
              page: 0
          }) */

        let owner_id = null
        let main_hospital_id = null
        let pharmacy_drugs_stores = null
        if (getAsignedEmployee.status == 200) {
            console.log("asignEmp", getAsignedEmployee?.data?.view?.data)
            owner_id = getAsignedEmployee?.data?.view?.data[0]?.Pharmacy_drugs_store?.owner_id;
            main_hospital_id = getAsignedEmployeeHospital.data.view.data[0]?.id;
            let pharmacy_drugs_stores = getAsignedEmployee.data.view.data;

            // axios.defaults.headers.common['ownerid']=owner_id
            //axios.defaults.headers.common['ownerid'] = 'owner_id';
            /*  axios.defaults.headers.common = {
                "ownerid": owner_id
               }; */
            console.log("login_user_pharmacy_drugs_stores", pharmacy_drugs_stores)

            await localStorageService.setItem("owner_id", owner_id)
            await localStorageService.setItem("main_hospital_id", main_hospital_id)
            await localStorageService.setItem("login_user_pharmacy_drugs_stores", pharmacy_drugs_stores)

            let stored_owner_id = await localStorageService.getItem('owner_id')

            if (stored_owner_id == null || stored_owner_id == "null") {
                return false
            } else {
                return true
            }


        }
    }

    const register = async (email, username, password) => {
        const response = await axios.post('/api/auth/register', {
            email,
            username,
            password,
        })

        const { accessToken, user } = response.data

        setSession(accessToken)

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        })
    }

    const logout = () => {
        setSession(null)
        //localStorageService.setItem('Login_user_Hospital',null)
        //localStorageService.removeItem('Selected_Warehouse')
        //localStorageService.removeItem('Login_user_Clinic_prescription')
        //localStorageService.removeItem('Login_user_Hospital')

        window.localStorage.clear()

        dispatch({ type: 'LOGOUT' })
    }

    useEffect(() => {
        ; (async () => {
            try {
                const accessToken = localStorageService.getItem('accessToken')
                if (accessToken && await isValidToken(accessToken)) {
                    setSession(accessToken)
                    // const response = await axios.get('/api/auth/profile')
                    //const { user } = response.data
                    let user = await localStorageService.getItem("userInfo");
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
