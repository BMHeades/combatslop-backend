<script lang="ts">
    import './layout.css';

    import type { LayoutProps } from './$types';

    let { data, children }: LayoutProps = $props();
</script>

{@render children()}