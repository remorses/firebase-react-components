# firebase button components

![](.github/screen.png)

## Usage

```
yarn add firebase-react-components
```

```tsx
import { GoogleButton, GithubButton, useAuthData } from 'firebase-react-components'
import React from 'react'
import { H1, Image, Text, Box, Row } from 'hybrid-components'
import firebase from 'firebase'

const App = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
    }
    return (
        <Box alignContent='center' alignItems='center'>
            <AuthProvider
                syncToCookie='FIREBASE_COOKIE' // syncs the user idToken to the cookie FIREBASE_COOKIE
                syncToLocalStorage='FIREBASE_TOKEN' // syncs the user idToken to the local storage
                onLogin={async (user, creds) => {
                    
                    console.log(creds.toJSON())
                }}
                onError={(e) => alert(e.message)}
            >
                <GoogleButton
                    text='Start With Google'
                    // scopes={['https://www.googleapis.com/auth/cloud-platform']}
                />
                <GithubButton text='Start With Github' />
                <DisplayUser />
            </AuthProvider>
        </Box>
    )
}

const DisplayUser = () => {
    const { user={}, loading } = useAuthData()
    if (loading) {
        return <>loading...</>
    }
    return (
        <Box maxWidth='800px' overflowX='scroll'>
            <pre>{JSON.stringify(user, null, 4)}</pre>
        </Box>
    )
}
```
