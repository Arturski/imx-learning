import { ethers } from 'ethers';
import { Link, ImmutableXClient, ImmutableMethodResults, MintableERC721TokenType, ERC721TokenType, ETHTokenType } from '@imtbl/imx-sdk';
import { useEffect, useState } from 'react';
require('dotenv').config();

interface InventoryProps {
  client: ImmutableXClient,
  link: Link,
  wallet: string
}

const Inventory = ({client, link, wallet}: InventoryProps) => {
  const [inventory, setInventory] = useState<ImmutableMethodResults.ImmutableGetAssetsResult>(Object);
  // minting
  const [mintTokenId, setMintTokenId] = useState('');
  const [mintBlueprint, setMintBlueprint] = useState('');
  const [mintTokenIdv2, setMintTokenIdv2] = useState('');
  const [mintBlueprintv2, setMintBlueprintv2] = useState('');

  // buying and selling
  const [sellAmount, setSellAmount] = useState('');
  const [sellTokenAddress, setSellTokenAddress] = useState('');
  const [sellCancelOrder, setSellCancelOrder] = useState('');

  // transfers nft
  const [colAddress, setCollectionAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [toAddress, setToAddress] = useState('');

  useEffect(() => {
    load()
  }, [])

  async function load(): Promise<void> {
    setInventory(await client.getAssets({user: wallet, sell_orders: true}))
  };

  // helper function to generate random ids
  function random()
    : number {
    const min = 1;
    const max = 1000000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function linkTransfer() {
    try{
      // Call the method
      let result = await link.transfer([
        {
            "type": ERC721TokenType.ERC721,
            "tokenId": tokenId.toLowerCase(),
            "toAddress": toAddress.toLowerCase(),
            "tokenAddress": colAddress.toLowerCase()
        }
      ])
      // Print the result
      console.log(result)
    }catch(error){
      // Catch and print out the error
      console.error(error)
    }
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th><h3>Transfers</h3></th>
            <td>
              <p>
                Transfer NFT to Another L2 address:
                <br/>
                <label>
                  Collection Address:
                  <input type="text" value={colAddress} onChange={e => setCollectionAddress(e.target.value)} />
                </label>
                <label>
                  Token ID:
                  <input type="text" value={tokenId} onChange={e => setTokenId(e.target.value)} />
                </label>
                <label>
                  To Address:
                  <input type="text" value={toAddress} onChange={e => setToAddress(e.target.value)} />
                </label>
                <button onClick={linkTransfer}>Transfer</button>
              </p>
            </td>
            <td>
            </td>
          </tr>
        </thead>
        <tbody>
        <tr>
            <th><h3>Inventory</h3></th>
            <td>
            <table>
              <thead>
                <th>Token Address</th>
                <th>Token ID</th>
                <th>Status</th>
                <th>Image URL</th>
              </thead>
              <tbody>
              {
                inventory.result?.map((data, key) => {
                  return (
                    <tr key={key}>
                      <td>
                      {data.token_address}
                      </td>
                      <td>
                      {data.token_id}
                      </td>
                      <td>
                      {data.status}
                      </td>
                      <td>
                      {data.image_url}
                      </td>
                    </tr>
                  )
                })
              }
              </tbody>
            </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
