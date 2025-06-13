export * from './index.ts';





if (import.meta.main) {

    const { main } = await import('./index.ts');
    const { parse } = await import('./utils.ts');

    main(
        Deno.stdin.readable,
        Deno.stdout.writable,
        parse(Deno.args),
    );

}

