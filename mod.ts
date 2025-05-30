export * from './index.ts';





// @ts-ignore make tsc happy
if (import.meta.main) {

    const { main } = await import('./offmark.ts');

    await main(Deno.stdin.readable, Deno.stdout.writable);

}

