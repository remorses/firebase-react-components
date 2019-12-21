import React from 'react'
import App from './App'
import { render } from 'react-dom'
render(<App />, document.getElementById('root'))

// @ts-ignore
if (module.hot) {
    // @ts-ignore
    module.hot.accept()
}
