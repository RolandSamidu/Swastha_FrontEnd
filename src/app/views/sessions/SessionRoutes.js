import FirebaseLogin from './login/FirebaseLogin'
import JwtLogin from './login/JwtLogin'
import NotFound from './NotFound'
import ForgotPassword from './ForgotPassword'
import FirebaseRegister from './register/FirebaseRegister'

const sessionRoutes = [
    {
        path: '/session/signup',
        component: FirebaseRegister,
    },
    {
        path: '/session/signin',
        component: JwtLogin,
    },
    {
        path: '/session/forgot-password',
        component: ForgotPassword,
    },
    {
        path: '/session/404',
        component: NotFound,
    },
]

export default sessionRoutes
