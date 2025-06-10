import * as ast from 'jsr:@std/assert@1';
import { dedent } from 'jsr:@std/text@^1.0.14/unstable-dedent';
import { toText } from "@std/streams";

import {

    main,
    pipe,
    OffmarkStream,

} from '../src/offmark.ts';





Deno.test('pipe on sample.ts.md', async function () {

    using file = await Deno.open('./tests/sample.ts.md', { read: true });

    const txt = await toText(pipe(file.readable));

    ast.assertStringIncludes(txt, 'number');
    ast.assertStringIncludes(txt, 'as const');
    ast.assertStringIncludes(txt, '   // ^?');

    ast.assertNotMatch(txt, /Literate/);
    ast.assertNotMatch(txt, /Programming/);
    ast.assertNotMatch(txt, /results:/);

});





Deno.test('custom options of OffmarkStream', async function () {

    const stream = ReadableStream.from([

        'hello',

        '```ts',
        'const foo: number = 1;',
        '```',

        'world',

        '    const indent: 2 = 2;',

        'wat',

        '```',
        'const bar = 3;',
        '```',

        'footer',

    ]);

    const readable = stream.pipeThrough(new OffmarkStream({

        toggle: (line, on) => on ? line.startsWith('```')
                                 : line.startsWith('```ts')
        ,

    }));

    const res = await Array.fromAsync(readable).then(arr => arr.join('\n'));

    ast.assertStrictEquals(res, dedent`
        const foo: number = 1;
        const indent: 2 = 2;
    `);

});





Deno.test('main', async function () {

    await Promise.all([

        main(ReadableStream.from([]), new WritableStream()),

        ast.assertRejects(() => main(

            new ReadableStream({
                pull () {
                    throw new Error('wrong');
                },
            }),

            new WritableStream(),

        )),

    ]);

});

