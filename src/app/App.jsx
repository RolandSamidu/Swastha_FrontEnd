import '../fake-db'
import React, {
    useContext,
    useEffect,
    useState,
} from 'react'
import { Provider } from 'react-redux'
import { Router, Switch, Route } from 'react-router-dom'
import AppContext from './contexts/AppContext'
import history from 'history.js'
import routes from './RootRoutes'
import { Store } from './redux/Store'
import { GlobalCss, MatxSuspense, MatxTheme, MatxLayout } from 'app/components'
import sessionRoutes from './views/sessions/SessionRoutes'
import PublicRoute from './views/PublicPages/PublicRoute'
import AuthGuard from './auth/AuthGuard'
//import { AuthProvider } from 'app/contexts/FirebaseAuthContext'
import { AuthProvider } from 'app/contexts/JWTAuthContext';// edited by roshan 
import { SettingsProvider } from 'app/contexts/SettingsContext'
window.dashboardVariables = {};
// Test itit


const App = () => {

    /*  useEffect(() => {
         const unloadCallback = (event) => {
           event.preventDefault();
           event.returnValue = "";
           console.log("event",event)
           return "";
         };
       
         window.addEventListener("beforeunload", unloadCallback);
         return () => window.removeEventListener("beforeunload", unloadCallback);
       }, []); */
    return (
        <AppContext.Provider value={{ routes }}>
            <Provider store={Store}>
                <SettingsProvider>
                    <MatxTheme>
                        <GlobalCss />
                        <Router history={history}>
                            <AuthProvider>

                                <MatxSuspense>
                                    <Switch>
                                        {/* AUTHENTICATION PAGES (SIGNIN, SIGNUP ETC.) */}
                                        {sessionRoutes.map((item, i) => (
                                            <Route
                                                key={i}
                                                path={item.path}
                                                component={item.component}
                                            />
                                        ))}

                                        {PublicRoute.map((item, i) => (
                                            <Route
                                                key={i}
                                                path={item.path}
                                                component={item.component}
                                            />
                                        ))}
                                        {/* AUTH PROTECTED DASHBOARD PAGES */}
                                        <AuthGuard>
                                            <MatxLayout />{' '}
                                            {/* RETURNS <Layout1/> component */}
                                        </AuthGuard>
                                    </Switch>
                                </MatxSuspense>
                            </AuthProvider>
                        </Router>
                    </MatxTheme>
                </SettingsProvider>
            </Provider>
        </AppContext.Provider>
    )
}

export default App
