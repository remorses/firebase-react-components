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
import Cookies from 'js-cookie'

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
        credential?: firebase.auth.AuthCredential,
    ) => Promise<any>
    onError?: (e: firebase.FirebaseError) => void
    syncToCookie?: string
    syncToLocalStorage?: string
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
    const {
        children,
        onLogin,
        onError,
        noPersistence,
        syncToCookie,
        syncToLocalStorage,
    } = props
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
    syncToken({ syncToCookie, syncToLocalStorage })
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

function syncToken({
    syncToLocalStorage,
    syncToCookie,
}: {
    syncToLocalStorage?: string
    syncToCookie?: string
}) {
    useEffect(() => {
        return firebase.auth().onIdTokenChanged(
            async (user) => {
                // signed out
                if (!user) {
                    if (syncToCookie) {
                        console.log(
                            'signed out, removing cookie ' + syncToCookie,
                        )
                        Cookies.remove(syncToCookie)
                    }
                    if (syncToLocalStorage) {
                        console.log(
                            'signed out, removing local storage item ' +
                                syncToLocalStorage,
                        )
                        localStorage.removeItem(syncToLocalStorage)
                    }
                    return
                }
                // signed in
                const { expirationTime, token } = await user.getIdTokenResult()
                if (syncToCookie) {
                    console.log('storing idToken to cookie ' + syncToCookie)
                    Cookies.set(syncToCookie, token, {
                        path: '/',
                        expires: new Date(expirationTime),
                    })
                }
                if (syncToLocalStorage) {
                    console.log(
                        'storing idToken to local storage item ' +
                            syncToLocalStorage,
                    )
                    localStorage.setItem(syncToLocalStorage, token)
                }
            },
            (e) => {
                if (syncToCookie) {
                    console.warn(
                        'deleting cookie ' +
                            syncToCookie +
                            ' because of auth error: ' +
                            e.message,
                    )
                    Cookies.remove(syncToCookie)
                }
                if (syncToLocalStorage) {
                    console.warn(
                        'deleting local storage item ' +
                            syncToLocalStorage +
                            ' because of auth error: ' +
                            e.message,
                    )
                    localStorage.removeItem(syncToLocalStorage)
                }
            },
        )
    }, [])
}
