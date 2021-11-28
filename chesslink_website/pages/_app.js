import '../styles/globals.css'
import Link from 'next/link'
//import '.../styles/CouponStyling.css'
function Marketplace({ Component, pageProps }) {
  return (
    <div className="bg-black text-white">
      <nav className="border-b p-3">
        <div className="flex mt-4">
        <p className="text-4xl font-bold">ChessLink</p>
          <div className="flex">
            
          <Link href="/streamer_dashboard">
            <a className="mr-4 p-3 pl-10 text-white-500 font-black">
              Streamer Dashboard
            </a>
          </Link>
          <Link href="/NFT_Marketplace">
            <a className="mr-4 p-3 pl-10 text-white-500 font-black">
              NFT Marketplace
            </a>
          </Link>
          <Link href="/my_chess">
            <a className="mr-4 p-3 pl-10 text-white-500 font-black">
              My Chess NFTs
            </a>
          </Link>
            </div>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default Marketplace