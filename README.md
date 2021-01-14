# firebase button components

![](.github/screen.png)

## Usage

```
yarn add firebase-react-components
```

```tsx
import { GoogleButton, GithubButton, useAuthData } from 'firebase-react-components'
import React from 'react'
import firebase from 'firebase'

const App = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
    }
    return (
        <div>
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
        </div>
    )
}

const DisplayUser = () => {
    const { user={}, loading } = useAuthData()
    if (loading) {
        return <>loading...</>
    }
    return (
        <pre>{JSON.stringify(user, null, 4)}</pre>
    )
}
```
