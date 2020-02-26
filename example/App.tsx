import { GoogleButton, GithubButton } from '../src/'
import React, { useState } from 'react'
import { H1, Image, Text, Box, Row } from 'hybrid-components'
import firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'

const App = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
    }
    const [user, setUser] = useState({})
    return (
        <Box alignContent='center' alignItems='center'>
            <GoogleButton
                text='Start With Google'
                scopes={['https://www.googleapis.com/auth/cloud-platform']}
                onLogin={async (user, creds) => {
                    console.log(creds.toJSON())
                    setUser(user)
                }}
            />
            <GithubButton text='Start With Github' />
            <Box maxWidth='800px' overflowX='scroll'>
                <pre>{JSON.stringify(user, null, 4)}</pre>
            </Box>
        </Box>
    )
}

const firebaseConfig = {
    apiKey: 'AIzaSyD0ll629FiyH5SJ903ZeDdYpahfGPOqzxQ',
    authDomain: 'molten-enigma-261612.firebaseapp.com',
    databaseURL: 'https://molten-enigma-261612.firebaseio.com',
    projectId: 'molten-enigma-261612',
    storageBucket: 'molten-enigma-261612.appspot.com',
    messagingSenderId: '794182721870',
    appId: '1:794182721870:web:945e67c12addaa0cd43e1f',
    measurementId: 'G-YL40MBMZ0L',
}

export default App
// render(<App />, document.getElementById('root'))
