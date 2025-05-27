export { OffmarkStream, pipe } from './offmark.ts';





bin: if (import.meta.main) {

    const { main } = await import('./offmark.ts');

    if (globalThis.Deno?.version?.deno) {

        main(Deno.stdin.readable, Deno.stdout.writable);
        break bin;

    }

    const {    stdin,   stdout } = await import('node:process');
    const { Readable, Writable } = await import('node:stream');

    main(
        // @ts-ignore YOLO
        Readable.toWeb(stdin),
        Writable.toWeb(stdout),
    );

}

