import { main } from './src/offmark.ts';

export { OffmarkStream } from './src/offmark.ts';





if (import.meta.main) {

    await main(Deno.stdin.readable, Deno.stdout.writable);

}

