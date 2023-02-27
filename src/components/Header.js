import '../components/App.css';

import { useGlobalState } from './Store'

const Header = () => {

    const [connectedAccount]  = useGlobalState("connectedAccount")
  return (
    <div>
    {connectedAccount ? (<div id="home">
        {connectedAccount}</div>
    ) : (<div id="home" >
       
   </div>)}
    </div>
  
  )
}

export default Header