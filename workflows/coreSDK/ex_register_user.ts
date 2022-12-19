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
const starkPrivateKey = await generateStarkPrivateKey(); // Or retrieve previously generated key
const starkSigner = await createStarkSigner(starkPrivateKey);

// create a wallet connection
const walletConnection = { ethSigner, starkSigner}

//register user offchain
console.log(client.registerOffchain(walletConnection));