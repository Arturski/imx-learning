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

const mint_request = 
{
    "contract_address": "0xB37bb21ce7b170f540c07D1d1265B4A2f02908A7".toLowerCase(),
    // Specifying contract-wide royalty information
    "royalties": [
        {
        // Specifying the contract-wide royalty recipient's wallet address
        "recipient": "0x7D9148F5ba0520Eb4e8A3073938Cf383Fc9bF390".toLowerCase(),
        // Specifying the contract-wide royalty rate for this collection
        "percentage": 2.5
        }
    ],
    "users": [
        {
        "user": "0x7D9148F5ba0520Eb4e8A3073938Cf383Fc9bF390".toLowerCase(),
        "tokens": [
            {
            // Specific NFT token
            "id": "201",
            "blueprint": "coresdk-mint",
            // Overriding the contract-wide royalty information with token-specific royalty information
            "royalties": [
                {
                // Same recipient's wallet address
                "recipient": "0x7D9148F5ba0520Eb4e8A3073938Cf383Fc9bF390".toLowerCase(),
                // Changed royalty rate for this specific token (i.e. 1% instead of the default 2.5%)                        
                "percentage": 1
                }
            ]
            }
        ]
    }]
}


async function mint() {
    const mintResponse = await client.mint(ethSigner, mint_request);    
    console.log(mintResponse)
}

mint();
