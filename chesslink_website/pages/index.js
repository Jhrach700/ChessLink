
import { useEffect, useState, Component, useRef, createRef } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import React from "react";
import { ethers,ContractFactory ,Wallet} from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'

import {
  nftmarketaddress, nftaddress
} from '../config'

import {ipfs} from 'C://Users/jhrac/Downloads/data.json';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

import "../node_modules/cm-chessboard/assets/styles/cm-chessboard.css"
import {Chessboard, INPUT_EVENT_TYPE, MOVE_INPUT_MODE, COLOR} from "../node_modules/cm-chessboard/src/cm-chessboard/Chessboard.js"
let { networkConfig, autoFundCheck ,chaincontractConfig } = require('../helper-hardhat-config')
let additionalMessage = ""
let linkTokenAddress=networkConfig[42]['linkToken']
const networkName = networkConfig[42]['name']
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { TwitchEmbed, TwitchChat, TwitchClip, TwitchPlayer } from 'react-twitch-embed';


export default function test() {
  const [positions, setPositions] = useState([])
  const [loaded,setLoaded] = useState('not-loaded')
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [update, setUpdate] = useState('not-changed')
  const [numberOfCriticalPositionsJustAdded,setNumberOfCriticalPositionsJustAdded] = useState(0)
  const [critical_positions, setCriticalPositions] = useState([])
  const[ready_to_load, setReadyToLoad] = useState('false')

  const [formInput, setFormInput] = useState([{ price: ''}])

  useEffect(() => {
    //loadNFTs()
    if (loaded != 'loaded') {
        //let h = ipfs.replace(/['"]+/g, '') + "?filename=data.json"
        //alert(h)
        console.log("nothing")

    } else {
        //alert("_ chess games recognized")
        load_actual_chess_positions()
        //alert("now the actual chess DOM elements get loaded")
        //alert("loaded now can call stuff")
    }
  })



  async function createMarket(critical_p,i) {

    const data = JSON.stringify( {
        wp : critical_p.white_player, bp : critical_p.black_player, fen : critical_p.fen, 
        o_minter : critical_p.original_minter, w_elo : critical_p.white_elo, b_elo : critical_p.black_elo
    })

    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      
      
      createSale(url,i)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url,i) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    let input_form = document.getElementsByTagName("input")[i].value
    let price = null
    if (input_form === '') {
      price = ethers.utils.parseUnits("1", 'ether')
    } else {
      price = ethers.utils.parseUnits(input_form, 'ether')
    }

    //const price = ethers.utils.parseUnits("1", 'ether')
    //const price = ethers.utils.parseUnits(formInput.price, 'ether')
  
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await transaction.wait()

    await signer.getAddress().then( e => {
      let nc = critical_positions.slice()
      nc[i].minted = "true"
      //alert(e)
      nc[i].original_minter = e.toString()
      setCriticalPositions(nc)
      alert("successfully minted a chess nft!")
    })

    //alert(nc[i].original_minter)
    //let rc = nc.slice()
    //alert(rc[i].original_minter)

    //router.push('/')
  }

  async function deploychainlink() {
    try {
     // let fenstring="r3r1k1/ppnqbppb/3p1n1p/2pP4/2P1PBP1/2NN3P/PPQ3B1/R4RK1 w - - 7 17zzzr3r3/ppnqbppk/3p1nbp/2pP4/2P1PBP1/2NN3P/PP1Q2B1/4RRK1 w - - 11 19zzzcosmo74zzzedi1991"

      const bytecode = chaincontractConfig["bytecode"]
      // A Human-Readable ABI; we only need to specify relevant fragments,
      // in the case of deployment this means the constructor
      const abi = chaincontractConfig["abi"];

      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)   
     //const provider = new ethers.providers.JsonRpcProvider("https://kovan.infura.io/v3/a6dbd0c278ab481cbd1326a6386fc84a");
     const signer = provider.getSigner()
      //const signer = provider.getSigner()
      //alert("hi")
      //Wallet code
     //var walletPrivateKey = new Wallet("")
      //var testwallet = walletPrivateKey.connect(provider)
      //signer= testwallet.provider.getSigner()
      const linktokenAddress = "0xa36085F69e2889c224210F603D836748e7dC0088";
      const linktokenAbi = [
        // Some details about the token
        "function transfer(address _to, uint _value)"
  
      ];
      const linktokenContract = new ethers.Contract(linktokenAddress, linktokenAbi, provider);
      const onelinktoken = ethers.utils.parseUnits("1.0", 18);
      const linkSigner = linktokenContract.connect(signer);
      //const linkSigner = linktokenContract.connect(testwallet.provider.getSigner());
      //const url2 = ipfs + 

      //IPFS URL is loaded locally 
      let url = ipfs.replace(/['"]+/g, '') + "?filename=data.json"

      //const url="https://ipfs.infura.io/ipfs/QmdTf1thVPTe1yzUGeZsedRb96fZJSecHnh7WynC6Ngjqh?filename=data.json"
      const path="data"
     // const url="https://ipfs.infura.io/ipfs/QmbkncUgs9rMWWQhUNyGDXBWn8346JSXDrYLRFZes8tvBj?filename=data.json"
      // The factory we use for deploying contracts
      
      var factory = new ContractFactory(abi, bytecode,signer)
      //var factory = new ContractFactory(abi, bytecode, testwallet.provider.getSigner())

      //alert("starting contract deploy and read")
      var apiConsumer2 = await factory.deploy(url,path)

      //alert("contract address: ")
     
      var waitcontract=await apiConsumer2.deployTransaction.wait();
      //alert(apiConsumer2.address)
      sleepFor(1000);


      var testit=await linkSigner.transfer(apiConsumer2.address,onelinktoken)
      const erc20 = new ethers.Contract(apiConsumer2.address, abi, provider);
//      const erc20 = new ethers.Contract(apiConsumer2.address, abi, testwallet.provider);

      const erc20_rw = new ethers.Contract(apiConsumer2.address, abi, signer);
   //   const erc20_rw = new ethers.Contract(apiConsumer2.address, abi, testwallet.provider.getSigner());

      sleepFor(10000);

      //alert("request byte transaction hash is")
      var result1 = await erc20_rw.requestBytes()
      //alert(result1.hash)
      var response = ""
      while (response.length == 0) {
        sleepFor(1000)
        response = (await erc20.image_url()).toString()
      }
      alert(response)
      let critical_pos = []
      for (let i = 0; i < 3; i++) {
          critical_pos.push({
              white_player: response.split("zzz")[3],
              black_player: response.split("zzz")[4],
              white_elo: response.split("zzz")[5],
              black_elo: response.split("zzz")[6],
              fen: response.split("zzz")[i],
              minted : "false",
              price: "",
              original_minter : ""
          })
      }
      let nc = critical_pos.slice()
      await signer.getAddress().then( e => {
        for (let i = 0; i < nc.length; i++) {
          nc[i].original_minter = e.toString()
        }
        
      })

      if (critical_positions.length == 0) {
          
          setCriticalPositions(nc);
      } else {
          setCriticalPositions(critical_positions.concat(nc));
      }

      //This makes sure we only create html div boards for only the last n = 3
      //critical positions obtained. 
      setNumberOfCriticalPositionsJustAdded(3)
      //Now that we have our response, we can set ready_to_load to True
      //In order to asynchronously load 
      //setReadyToLoad('true');
      setLoaded('loaded')

    } catch (error) {
      alert("error")
      alert(error)
      console.log('Error uploading file: ', error)
    }  
  }

  function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ 
        /* Do nothing */ 
    }
    }

  function load_actual_chess_positions() {
    //let pos = "r3r1k1/ppnqbppb/3p1n1p/2pP4/2P1PBP1/2NN3P/PPQ3B1/R4RK1 w - - 7 17"
    //let pos2 = "r3r3/ppnqbppk/3p1nbp/2pP4/2P1PBP1/2NN3P/PP1Q2B1/4RRK1 w - - 11 19"
    //let pos3 = "1q1r1bk1/1pn1rppp/1P1p4/3P4/3BP3/5P2/3QB1PP/R1R3K1 b - - 0 24"
    //console.log(critical_positions[0].fen)
    //recreating stuff
    //orientation: COLOR.white

    for (let i = critical_positions.length - numberOfCriticalPositionsJustAdded; i < critical_positions.length; i++) {
        let orientation2 = null;
        if (critical_positions[i].fen.split(' ')[1] == 'w') {
          orientation2 = COLOR.white;
        } else {
          orientation2 = COLOR.black;
        }

        const board = new Chessboard(document.getElementById(i), {
            position: critical_positions[i].fen,
            orientation: orientation2,
            sprite: {url: './chessboard-sprite-staunty.svg',
          grid:40}
          });
    }
    setLoaded("not-loaded")
  }

    //Unused function --> only used to avoid 1 minute wait from chainlink when working on other components
    async function fakeDeploy() {
        //let response = "r3r1k1/ppnqbppb/3p1n1p/2pP4/2P1PBP1/2NN3P/PPQ3B1/R4RK1 w - - 7 17zzzr3r3/ppnqbppk/3p1nbp/2pP4/2P1PBP1/2NN3P/PP1Q2B1/4RRK1 w - - 11 19zzzcosmo74zzzedi1991"
        //let response = "r3r1k1/ppnqbppb/3p1n1p/2pP4/2P1PBP1/2NN3P/PPQ3B1/R4RK1 w - - 7 17zzzr3r1k1/ppnqbppb/3p1n1p/2pP4/2P1PBP1/2NN3P/PPQ3B1/R4RK1 w - - 7 17zzzr3r3/ppnqbppk/3p1nbp/2pP4/2P1PBP1/2NN3P/PP1Q2B1/4RRK1 w - - 11 19zzzcosmo74zzzedi1991"
        //alert(response)
        let response = "r2qr1k1/1p3ppp/2pb4/p1n1p2b/4P3/1P2QNPP/PBP2PB1/R4RK1 w - a6 0 15zzzr2qr1k1/1p3ppp/2pb4/p1n1p2b/4P3/PP2QNPP/1BP2PB1/R4RK1 b - - 0 15zzz8/7p/4kpp1/1p2p3/pPbqP1P1/P5NP/1Q3PK1/8 b - - 9 38zzzDante1389zzzdrake70zzz2184zzz2499"

        let critical_pos = []
        for (let i = 0; i < 3; i++) {
            critical_pos.push({
                white_player: response.split("zzz")[3],
                black_player: response.split("zzz")[4],
                white_elo: response.split("zzz")[5],
                black_elo: response.split("zzz")[6],
                fen: response.split("zzz")[i],
                minted : "false",
                price: "",
                original_minter : "0xcD189E66f7C66EB084e216E745D2c4AFA129177A"
            })
        }

        if (critical_positions.length == 0) {
            
            setCriticalPositions(critical_pos);
        } else {
            setCriticalPositions(critical_positions.concat(critical_pos));
        }

        //This makes sure we only create html div boards for only the last n = 3
        //critical positions obtained. 
        setNumberOfCriticalPositionsJustAdded(3)
        //Now that we have our response, we can set ready_to_load to True
        //In order to asynchronously load 
        //setReadyToLoad('true');
        setLoaded('loaded')
    }

  if (!critical_positions.length) return (
    <div className="container">
        <div className="flex justify-center"> 
            <button onClick={deploychainlink} className="flex justify-center font-bold mt-4 bg-black text-white rounded p-4 shadow-lg border-2 border-white-800 border-opacity-100 rounded-full py-3 px-6">
              Generate Critical Positions
            </button>
        </div>

        <div className="flex justify-center p-3"> 
          
        <TwitchEmbed
        channel="JobavasWitness"
        id="JobavasWitness"
        theme="dark"
        muted
        onVideoPause={() => console.log(':(')}
      />
        </div>

        <div className="flex justify-center"> 
            <h1 className="py-10 px-20 text-3xl">No critical positions generated yet</h1>
        </div>
  </div>
  )

  return (
    <div className="container bg-black">

        <div className="flex justify-center bg-black"> 
        
        <button onClick={deploychainlink} className="flex justify-center font-bold mt-4 bg-black text-white rounded p-4 shadow-lg border-2 border-white-800 border-opacity-100 rounded-full py-3 px-6">
          Generate Critical Positions
        </button>
        </div>
        <div className="flex justify-center p-3"> 
          
        <TwitchEmbed
        channel="JobavasWitness"
        id="JobavasWitness"
        theme="dark"
        muted
        onVideoPause={() => console.log(':(')}
      />
        </div>
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {
            critical_positions.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden  bg-black" >

                  <div className="flex justify-center font-mono p-1.5 text-white">{nft.fen.split(" ")[1] === 'w' ? <div>{nft.black_player} ({nft.black_elo})</div> : <div>{nft.white_player} ({nft.white_elo})</div>} </div>
                  <div className="p-2">
                    <div id={i} ></div>
                  </div>

                  <div className="flex justify-center font-mono p-1.5 text-white">{nft.fen.split(" ")[1] === 'w' ? <div>{nft.white_player} ({nft.white_elo})</div> : <div>{nft.black_player} ({nft.black_elo})</div>} </div>

                <div className="flex items-center pl-4">
                <input 
                  
                  placeholder="Price"
                  className="mt-8 border rounded p-4"
                  style={{color:"#3CBC8D"},
                  {background:"black"}    
                  }
                  
                  form-id={i}
              
                />
                  <p className="text-2xl font-bold text-white text-center p-4 pt-10 ">{nft.price} MATIC</p>

                </div>        
                 <div className="flex justify-center text-white pb-5">
                  <div className={nft.minted === 'false' ? 'visible' : "invisible"}>
                 <button onClick={() => createMarket(nft,i)} className="flex justify-center font-bold mt-4 bg-black text-white rounded p-4 shadow-lg border-2 border-white-800 border-opacity-100">
                  {nft.minted === 'false' ? "Mint" : "Already Minted!"}
                  </button>
                  </div>
                </div>
                
            </div>
            ))
          }
        </div>
      </div>
    </div>
    </div>
  )

}
