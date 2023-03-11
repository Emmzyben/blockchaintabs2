import React, { useState, useEffect } from "react";
// import Web3 from 'web3';
import '../components/App.css';
import blockchainlogo from '../Assets/blockchain_logo-removebg-preview.png';
import js_logo from '../Assets/js logo.png';
import python_logo from '../Assets/python logo.jpg';
import solidity_logo from '../Assets/solidity logo.png';
import rustlogo from '../Assets/rust logo.png';
import webtri from '../Assets/web3.jpg';
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import { Buffer } from 'buffer'
import { useGlobalState } from "./Store";
import { connectWallet } from './Blockchain.Data';
import {getContract} from './Blockchain.Data';
import { walletConnected } from "./Blockchain.Data";
import {setGlobalState, getGlobalState } from './Store';

//i initialized an ipfs node using infura.
const auth = 'Basic ' + Buffer.from('2LS0CZRSsEVgQtS6pOXZl5lN09t' + ':' + 'c4eba38c0dfaade6c6d96e8359ce0026',).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  })

  const Home = () => {
    const [data] = useGlobalState("data")
    const [connectedAccount]  = useGlobalState("connectedAccount")
    const [fileLink, setFileLink] = useState('')
    const [imgPic, setImgPic] = useState(null)
    const [textfiles, setfiles] = useState([]);

    
    
    useEffect( ()=> {
      walletConnected()
      getContract()
      
 
   },[])
//stores and retrives ipfs hash/url from my smart contract.
   const addHash = async ({_ipfsHash}) => {
    try {
     
      const contract = await getContract()
      console.log("contract", contract)
      const account = getGlobalState('connectedAccount')
     const upload =  await contract.methods.addHash(_ipfsHash).send({from: account})
     console.log("upload..", upload)
     const data = await contract.methods.getAllHashes().call()
        console.log(data)
  
      
      } catch (error) {
        console.error(error)
        reportError(error)
      }
    }  
    //This where i handled the file submission. i uploaded a file containing an image
    //and a text to ipfs. then converted it to url(which contains the hash). 
    //then sent the url to my smart contract. afterwhich i seperated the file into its image and content part.
    //then set the state using usestate. then rendered the image and text on my frontend
    const handleSubmit = async (event) => {
      event.preventDefault();
      const form = event.target;
      const files = form[0].files;
    
      if (!files || files.length === 0) {
        return alert("No files selected");
      }
    
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const fileContent = reader.result;
        const created = await client.add(file);
        const cid = created.cid;
        const path = created.path;
        const URI = `https://ipfs.io/ipfs/${created.path}`;
        const upload = { URI, fileContent };
        console.log(upload);
        await addHash({ _ipfsHash: URI });
    
        setfiles([
          ...textfiles,
          {
            cid,
            path,
            fileContent,
            description: form[1].value,
          },
        ]);
        form.reset();
      };
    };
    
    return (
//the frontend code
    <>
    <div className="App">
     
        <header>
      <img src={blockchainlogo} id="logop" alt='bc logo'/>
      <h2 id="label">blockchain tabs</h2>
      <button id="home" onClick={connectWallet}>
    Connect wallet
    </button>
      
    <div id='topper'>
    {connectedAccount ? (<div >
        {connectedAccount}</div>
    ) : (<div  >
       
   </div>)}
    </div>

      <div id="smallscreen">
      <form onSubmit={handleSubmit} >
  <div>
    <label id="label2">Choose an image:</label>
    <input type="file" accept=".txt,.jpg,.jpeg,.png" id="file2" required />
  </div>
  <div>
    <textarea id="description" placeholder="post your article here" className="text2"  required></textarea>
  </div>
  <button type="submit" id="subm2">Submit</button>
</form>



      </div>
      <p id="notice">Post an article and share your knowledge with the blockchain community</p>
    </header>
    <nav>
      <div id="spaces">
        <h3>Spaces:</h3>
        <ul>
          <li>
            <img src={python_logo}  alt="python" /> <br />
            Python
          </li>
          <li>
            <img src={js_logo} alt="js" /> <br />
            Javascript
          </li>
          <li>
            <img src={solidity_logo} alt="solidity" /> <br />
            Solidity
          </li>
          <li>
            <img src={rustlogo} alt="rust" /> <br />
            Rust
          </li>
          <li>
            <img src={webtri}   alt="web3" /> <br />
            Web3
          </li>
        </ul>
      </div>
    </nav>
  
    <section>
      <div id="modal">
        <h3>Post your article</h3>
        <h4 style={{ color: "rgb(226, 79, 79)" }}>
          Share your knowledge with the community!
        </h4>
     </div>

     <form onSubmit={handleSubmit} id="modal">
  <div>
    <label>Attach an image:</label>
    <input type="file" accept=".txt,.jpg,.jpeg,.png" id="file" required />
  </div>
  <div>
    <textarea id="description" placeholder="post your article here" required></textarea>
  </div>
  <button type="submit" id="subm">Submit</button>
</form>



    </section>
<article>
<div className="parent">
  {textfiles.map((file, index) => (
    <div key={file.cid.toString() + index} className="display">
      <img src={file.fileContent} alt={`File ${index + 1}`}  />
      <p> <strong>post-{index + 1}</strong> : {file.description}</p>
    </div>
  ))}
</div>

</article>
      </div>
    </>
  );
}

export default Home
