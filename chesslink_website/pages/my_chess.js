
import { useEffect, useState, Component } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import React from "react";
import { ethers,ContractFactory ,Wallet} from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

import "../node_modules/cm-chessboard/assets/styles/cm-chessboard.css"
import {Chessboard, INPUT_EVENT_TYPE, MOVE_INPUT_MODE, COLOR} from "../node_modules/cm-chessboard/src/cm-chessboard/Chessboard.js"
let { networkConfig, autoFundCheck ,chaincontractConfig } = require('../helper-hardhat-config')
let additionalMessage = ""
let linkTokenAddress=networkConfig[42]['linkToken']
const networkName = networkConfig[42]['name']
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')



export default function test() {
  const [positions, setPositions] = useState([])
  const [loaded,setLoaded] = useState('not-loaded')
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [update, setUpdate] = useState('not-changed')
  const [numberOfCriticalPositionsJustAdded,setNumberOfCriticalPositionsJustAdded] = useState(0)
  const [critical_positions, setCriticalPositions] = useState([])
  const[ready_to_load, setReadyToLoad] = useState('false')
  const[finished_loading, setFinishedLoading] = useState("false")

  useEffect(() => {

    //loadNFTs()
    if (loaded != 'loaded') {
        loadNFTs()
        } else if (loaded == 'loaded' && finished_loading == 'false') {    
            loadChessBoards()
        } else if (loaded == 'loaded' && finished_loading == 'true') {
            //
            var do_nothing = 'true'
            //console.log('final state')
        }
  })



    async function loadChessBoards() {

        for (let i = 0; i < nfts.length; i++) {
            let orientation2 = null;
            if (nfts[i].fen.split(' ')[1] == 'w') {
              orientation2 = COLOR.white;
            } else {
              orientation2 = COLOR.black;
            }    
            const board = new Chessboard(document.getElementById(i), {
                position: nfts[i].fen,
                orientation: orientation2,
                sprite: {url: './chessboard-sprite-staunty.svg',
              grid:40}
              });
        }
        //This should only be called once!!
        setLoaded('not-loaded')
        setFinishedLoading('true')
    }

    async function buyNft(nft) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        
        const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
          value: price
        })
        
        await transaction.wait()
        loadNFTs()
      }

  async function loadNFTs() {    


      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
        
      const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
      const data = await marketContract.fetchMyNFTs()

      
      const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          white_player: meta.data.wp,
          black_player: meta.data.bp,
          fen : meta.data.fen,
          orig_minter : meta.data.o_minter,
          white_elo : meta.data.w_elo,
          black_elo : meta.data.b_elo
        }
        return item
      }))

      setNfts(items)
      setLoaded('loaded')
      //setFinishedLoading('false')
    } 

  function load_actual_chess_positions() {
    //let pos = "r3r1k1/ppnqbppb/3p1n1p/2pP4/2P1PBP1/2NN3P/PPQ3B1/R4RK1 w - - 7 17"
    //let pos2 = "r3r3/ppnqbppk/3p1nbp/2pP4/2P1PBP1/2NN3P/PP1Q2B1/4RRK1 w - - 11 19"
    //let pos3 = "1q1r1bk1/1pn1rppp/1P1p4/3P4/3BP3/5P2/3QB1PP/R1R3K1 b - - 0 24"
    //const nasty_boards = [pos,pos2,pos]
    //console.log(critical_positions[0].fen)

    //recreating stuff

    for (let i = critical_positions.length - numberOfCriticalPositionsJustAdded; i < critical_positions.length; i++) {
        const board = new Chessboard(document.getElementById(i), {
            position: critical_positions[i].fen,
            sprite: {url: './chessboard-sprite-staunty.svg',
          grid:40}
          });
    }
    //setLoaded("not-loaded")
      //alert(board)
      //alert("got the board")
  }


    async function fakeDeploy() {
        //let response = "r3r1k1/ppnqbppb/3p1n1p/2pP4/2P1PBP1/2NN3P/PPQ3B1/R4RK1 w - - 7 17zzzr3r3/ppnqbppk/3p1nbp/2pP4/2P1PBP1/2NN3P/PP1Q2B1/4RRK1 w - - 11 19zzzcosmo74zzzedi1991"
        let response = "r3r1k1/ppnqbppb/3p1n1p/2pP4/2P1PBP1/2NN3P/PPQ3B1/R4RK1 w - - 7 17zzzr3r1k1/ppnqbppb/3p1n1p/2pP4/2P1PBP1/2NN3P/PPQ3B1/R4RK1 w - - 7 17zzzr3r3/ppnqbppk/3p1nbp/2pP4/2P1PBP1/2NN3P/PP1Q2B1/4RRK1 w - - 11 19zzzcosmo74zzzedi1991"
        //alert(response)


        let critical_pos = []
        for (let i = 0; i < 3; i++) {
            critical_pos.push({
                white_player: response.split("zzz")[3],
                black_player: response.split("zzz")[4],
                fen: response.split("zzz")[i]
            })
        }
        //alert(critical_positions[0].black_player)
        //alert(critical_positions[1].fen)
        //alert(critical_positions[2].fen)
        if (critical_positions.length == 0) {
            //alert("should be here..")
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
        //;

        //alert(critical_positions[0].fen)
      //setUser1(response.split("zzz")[3])
      //setUser2(response.split("zzz")[4])
      //setFEN1(response.split("zzz")[0])
      //setFEN2(response.split("zzz")[1])
      //setFEN3(response.split("zzz")[2])

    }

  if (!nfts.length) return (
    <div className="container">
        <div className="flex justify-center"> 
            <h1 className="py-10 px-20 text-3xl">Loading NFTs</h1>
        </div>
  </div>
  )

  return (

    
    <div className="container bg-black">
        
        <div className="flex justify-center bg-black"> 
        
        </div>

    
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden  bg-black" >
                  <div className="flex justify-center font-mono p-1.5 text-white">{nft.fen.split(" ")[1] === 'w' ? <div>{nft.black_player} ({nft.black_elo})</div> : <div>{nft.white_player} ({nft.white_elo})</div>} </div>
                  <div className="p-2">
                    <div id={i} ></div>
                  </div>
                  <div className="flex justify-center font-mono p-1.5 text-white">{nft.fen.split(" ")[1] === 'w' ? <div>{nft.white_player} ({nft.white_elo})</div> : <div>{nft.black_player} ({nft.black_elo})</div>} </div>
                  
            <div className="p-1">
                <p className="text-2xl mb-4 font-bold text-white text-center">{nft.price} MATIC</p>
                <p className="text-xs mb-4 font-bold text-white text-center">Owned by: {nft.owner.slice(0,7) + "..." + nft.owner.slice(nft.owner.length - 5, nft.owner.length)} </p>
                <p className="text-xs mb-4 font-bold text-white text-center">Original minter: {nft.orig_minter.slice(0,7) + "..." + nft.orig_minter.slice(nft.orig_minter.length - 5, nft.orig_minter.length)} </p>

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
