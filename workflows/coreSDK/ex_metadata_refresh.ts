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

// Fetch token ids for refresh
const listAssetsResponse  = await client.listAssets({
    collection: collectionAddress
});

console.log(listAssetsResponse)

const tokenIds: string[] = listAssetsResponse.result.map((asset) => asset.token_id);

console.log(tokenIds)

const createRefreshRequestParams = {
    collection_address: collectionAddress,
    token_ids: tokenIds // Token ids for metadata refresh, limit to 1000 per request
  };

const createMetadataRefreshResponse = await client.createMetadataRefresh(ethSigner, createRefreshRequestParams);

console.log(createMetadataRefreshResponse)

// Below are status fetches. Commented out as you dont need them all to run inline

// const getMetadataRefreshErrors = await client.getMetadataRefreshErrors(ethSigner, createMetadataRefreshResponse.refresh_id);

// console.log(getMetadataRefreshErrors)

// const listMetadataRefreshesRespose = await client.listMetadataRefreshes(ethSigner, collectionAddress);

// console.log(listMetadataRefreshesRespose)
