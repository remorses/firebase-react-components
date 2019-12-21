import React, { useEffect, useState, useMemo } from 'react'
import { Box, Row } from 'hybrid-components'
import usePromise from 'react-use-promise'

import styled, {
    createGlobalStyle,
    ThemeProvider,
    CSSObject
} from 'styled-components'
import {
    FacebookLoginButton,
    GoogleLoginButton,
    GithubLoginButton
} from 'react-social-login-buttons'

import firebase from 'firebase/app'
import 'firebase/auth'
import { BoxProps } from 'hybrid-components'

export type LoginButtonProps = {
    config: any
    text?: string
    signedInText?: string
    provider?: any
    onLogin?: (user: firebase.auth.UserCredential) => Promise<any>
} & BoxProps

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
            return () => {
                listener()
            }
        }
    }, [auth])

    return {
        auth,
        user
    }
}

export const GenericButton = ({
    text,
    config,
    provider = null as firebase.auth.AuthProvider,
    signedInText,
    Button,
    onLogin=null,
    ...rest
}) => {
    const { auth, user } = useProviders({ config })
    // console.log(user)
    const [result, error, state] = usePromise(async () => {
        if (auth) {
            try {
                const {user} = await auth
                    .getRedirectResult()
                if (user && onLogin) {
                    await onLogin(user)
                }
            } catch (e) {
                alert(e.message)
            }
        }
    }, [auth])

    return (
        <Box maxWidth='300px' {...rest}>
            {state === 'pending' ? (
                <Button
                    style={
                        {
                            background: '#eee',
                            color: 'black',
                            cursor: 'default',
                            boxShadow: 'none'
                        } as CSSObject
                    }
                    activeStyle={{}}
                    preventActiveStyles
                    className='bp3-skeleton'
                    text='loading'
                />
            ) : !user ||
              user.providerData[0].providerId !== provider.providerId ? (
                <Button
                    onClick={() => auth.signInWithRedirect(provider)}
                    text={text}
                />
            ) : (
                <Button
                    style={
                        {
                            background: '#eee',
                            color: 'black',
                            cursor: 'default',
                            boxShadow: 'none'
                        } as CSSObject
                    }
                    activeStyle={{}}
                    preventActiveStyles
                    text={signedInText}
                />
            )}
        </Box>
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
