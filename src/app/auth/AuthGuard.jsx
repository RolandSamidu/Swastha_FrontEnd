/*
User authenticaion handling
Edited by Roshan
Loons lab
*/
import React, {
    useContext,
    useEffect,
    useState,
} from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import AppContext from 'app/contexts/AppContext'
import useAuth from 'app/hooks/useAuth'
import { getNavigationByUser } from 'app/redux/actions/NavigationAction'
import { useDispatch, useSelector } from 'react-redux'
import jwtDecode from 'jwt-decode'

const getUserRoleAuthStatus = (pathname, user, routes) => {
    const matched = routes.find((r) => r.path === pathname);
    let authenticated = false;


    /*   const authenticated =
          matched && matched.auth && matched.auth.length
              ? matched.auth.includes(user.roles)
              : true;
      console.log(matched, user); */

    //Edited by Roshan--------------------------
    if (matched !== undefined) {
        if (matched.auth !== undefined) {
            if (user !== null) {
                if (user.roles !== undefined) {
                    const userpermission = user.roles.map(roles => roles).flat();

                    matched.auth.forEach(permission => {
                        if (userpermission.find(p => p === permission)) {
                            authenticated = true;
                        }
                    })

                }
            } else {
                authenticated = false;
            }

        } else {
            authenticated = false;
        }
    }
    if (!(matched && matched.auth && matched.auth.length)) {
        authenticated = true;
    }
    return authenticated;
};

//-----------------------------------------------
//added by roshan
const isValidToken = (accessToken) => {
    console.log("checking")
    if (!accessToken) {
        return false
    }

    const decodedToken = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    console.log(decodedToken)
    return decodedToken.exp > currentTime
}
//----------------------------------------------

const AuthGuard = ({ children }) => {
    const {
        isAuthenticated,
        user
    } = useAuth()

    const [previouseRoute, setPreviousRoute] = useState(null)
    const { pathname } = useLocation()


    const { routes } = useContext(AppContext);
    const isUserRoleAuthenticated = getUserRoleAuthStatus(pathname, user, routes);
    let authenticated = isAuthenticated && isUserRoleAuthenticated;

    // IF YOU NEED ROLE BASED AUTHENTICATION,
    // UNCOMMENT ABOVE TWO LINES, getUserRoleAuthStatus METHOD AND user VARIABLE
    // AND COMMENT OUT BELOW LINE
    //let authenticated = isAuthenticated

    useEffect(() => {

        if (previouseRoute !== null) setPreviousRoute(pathname)

    }, [pathname, previouseRoute])

    
    //--------------------------------------- Developed by roshan
    //for check token is expired or not
    try {
        let accessToken = window.localStorage.getItem('accessToken')

        if (!isValidToken(accessToken)) {
            return (
                <Redirect
                    to={{
                        pathname: '/session/signin',
                        state: { redirectUrl: previouseRoute },
                    }}
                />
            )
        }


    } catch (err) {
        console.error(err)
    }
    //--------------------------------------------------------------

    if (authenticated) return <>{children}</>
    else {
        return (
            <Redirect
                to={{
                    pathname: '/session/signin',
                    state: { redirectUrl: previouseRoute },
                }}
            />
        )
    }
}

export default AuthGuard
