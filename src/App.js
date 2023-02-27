import { useEffect } from "react"
import { getContract, getInfo, walletConnected } from "./components/Blockchain.Data"
import Header from "./components/Header"
import Home from "./components/Home"


const App = () => {
  useEffect( ()=> {
     walletConnected()
     getContract()
     getInfo()

  },[])
  return (
    <div>
    <Header/>
    <Home/>

    </div>
  )
}

export default App