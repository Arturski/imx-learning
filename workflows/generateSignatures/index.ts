import { generateStarkWallet } from '@imtbl/core-sdk'
import { Wallet } from '@ethersproject/wallet';
import { BytesLike } from 'ethers';
import * as dotenv from 'dotenv'
import axios from 'axios'

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
//Setup eth wallet
const WALLET = new Wallet(ETH_PRIVATE_KEY as BytesLike)
//Setup stark wallet
const STARK_WALLET = await generateStarkWallet(WALLET)

//Extract stark private and public keys
const STARK_PRIVATE_KEY = STARK_WALLET.starkKeyPair.getPrivate("hex")
const STARK_PUBLIC_KEY = STARK_WALLET.starkPublicKey

let payloads = await axios('https://api.sandbox.x.immutable.com/v1/signable-registration-offchain', {
  method: 'POST',
  data: {
    ether_key: ETH_ADDRESS.toLowerCase(),
    stark_key: STARK_PUBLIC_KEY.toLowerCase()
  },
  headers: {
    "Content-Type": "application/json"
  }
})

console.log("\n------------------------- INPUT VALUES ----------------------------\n")
console.log("ETH Public Key (Address): \t" + ETH_ADDRESS)
console.log("ETH Private Key: \t\t" + ETH_PRIVATE_KEY)
console.log("ETH Network: \t\t\t" + ETH_NETWORK)
console.log("Alchemy API Key: \t\t" + ALCHEMY_API_KEY + "\n")
console.log("------------------------- STARK WALLET ----------------------------\n")
console.log("Stark Public Key: \t\t" + STARK_PUBLIC_KEY)
console.log("Stark Private Key: \t\t" + STARK_PRIVATE_KEY + "\n")
console.log("------------------------- TO BE SIGNED ----------------------------\n")
console.log("Stark L2 Payload Hash: \t\t" + payloads.data['payload_hash'])
console.log("ETH L1 Message: \t\t" + payloads.data['signable_message'] + "\n")
console.log("------------------------- SIGNATURES ------------------------------\n")
console.log("STARK L2 Signature: \t\t")
console.log("ETH L1 Signature : \t\t")








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

// const ALCHEMY_PROVIDER = new AlchemyProvider(ETH_NETWORK, ALCHEMY_API_KEY);

// const L1_SIGNER = WALLET.connect(ALCHEMY_PROVIDER);

// const L2_SIGNER = new StandardStarkSigner(STARK_PRIVATE_KEY);

// const STARK_PUB_KEY = L2_SIGNER.getAddress();

// const ETH_MESSAGE = ""
// const STARK_PAYLOAD = ""

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
