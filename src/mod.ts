export * from './index.ts';





if (import.meta.main) {

    const { main } = await import('./index.ts');

    await main(Deno.stdin.readable, Deno.stdout.writable);

}

