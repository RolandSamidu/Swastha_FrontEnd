import { useContext } from 'react'
//import AuthContext from 'app/contexts/FirebaseAuthContext'
import AuthContext from 'app/contexts/JWTAuthContext';//edited by roshan

const useAuth = () => useContext(AuthContext)

export default useAuth
