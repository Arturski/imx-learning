import axios from 'axios'

  let data_payload = {
    ether_key: "0xadd9db4d960813a96a8a347acb513ae9533405da".toLowerCase(),
    stark_key: "0x0706eca559e5956e7d919cb1a3d7cd6e5d88740c499ee3524cd9f28406e749f3".toLowerCase()
  }

  let dataIn = {"url": data_payload}
  let header_in = {
    "Content-Type": "application/json"
  }
let payloads = await axios('https://api.sandbox.x.immutable.com/v1/signable-registration-offchain', {
  method: 'POST',
  data: {
    ether_key: "0xadd9db4d960813a96a8a347acb513ae9533405da".toLowerCase(),
    stark_key: "0x0706eca559e5956e7d919cb1a3d7cd6e5d88740c499ee3524cd9f28406e749f3".toLowerCase()
  },
  headers: {
    "Content-Type": "application/json"
  }
})

  console.log(payloads.data)