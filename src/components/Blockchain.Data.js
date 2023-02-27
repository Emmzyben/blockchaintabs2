import Web3 from 'web3';
import abi from "../abis/blockchaintabs.json"
import {setGlobalState, getGlobalState } from './Store';


 const { ethereum } = window
window.web3 = new Web3(ethereum)
window.web3 = new Web3(window.web3.currentProvider)

const getContract = async () => {
  const connectedAccount = getGlobalState('connectedAccount')

  if (connectedAccount) {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = abi.networks[networkId]

    if (networkData) {
      const contract = new web3.eth.Contract(abi.abi, networkData.address)
      return contract
    } else {
      return null
    }
  } else {
    return getGlobalState('contract')
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0].toLowerCase())
  } catch (error) {
    reportError(error)
  }
}

const walletConnected = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0].toLowerCase())
      await walletConnected()
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0].toLowerCase())
    } else {
      alert('Please connect wallet.')
      console.log('No accounts found.')
    }
  } catch (error) {
    reportError(error)
  }
}   

const uploadContent = async ({ _imgHash , _content }) => {
  try {
   
    const contract = await getContract()
    console.log("contract", contract)
    const account = getGlobalState('connectedAccount')
   const upload =  await contract.methods.uploadImage(_imgHash, _content).send({from: account})
   console.log("upload..", upload)
   window.location.reload()

  } catch (error) {
    console.error(error)
    reportError(error)
  }
}

const getInfo = async () => {
  try {
   
    const contract = await getContract()
   const data =  await contract.methods.getData().call()
   setGlobalState('data', data)
   console.log("data..", data)

  } catch (error) {
    console.error(error.message)
    reportError(error)
  }
}

const reportError = (error) => {
  // setAlert(JSON.stringify(error), 'red')
  // throw new Error('No ethereum object.')
}

export {
  connectWallet,
  getContract,
  walletConnected,
  uploadContent,
  getInfo,
}