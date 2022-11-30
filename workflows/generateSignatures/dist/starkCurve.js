"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStarkPrivateKey = exports.grindKey = exports.starkEc = exports.starkEcOrder = void 0;
const hash_js_1 = __importDefault(require("hash.js"));
const elliptic_1 = require("elliptic");
const encUtils = __importStar(require("enc-utils"));
const bn_js_1 = __importDefault(require("bn.js"));
/*
Stark-friendly elliptic curve

The Stark-friendly elliptic curve used is defined as follows:

`y² ≡ x³ + α ⋅ x + β(modp)`

where:

```
α = 1
β = 3141592653589793238462643383279502884197169399375105820974944592307816406665
p = 3618502788666131213697322783095070105623107215331596699973092056135872020481
 = 2²⁵¹ + 17 ⋅ 2¹⁹² + 1
```

The Generator point used in the ECDSA scheme is:
```
G = (874739451078007766457464989774322083649278607533249481151382481072868806602,
  152666792071518830868575557812948353041420400780739481342941381225525861407)
```
https://docs.starkware.co/starkex-v4/crypto/stark-curve
*/
exports.starkEcOrder = new bn_js_1.default('08000000 00000010 ffffffff ffffffff b781126d cae7b232 1e66a241 adc64d2f', 16);
exports.starkEc = new elliptic_1.ec(new elliptic_1.curves.PresetCurve({
    type: 'short',
    prime: null,
    p: '08000000 00000011 00000000 00000000 00000000 00000000 00000000 00000001',
    a: '00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001',
    b: '06f21413 efbe40de 150e596d 72f7a8c5 609ad26c 15c915c1 f4cdfcb9 9cee9e89',
    n: exports.starkEcOrder.toString('hex'),
    hash: hash_js_1.default.sha256,
    gRed: false,
    g: [
        '1ef15c18599971b7beced415a40f0c7deacfd9b0d1819e03d723d8bc943cfca',
        '5668060aa49730b7be4801df46ec62de53ecd11abe43a32873000c36e8dc1f',
    ],
}));
// Create a hash from a key + an index
function hashKeyWithIndex(key, index) {
    return new bn_js_1.default(hash_js_1.default
        .sha256()
        .update(encUtils.hexToBuffer(encUtils.removeHexPrefix(key) +
        encUtils.sanitizeBytes(encUtils.numberToHex(index), 2)))
        .digest('hex'), 16);
}
/*
 This function receives a key seed and produces an appropriate StarkEx key from a uniform
 distribution.
 Although it is possible to define a StarkEx key as a residue between the StarkEx EC order and a
 random 256bit digest value, the result would be a biased key. In order to prevent this bias, we
 deterministically search (by applying more hashes, AKA grinding) for a value lower than the largest
 256bit multiple of StarkEx EC order.

 https://github.com/starkware-libs/starkware-crypto-utils/blob/dev/src/js/key_derivation.js#L119
*/
function grindKey(keySeed, keyValLimit) {
    const sha256EcMaxDigest = new bn_js_1.default('1 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000', 16);
    const maxAllowedVal = sha256EcMaxDigest.sub(sha256EcMaxDigest.mod(keyValLimit));
    let key = hashKeyWithIndex(keySeed.toString('hex'), 0);
    // Make sure the produced key is devided by the Stark EC order, and falls within the range
    // [0, maxAllowedVal).
    for (let i = 1; key.gte(maxAllowedVal); i++) {
        key = hashKeyWithIndex(key.toString('hex'), i);
    }
    return key.umod(keyValLimit).toString('hex');
}
exports.grindKey = grindKey;
/**
 * Generates a new Stark private key
 * @returns the private key as a hex string
 */
function generateStarkPrivateKey() {
    const keyPair = exports.starkEc.genKeyPair();
    return grindKey(keyPair.getPrivate(), exports.starkEcOrder);
}
exports.generateStarkPrivateKey = generateStarkPrivateKey;
//# sourceMappingURL=starkCurve.js.map