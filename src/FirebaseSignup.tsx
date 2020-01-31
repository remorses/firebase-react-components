import firebase from 'firebase/app'
import 'firebase/auth'
import React, { useEffect, useMemo, useState } from 'react'
import {
    GithubLoginButton,
    GoogleLoginButton,
} from 'react-social-login-buttons'
import usePromise from 'react-use-promise'
import { CSSObject } from 'styled-components'

export type LoginButtonProps = {
    config: any
    text?: string
    signedInText?: string
    provider?: any
    onLogin?: (user: firebase.User) => Promise<any>
    onError?: (e: firebase.FirebaseError) => void
}

function useProviders({ config, ...rest }) {
    const [user, setUser] = useState<firebase.User>(undefined)
    const [auth, setAuth] = useState<firebase.auth.Auth>(undefined)

    useEffect(() => {
        if (!firebase.apps.length) {
            firebase.initializeApp(config)
        }

        setAuth(firebase.auth())
    }, [])

    useEffect(() => {
        if (auth) {
            const listener = auth.onAuthStateChanged(
                (user) => {
                    setUser(user)
                    // alert('auth state changed ' + JSON.stringify(user))
                },
                (e) => alert(e.message)
            )
            return listener
        }
    }, [auth])

    return {
        auth,
        user,
    }
}

export const GenericButton = ({
    text,
    config,
    provider = null as firebase.auth.AuthProvider,
    signedInText,
    Button,
    onLogin = null,
    onError = (e: firebase.FirebaseError) => alert(e.message),
}) => {
    const { auth, user } = useProviders({ config })
    const [result, error, state] = usePromise(async () => {
        if (auth) {
            try {
                const { user } = await auth.getRedirectResult()
                if (user && onLogin) {
                    await onLogin(user)
                }
            } catch (e) {
                onError(e)
            }
        }
    }, [auth])

    if (state === 'pending') {
        return (
            <Button
                style={
                    {
                        background: '#eee',
                        color: 'black',
                        cursor: 'default',
                        boxShadow: 'none',
                    } as CSSObject
                }
                activeStyle={{}}
                preventActiveStyles
                className='bp3-skeleton'
                text='loading'
            />
        )
    }
    if (!user || user.providerData[0].providerId !== provider.providerId) {
        return (
            <Button
                onClick={() => auth.signInWithRedirect(provider)}
                text={text}
            />
        )
    }
    return (
        <Button
            style={
                {
                    background: '#eee',
                    color: 'black',
                    cursor: 'default',
                    boxShadow: 'none',
                } as CSSObject
            }
            activeStyle={{}}
            preventActiveStyles
            text={signedInText}
        />
    )
}

export const GoogleButton = (props: LoginButtonProps) => {
    const provider = useMemo(() => new firebase.auth.GoogleAuthProvider(), [])
    return (
        <GenericButton
            text='Sign In With Google'
            signedInText='Signed In With Google'
            Button={GoogleLoginButton}
            provider={provider}
            {...props}
        />
    )
}

export const GithubButton = (props: LoginButtonProps) => {
    const provider = useMemo(() => new firebase.auth.GithubAuthProvider(), [])
    return (
        <GenericButton
            text='Sign In With Github'
            signedInText='Signed In With Github'
            Button={GithubLoginButton}
            provider={provider}
            {...props}
        />
    )
}
