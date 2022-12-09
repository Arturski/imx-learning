import { ethers } from 'ethers';
import './App.css';
import { Link, ImmutableXClient, ImmutableMethodResults, ProviderPreference, ETHTokenType, ERC721TokenType} from '@imtbl/imx-sdk';
import { useEffect, useState } from 'react';
import Marketplace from './Marketplace';
import Inventory from './Inventory';
import Bridging from './Bridging';

const App = () => {

  type IframePositionKeys = 'left' | 'right' | 'top' | 'bottom';

  type IframePositionOptions = {
    [key in IframePositionKeys]?: string;
  };
  type ConfigurableIframeOptions = null | {
    className?: string;
    containerElement?: HTMLElement;
    protectAgainstGlobalStyleBleed?: boolean;
    position?: IframePositionOptions;
  };

  const frame_position: IframePositionKeys = 'left'

  const linkIframeOptions: ConfigurableIframeOptions = { className: 'my-link-iframe'};

  const LINK_URI: string = 'https://link.sandbox.x.immutable.com'
  //const LINK_URI: string = 'https://link.x.immutable.com'

  const CLIENT_URI: string = 'https://api.sandbox.x.immutable.com/v1'
  //const CLIENT_URI: string = 'https://api.x.immutable.com/v1'


  // initialise Immutable X Link SDK
  // const link = new Link(LINK_URI)
  
  // initialise Link in iframe
  const link = new Link(LINK_URI, linkIframeOptions)
  
  // general
  const [tab, setTab] = useState('inventory');
  const [wallet, setWallet] = useState('undefined');
  const [balance, setBalance] = useState<ImmutableMethodResults.ImmutableGetBalanceResult>(Object);
  const [client, setClient] = useState<ImmutableXClient>(Object);


  useEffect(() => {
    buildIMX()
  }, [])

  // initialise an Immutable X Client to interact with apis more easily
  async function buildIMX() {
    const publicApiUrl: string = CLIENT_URI ?? '';
    setClient(await ImmutableXClient.build({publicApiUrl}))
  }

  // register and/or setup a user
  async function linkSetup(): Promise<void> {
    const res = await link.setup({providerPreference: ProviderPreference.METAMASK})
    console.log(res.starkPublicKey)
    setWallet(res.address)
    setBalance(await client.getBalance({user: res.address, tokenAddress: 'eth'}))
  };
  async function clientTransfer() {
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`);
        //Please note: you should never share your private key and so ensure this is only done on a server that is not accessible from the internet
    const senderPrivateKey: string = process.env.REACT_APP_MINTER_PK ?? ''; // registered minter for your contract
    const signer = new ethers.Wallet(senderPrivateKey).connect(provider);

    const publicApiUrl: string = process.env.REACT_APP_SANDBOX_ENV_URL ?? '';
    const starkContractAddress: string = process.env.REACT_APP_SANDBOX_STARK_CONTRACT_ADDRESS ?? '';
    const registrationContractAddress: string = process.env.REACT_APP_SANDBOX_REGISTRATION_ADDRESS ?? '';

    const transferClient = await ImmutableXClient.build({
      publicApiUrl,
      signer: signer,
      starkContractAddress,
      registrationContractAddress
  })
    const responseClient = await transferClient.transfer({
      sender: wallet, 
      token: {
        type: ETHTokenType.ETH, 
        data: {
          decimals: 18
        }},
      quantity: ethers.utils.parseEther("0.02"),
      receiver: "0xb512D1426219D0CBceAB18Efd2C29465f4B6C0BB".toLowerCase()
      })
      console.log(responseClient)
  };
  async function linkMakeOffer() {
    try{
      // Call the method
      let result = await link.makeOffer(
      {  
        tokenId: '154',
        tokenAddress: '0xb37bb21ce7b170f540c07d1d1265b4a2f02908a7',
        amount: '0.04'
      }
      )
      // Print the result
      console.log(result)
    }catch(error){
      // Catch and print out the error
      console.error(error)
    }
  }
  async function linkAcceptOffer() {
    try{
      // Call the method
      let result = await link.acceptOffer(      
        {
          orderId: '13794'
      })
      // Print the result
      console.log(result)
    }catch(error){
      // Catch and print out the error
      console.error(error)
    }
  }
  async function linkCancelOffer() {
    try{
      // Call the method
      let result = await link.cancelOffer(
        {
            orderId: '13806'
        }
      )
      // Print the result
      console.log(result)
    }catch(error){
      // Catch and print out the error
      console.error(error)
    }
  }
  async function batchNFTTransfer() {
    try{
      // Call the method
      let result = await link.batchNftTransfer([
        {
            "type": ERC721TokenType.ERC721,
            "tokenId": "3",
            "tokenAddress": "0x0a31953C6dE42405e0335f8b0a48FAb4D1679442".toLowerCase(),
            "toAddress": "0xb512D1426219D0CBceAB18Efd2C29465f4B6C0BB".toLowerCase()
        },
        {
          "type": ERC721TokenType.ERC721,
          "tokenId": "2",
          "tokenAddress": "0x0a31953C6dE42405e0335f8b0a48FAb4D1679442".toLowerCase(),
          "toAddress": "0x1eD81E094cC225efD6ad4c2e9955e282aD02D2Cf".toLowerCase()
        },
        {
          "type": ERC721TokenType.ERC721,
          "tokenId": "1",
          "tokenAddress": "0x0a31953C6dE42405e0335f8b0a48FAb4D1679442".toLowerCase(),
          "toAddress": "0x1eD81E094cC225efD6ad4c2e9955e282aD02D2Cf".toLowerCase()
        }
      ])
      // Print the result
      console.log(result)
    }catch(error){
      // Catch and print out the error
      console.error(error)
    }
  }
  function handleTabs() {
    if (client.address) {
      switch (tab) {
        case 'inventory':
          if (wallet === 'undefined') return <div>Connect wallet</div>
          return <Inventory
            client={client}
            link={link}
            wallet={wallet}
          />
        case 'bridging':
          if (wallet === 'undefined') return <div>Connect wallet</div>
          return <Bridging
            client={client}
            link={link}
            wallet={wallet}
          />
        default:
          return <Marketplace
            client={client}
            link={link}
          />
      }
    }
    return null
  }

  return (
    <div className="App">
      <button onClick={linkSetup}>Setup Wallet</button>
      <div>
        Active wallet: {wallet}
      </div>
      <div>
        ETH balance (in wei): {balance?.balance?.toString()}
      </div>
      <br/>
      <button onClick={() => setTab('marketplace')}>Marketplace</button>
      <button onClick={() => setTab('inventory')}>Inventory</button>
      <button onClick={() => setTab('bridging')}>Deposit and Withdrawal</button>

      {/* <button onClick={() => linkMakeOffer()}>Make Offer</button>
      <button onClick={() => linkAcceptOffer()}>Accept Offer</button>
      <button onClick={() => linkCancelOffer()}>cancel Offer</button>
      <button onClick={() => linkTransfer()}>Transfer Link</button>
      <button onClick={() => clientTransfer()}>Transfer Client</button>
      <button onClick={() => batchNFTTransfer()}>BatchNFTTransfer</button> */}
      <br/>
      {handleTabs()
      }
    </div>
  );
}

export default App;
