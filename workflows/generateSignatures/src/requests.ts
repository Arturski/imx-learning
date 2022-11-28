export interface Payload {
    l1Message: string
    starkPayload: string
}

export function getSigPayloads(eth_pub_key: String, stark_pub_key: String): Promise<Payload[]> {

    // For now, consider the data is stored on a static `users.json` file
    return fetch('https://api.sandbox.x.immutable.com/v1/signable-registration-offchain',
    {   
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ether_key: eth_pub_key.toLowerCase(),
            stark_key: stark_pub_key.toLowerCase(),
          })
    })
    // the JSON body is taken from the response
    .then(res => res.json())
    .then(res => {
            // The response has an `any` type, so we need to cast
            // it to the `User` type, and return it from the promise
            return res as Payload[]
    })
}

export function registerUser(eth_sig: String , eth_pub_key: String, stark_sig: String , stark_pub_key: String) {
        // For now, consider the data is stored on a static `users.json` file
    return fetch("https://api.sandbox.x.immutable.com/v1/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            eth_signature: eth_sig.toLowerCase(),
            ether_key: eth_pub_key.toLowerCase(),
            stark_key: stark_pub_key.toLowerCase(),
            stark_signature: stark_sig.toLowerCase(),
          })
      })
    // the JSON body is taken from the response
    .then(res => res.json())
}

module.exports = getSigPayloads;