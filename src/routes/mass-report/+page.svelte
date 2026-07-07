<script lang="ts">
    import { enhance } from '$app/forms';

    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<main class="flex flex-col items-center p-4">
    <div class="p-5">
        <!-- <h1 class="text-2xl">Combat Slop Mass Report</h1> -->
    </div>

    <form method='POST' use:enhance>
        <fieldset class="flex flex-col">
            <legend class="text-xl mb-3">Mass report</legend>

            <label for="channel">Channel</label>
            <input
                id="channel"
                type="text"
                placeholder="Enter channel id or url"
                required
            />
            <label for="voterId">Developer key</label>

            <input
                id="voterId"
                type="text"
                placeholder="Enter your developer key"
                required
            />
            <div class=" pb-5">
                <label
                    class="w-100 text-stone-400 has-checked:text-white flex items-start"
                    ><input class="w-4" type="checkbox" required />
                    <span class="pt-2 px-2">
                        I certify, to the best of my knowledge, that the above
                        channel is mass producing AI generated content.
                    </span>
                </label>
            </div>

            <div>
                <button class="bg-gray-200 rounded-lg p-1 px-2 text-stone-900"
                    >Submit</button
                >
            </div>
        </fieldset>
    </form>
</main>
