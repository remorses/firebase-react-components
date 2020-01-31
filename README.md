# firebase components

## Usage

```
yarn add firebase-react-components
```

```tsx
import { GoogleButton, GithubButton } from 'firebase-react-components'
import React from 'react'
import { H1, Image, Text, Box, Row } from 'hybrid-components'
import firebase from 'firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

const App = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
    }
    const [user, loading, error] = useAuthState(firebase.auth())
    return (
        <Box alignContent='center' alignItems='center'>
            <GoogleButton
                text='Start With Google'
                onLogin={async (user) => alert(JSON.stringify(user, null, 4))}
            />
            <GithubButton text='Start With Github' />
            <Box maxWidth='800px' overflowX='scroll'>
                <pre>{JSON.stringify(user, null, 4)}</pre>
            </Box>
        </Box>
    )
}
```
