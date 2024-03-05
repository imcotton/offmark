export { OffmarkStream } from './src/offmark.ts';





if (import.meta.main) {

    const { main } = await import('./src/offmark.ts');

    await main(Deno.stdin.readable, Deno.stdout.writable);

}

