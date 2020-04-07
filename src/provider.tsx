import firebase from 'firebase/app'
import 'firebase/auth'
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    FC,
    ReactComponentElement,
    ComponentType,
} from 'react'
import usePromise from 'react-use-promise'

interface AuthProviderValue {
    user?: firebase.User
    // credential: any
    loading: boolean
}

export const AuthContext = createContext<AuthProviderValue>({
    loading: false,
    // user: undefined,
    // credential: null,
})

export interface AuthProviderProps {
    noPersistence?: boolean
    onLogin?: (
        user: firebase.User,
        credential?: firebase.auth.OAuthCredential,
    ) => Promise<any>
    onError?: (e: firebase.FirebaseError) => void
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
    const { children, onLogin, onError, noPersistence } = props
    useState(() => {
        if (noPersistence) {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
        }
    })
    const { user } = useAuth()
    const [result, error, state] = usePromise(async () => {
        try {
            const {
                user,
                credential,
                operationType,
            } = await firebase.auth().getRedirectResult()
            if (user && onLogin) {
                console.log('received user, calling onLogin')
                await onLogin(user, credential)
            }
        } catch (e) {
            await onError(e)
            return
        }
    }, [])
    const value = {
        user,
        loading: state === 'pending',
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthData(): AuthProviderValue {
    return useContext(AuthContext)
}

export const withAuthProvider = (
    config: AuthProviderProps,
    Comp: ComponentType,
) => {
    return (p) => (
        <AuthProvider {...config}>
            <Comp {...p} />
        </AuthProvider>
    )
}

function useAuth() {
    const [user, setUser] = useState<firebase.User>(undefined)
    if (!firebase.apps.length) {
        console.error(
            'you must call firebase.auth().initializeApp() before using firebase-react-components',
        )
    }

    useEffect(() => {
        const listener = firebase.auth().onAuthStateChanged(
            (user) => {
                setUser(user)
                // alert('auth state changed ' + JSON.stringify(user))
            },
            (e) => alert(e.message),
        )
        return () => listener()
    })

    return {
        user,
    }
}
