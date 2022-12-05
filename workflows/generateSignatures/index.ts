import { generateStarkWallet } from '@imtbl/core-sdk'
import { Wallet } from '@ethersproject/wallet';
import { BytesLike } from 'ethers';
import * as dotenv from 'dotenv'
import axios from 'axios'
import { curves, ec } from 'elliptic';
import BN from 'bn.js';
import * as encUtils from 'enc-utils';
import { hash } from 'hash.js'


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

//Set constants
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

const starkEcOrder = new BN(
  '08000000 00000010 ffffffff ffffffff b781126d cae7b232 1e66a241 adc64d2f',
  16,
);

const starkEc = new ec(
  new curves.PresetCurve({
    type: 'short',
    prime: null,
    p: '08000000 00000011 00000000 00000000 00000000 00000000 00000000 00000001',
    a: '00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001',
    b: '06f21413 efbe40de 150e596d 72f7a8c5 609ad26c 15c915c1 f4cdfcb9 9cee9e89',
    n: starkEcOrder.toString('hex'),
    hash: hash.sha256,
    gRed: false,
    g: [
      '1ef15c18599971b7beced415a40f0c7deacfd9b0d1819e03d723d8bc943cfca',
      '5668060aa49730b7be4801df46ec62de53ecd11abe43a32873000c36e8dc1f',
    ],
  }),
);

function serialize(sig: ec.Signature): string {
  return encUtils.addHexPrefix(
    encUtils.padLeft(sig.r.toString('hex'), 64) +
      encUtils.padLeft(sig.s.toString('hex'), 64),
  );
}

/*
   The function _truncateToN in lib/elliptic/ec/index.js does a shift-right of delta bits,
   if delta is positive, where
     delta = msgHash.byteLength() * 8 - starkEx.n.bitLength().
   This function does the opposite operation so that
     _truncateToN(fixMsgHashLen(msgHash)) == msgHash.
  */
function fixMsgHashLen(msg: string) {
  msg = encUtils.removeHexPrefix(msg);
  msg = new BN(msg, 'hex').toString('hex');

  if (msg.length <= 62) {
    // In this case, msg should not be transformed, as the byteLength() is at most 31,
    // so delta < 0 (see _truncateToN).
    return msg;
  }
  if (msg.length !== 63) {
    throw "Problem with message length" //new Error(Errors.StarkCurveInvalidMessageLength);
  }
  // In this case delta will be 4 so we perform a shift-left of 4 bits by adding a ZERO_BN.
  return `${msg}0`;
}

let keyPair: ec.KeyPair = starkEc.keyFromPrivate(STARK_PRIVATE_KEY, 'hex');

let result = serialize(keyPair.sign(fixMsgHashLen(payloads.data['payload_hash'])))



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
console.log("STARK L2 Signature: \t\t" + result)
console.log("ETH L1 Signature : \t\t")




