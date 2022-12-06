<script lang="ts">

  import { Link, ProviderPreference, ImmutableMethodResults } from '@imtbl/imx-sdk';
	const LINK_URI: string = 'https://link.sandbox.x.immutable.com'

  //const [wallet, setWallet] = useState('undefined');
  //const [balance, setBalance] = useState<ImmutableMethodResults.ImmutableGetBalanceResult>(Object);

  //Create a new Link object
  const link = new Link(LINK_URI)
  
  async function linkSetup(): Promise<void> {
    const res = await link.setup({providerPreference: ProviderPreference.METAMASK})
    console.log(res.starkPublicKey)
    //setWallet(res.address)
  };


</script>

<main>
<div>
  <h1>Vite + Svelte</h1>
    <button on:click={linkSetup}>Setup</button>
</div>
  <div class="card">
    Helloewfrwerewrwerewrw
  </div>

  <p>
    Check out werwerwerwerr<a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
  .read-the-docs {
    color: #888;
  }
</style>