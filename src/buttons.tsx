import { useMemo } from 'react'
import { useAuthData } from './provider'
import firebase from 'firebase'
import {
    GoogleLoginButton,
    GithubLoginButton,
} from 'react-social-login-buttons'
import { CSSObject } from 'styled-components'
import React from 'react'

export type LoginButtonProps = {
    text?: string
    provider?: any
    scopes?: Array<string>
}

export const GenericButton = ({
    text,
    provider = null as firebase.auth.AuthProvider,
    Button,
}: LoginButtonProps & { Button }) => {
    const { user, loading } = useAuthData()

    if (loading) {
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
                text='loading'
            />
        )
    }

    return (
        <Button
            onClick={() => firebase.auth().signInWithRedirect(provider)}
            text={text}
        />
    )
}

function useProvider({ Provider, scopes }) {
    const provider = useMemo(() => {
        const p = new Provider()
        if (scopes && scopes.length) {
            scopes.forEach((scope) => {
                p?.addScope?.(scope)
            })
        }
        return p
    }, [])
    return provider
}

export const GoogleButton = ({ scopes, ...props }: LoginButtonProps) => {
    const provider = useProvider({
        Provider: firebase.auth.GoogleAuthProvider,
        scopes,
    })
    return (
        <GenericButton
            text='Sign In With Google'
            Button={GoogleLoginButton}
            provider={provider}
            {...props}
        />
    )
}

export const GithubButton = ({ scopes, ...props }: LoginButtonProps) => {
    const provider = useProvider({
        Provider: firebase.auth.GithubAuthProvider,
        scopes,
    })
    return (
        <GenericButton
            text='Sign In With Github'
            Button={GithubLoginButton}
            provider={provider}
            {...props}
        />
    )
}
