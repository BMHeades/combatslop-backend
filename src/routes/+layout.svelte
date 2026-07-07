<script lang="ts">
    import './layout.css';

    import favicon from '$lib/assets/icon.png'
    import type { LayoutProps } from './$types';

    let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>
		Combat Slop
	</title>
<link rel="icon" href={favicon} /></svelte:head>

{@render children()}