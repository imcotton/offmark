export { OffmarkStream, pipe } from './offmark.ts';





if (import.meta.main) {

    const { main } = await import('./offmark.ts');

    await main(Deno.stdin.readable, Deno.stdout.writable);

}

