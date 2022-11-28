import dotenv from 'dotenv'
import { generateStarkWallet } from '@imtbl/core-sdk'
import { Wallet } from '@ethersproject/wallet';

dotenv.config()

function getEnv(name: string, defaultValue = undefined) {
  const value = process.env[name];

  if (value !== undefined) {
    return value;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`Environment variable '${name}' not set`);
}

function requireEnvironmentVariable(key: string): string {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Please ensure a value exists for ${key}`);
  }
  return value;
}

const ETH_PRIVATE_KEY: string = requireEnvironmentVariable('ETH_PRIVATE_KEY') as string;
const ETH_ADDRESS: string = requireEnvironmentVariable('ETH_ADDRESS') as string;
const ETH_NETWORK: string = requireEnvironmentVariable('ETH_NETWORK') as string;
const ALCHEMY_API_KEY: string = requireEnvironmentVariable('ALCHEMY_API_KEY') as string;

console.log("Public Key (Address): \t\t" + ETH_ADDRESS)
console.log("Eth Private Key: \t\t" + ETH_PRIVATE_KEY)
console.log("Eth Network: \t\t\t" + ETH_NETWORK)
console.log("Alchemy API Key: \t\t" + ALCHEMY_API_KEY)

async function getStark(): Promise<void> {
    const wallet = new Wallet(ETH_PRIVATE_KEY);
    console.log(wallet)
    const starkWallet = await generateStarkWallet(wallet);
    console.log('wallet address:', wallet.address)
    console.log('stark private key:', starkWallet.starkKeyPair.getPrivate("hex"))
}

getStark()

// import { BytesLike } from '@ethersproject/bytes'
// import { Networkish } from '@ethersproject/providers';
// import { generateStarkWallet } from '@imtbl/core-sdk'
// import { Wallet } from '@ethersproject/wallet';
// import { getSigPayloads, registerUser } from './src/requests';
// import { requireEnvironmentVariable } from './src/utils';
// import { StandardStarkSigner } from './src/starksigner';
// import { Signer } from '@ethersproject/abstract-signer';
// import BN from 'bn.js';
// import * as encUtils from 'enc-utils';
// import { AlchemyProvider } from '@ethersproject/providers';
// import { ec } from 'elliptic';

// interface StarkWallet {
//     path: string;
//     starkPublicKey: string;
//     starkKeyPair: ec.KeyPair;
// }

// type IMXETHSignature = {
//     signature: string;
// };

// type registerUserType = {
//     eth_signature: String,
//     ether_key: String,
//     stark_key: String,
//     stark_signature: String
// }
// type SignatureOptions = {
//     r: BN;
//     s: BN;
//     recoveryParam: number | null | undefined;
// };


// const ETH_PRIVATE_KEY: String = requireEnvironmentVariable('ETH_PRIVATE_KEY') as String;
// const ETH_ADDRESS: String = requireEnvironmentVariable('ETH_ADDRESS') as String;
// const ETH_NETWORK: Networkish = requireEnvironmentVariable('ETH_NETWORK') as Networkish;
// const ALCHEMY_API_KEY: String = requireEnvironmentVariable('ALCHEMY_API_KEY') as String;

// //Setup eth wallet
// const WALLET = new Wallet(ETH_PRIVATE_KEY as BytesLike)
// //Setup stark wallet
// const STARK_WALLET = await generateStarkWallet(WALLET)

// //Store address for later
// const WALLET_ADDRESS = WALLET.publicKey
// //const test = await STARK_WALLET
// //Extract stark private key
// const STARK_PRIVATE_KEY = await STARK_WALLET.starkKeyPair.getPrivate("hex")

// const ALCHEMY_PROVIDER = new AlchemyProvider(ETH_NETWORK, ALCHEMY_API_KEY);

// const L1_SIGNER = WALLET.connect(ALCHEMY_PROVIDER);

// const L2_SIGNER = new StandardStarkSigner(STARK_PRIVATE_KEY);

// const STARK_PUB_KEY = L2_SIGNER.getAddress();

// const ETH_MESSAGE = ""
// const STARK_PAYLOAD = ""

// // await function getStarkPrivateKey(privateKey) {
// //     const wallet = new Wallet(privateKey);
// //     const starkWallet = await generateStarkWallet(wallet);
// //     console.log('wallet address:', wallet.address)
// //     console.log('stark private key:', starkWallet.starkKeyPair.getPrivate("hex"))
// // }


// let payloads = getSigPayloads(ETH_ADDRESS, STARK_PUB_KEY);
// console.log("Stark Wallet: " + STARK_WALLET)
// console.log("Stark Public Key: " + STARK_PUB_KEY)
// console.log("Eth Public Key: " + ETH_ADDRESS)
// console.log(payloads)

// //---------------Step1 get stark private key
// //---------------Step2 get stark public key and signature
// //---------------Step3 Get signable payloads from API in ./src/requests
// //---------------Step4 generate signature string for L1


//     // const msg: string = process.env.IMX_ETH_PAYLOAD as string;

    
//     // const l1Wallet = new Wallet(privateKey);
//     // const l1Signer = l1Wallet.connect(alchemyProvider);

//     // type SignatureOptions = {
//     //     r: BN;
//     //     s: BN;
//     //     recoveryParam: number | null | undefined;
//     // };

//     // function importRecoveryParam(v: string): number | undefined {
//     //     return v.trim()
//     //     ? new BN(v, 16).cmp(new BN(27)) !== -1
//     //         ? new BN(v, 16).sub(new BN(27)).toNumber()
//     //         : new BN(v, 16).toNumber()
//     //     : undefined;
//     // }

//     // function serializeEthSignature(sig: SignatureOptions): string {
//     // // This is because golang appends a recovery param
//     // // https://github.com/ethers-io/ethers.js/issues/823
//     // return encUtils.addHexPrefix(
//     //     encUtils.padLeft(sig.r.toString(16), 64) +
//     //     encUtils.padLeft(sig.s.toString(16), 64) +
//     //     encUtils.padLeft(sig.recoveryParam?.toString(16) || '', 2),
//     // );
//     // }

//     // // used chained with serializeEthSignature. serializeEthSignature(deserializeSignature(...))
//     // function deserializeSignature(sig: string, size = 64): SignatureOptions {
//     //     sig = encUtils.removeHexPrefix(sig);
//     //     return {
//     //     r: new BN(sig.substring(0, size), 'hex'),
//     //     s: new BN(sig.substring(size, size * 2), 'hex'),
//     //     recoveryParam: importRecoveryParam(sig.substring(size * 2, size * 2 + 2)),
//     //     };
//     // }

//     // async function signRaw(
//     //     payload: string,
//     //     signer: Signer
//     // ): Promise<string> {
//     //     const signature = deserializeSignature(await signer.signMessage(payload));
//     //     return serializeEthSignature(signature);
//     // }

//     // async function generateIMXETHSignature(ethSigner: Signer): 
//     // Promise<IMXETHSignature> {
//     //     const signature = await signRaw(msg, ethSigner);
//     //     console.log("Message: " + msg);
//     //     console.log("Signature: " + signature);
//     //     return {
//     //         signature
//     //     };
//     // }

//     // async function main()  {
//     //     await generateIMXETHSignature(l1Signer);
//     // }

//     //---------------Step5 register user
//     //console.log(registerUser(ETH_SIGNATURE, ETH_ADDRESS, STARK_PUB_KEY, STARK_SIGNATURE))
