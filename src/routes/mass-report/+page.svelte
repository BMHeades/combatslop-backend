<script lang="ts">
    import { enhance } from "$app/forms";
    import icon from "$lib/assets/icon.png"
    import type { PageProps } from "./$types";

    // let success = $state(false)

    let { form, data }: PageProps = $props();
</script>

<main class="flex flex-col items-center p-4">
    <div class="p-5">
        <img src={icon} alt="Black Cat Combat Slop Logo">
    </div>


    {#if !form?.success}
        <form method="POST" use:enhance>
            <fieldset class="flex flex-col">
                <legend class="text-xl mb-3">Mass report</legend>

                <label for="channel">Youtube Channel</label>
                <input
                    id="channel"
                    type="text"
                    placeholder="Enter channel id or url"
                    name="channel"
                    required
                />
                <label for="voterId">Developer key</label>

                <input
                    id="voterId"
                    type="text"
                    placeholder="Enter your developer key"
                    name="devKey"
                    required
                />
                <div class=" pb-5">
                    <label
                        class="w-100 text-stone-400 has-checked:text-white flex items-start"
                        ><input
                            class="w-4"
                            type="checkbox"
                            required
                            name="certify"
                        />
                        <span class="pt-2 px-2">
                            I certify, to the best of my knowledge, that the
                            above channel is mass producing AI generated
                            content.
                        </span>
                    </label>
                </div>

                {#if form?.error}
                    <p class="text-red-500">{form.error}</p>
                {/if}
                <div>
                    <button
                        class="bg-gray-200 rounded-lg p-1 px-2 text-stone-900"
                        >Submit</button
                    >
                </div>
            </fieldset>
        </form>
    {:else}
        <div class="p-2 pb-10">
            <h1 class="text-2xl text-stone-100">Reported successfully</h1>
        </div>
        <div>
            <h2 class="text-xl pb-3 text-stone-200">What happens next?</h2>
            <p class="w-100 text-stone-300">
                The submmission will be manually reviewed by our team. If the
                channel is found guilty of uploading slop content, all videos on
                the channel (including future uploads) will be labelled as slop.
                Thank you for contributing to Combat Slop.
            </p>
        </div>
    {/if}
</main>
