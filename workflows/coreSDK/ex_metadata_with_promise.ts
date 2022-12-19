import { ImmutableX, Config, generateStarkPrivateKey, createStarkSigner } from '@imtbl/core-sdk';
import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';

//Options here: https://github.com/immutable/imx-core-sdk/blob/1.0.0/src/config/config.ts#L43
//init config settings
const config = Config.SANDBOX;
//init client object and pass in config settings
const client = new ImmutableX(config);

// Create Ethereum signer
const ethNetwork = 'goerli'; // Or 'mainnet'
const provider = new AlchemyProvider(ethNetwork, "WmzAboIrYGOEDnuUJnxQ8ucuu3jfoR_q");
const ethSigner = new Wallet("fa0a8540011f981bb46daa3871bcd849d5507e73ac855d24785d563e69de41f0").connect(provider);

// Create Stark signer
const starkPrivateKey = generateStarkPrivateKey(); // Or retrieve previously generated key
const starkSigner = createStarkSigner(starkPrivateKey);

// create a wallet connection
const walletConnection = { ethSigner, starkSigner}

const collectionAddress = '0x0a31953c6de42405e0335f8b0a48fab4d1679442'.toLowerCase();


// Async function for refresh
async function refreshMetadata() {

  const refreshMetadataResponse = await client.createMetadataRefresh(ethSigner,
      {
          collection_address: collectionAddress,
          token_ids:["1","2","3"]
      }
  );

  console.log(refreshMetadataResponse)

}

// Async function wrapper
async function main()  {
  await refreshMetadata();
}   

//RUn main wrapper
main()
.then(() => console.log('refreshMetadata call complete')) //Then waits for async response in a separate context and then executes
.catch(err => { //error handling
console.error(err);
process.exit(1);
});