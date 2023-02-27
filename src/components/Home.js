import React, { useState, useEffect } from "react";
// import Web3 from 'web3';
import '../components/App.css';
import blockchainlogo from '../Assets/blockchain_logo-removebg-preview.png';
import js_logo from '../Assets/js logo.png';
import python_logo from '../Assets/python logo.jpg';
import solidity_logo from '../Assets/solidity logo.png';
import rustlogo from '../Assets/rust logo.png';
import webtri from '../Assets/web3.jpg';
import {create} from "ipfs-http-client"
import { Buffer } from 'buffer'
import { getInfo, uploadContent } from "./Blockchain.Data";
import { useGlobalState } from "./Store";
import { connectWallet } from './Blockchain.Data'
const auth =
'Basic ' +
Buffer.from(
  "2LS0CZRSsEVgQtS6pOXZ151N09" + ':' + "https://ipfs.infura.io:5001",
).toString('base64')

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

    const [content, setContent] = useState('')
    const [fileLink, setFileLink] = useState('')
    const [imgPic, setImgPic] = useState(null)
    


    const [effect, setEffect] = useState(false)
    useEffect(()=> {
        const Data = async () => {
            setEffect(true);
            await getInfo()
            };
            Data();
          },[])

          
    const handleSubmit = async (e) =>{
        e.preventDefault()

        if( !content ) return
        try {
            const created = await client.add(fileLink)
            const URI = `https://ipfs.io/ipfs/${created.path}`
            const upload = {URI,content}
            console.log(upload)
            await uploadContent({_imgHash:URI, _content:content})
           
        } catch (error) {
            console.log("Error ", error)
            
        }
    }


    const changPic = async (e) =>{
        const reader = new FileReader()
        if(e.target.files[0]) reader.readAsDataURL(e.target.files[0])

        reader.onload = (readerEvent) => {
            const file = readerEvent.target.result
            setImgPic(file)
            setFileLink(e.target.files[0])
        }
    }
    
    return (

    <>
    <div className="App">
     
        <header>
      <img src={blockchainlogo} id="logop" alt='bc logo'/>
      <h2 id="label">blockchain tabs</h2>
      <button id="home" onClick={connectWallet}>
    Connect wallet
    </button>
      <input type="text" placeholder="Search.." />
      <div id="smallscreen">
        <form onSubmit={handleSubmit} >
          <textarea 
           type='text'  
           placeholder='post your article'
           name='description' 
            id="text2"
           onChange={(e) => setContent(e.target.value)} 
           value={content}         
          required></textarea>
  <div id="file2">
     <p id="label2">Attach an image</p>
     <input 
      type='file' 
     accept=' image/webp, image/png, image/gif, image/jpeg, image/jpg,'                
    onChange={changPic}
     required/>
  </div>
      <button type="submit" id="subm2"> submit  </button>
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
          <textarea 
           type='text'  
           placeholder='post your article'
           name='description'   
           onChange={(e) => setContent(e.target.value)} 
           value={content}         
          required></textarea>
  <div id="file">
     <label >Attach image</label>
     <input 
      type='file' 
     accept=' image/webp, image/png, image/gif, image/jpeg, image/jpg,'                
    onChange={changPic}
     required/>
  </div>
      <button type="submit" id="subm"> submit  </button>
      </form>
    </section>
<article>

</article>
      </div>
    </>
  );
}

export default Home
