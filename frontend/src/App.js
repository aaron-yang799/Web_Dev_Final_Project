import React, { useEffect, useState} from 'react'
import axios from 'axios'


function App() {

  const [backendData, setBackendData] = useState({})

  //feth api version
  //fetches /api route from backend and whatever response is recceived is put 
  //into backendData, only runs on the first render
  // useEffect(() => {
  //   fetch('/api').then(
  //     response => response.json()
  //   ).then(
  //     data => {
  //       setBackendData(data)
  //     }
  //   ).catch(
  //     err => {
  //       console.log(err)
  //     }
  //  )
  // }, [])

  //axios version
  useEffect(() => {
    axios.get('/api')
    .then(res => {
    setBackendData(res.data)
  }).catch(err => {
    console.log(err)
  })
  }, [])

  return (
    <div>
      {(backendData.message == null) ? (
        <h1>Loading...</h1>
      ): (
        <h1>{backendData.message}</h1>
      )}
    </div>
  );
}

export default App;
