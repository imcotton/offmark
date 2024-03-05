import * as ast from 'jsr:@std/assert';
import { toText } from 'jsr:@std/streams';

import {

    main,
    pipe,

} from '../src/offmark.ts';





Deno.test('pipe on sample.ts.md', async function () {

    using file = await Deno.open('./tests/sample.ts.md', { read: true });

    const txt = await toText(pipe(file.readable));

    ast.assertStringIncludes(txt, 'number');
    ast.assertStringIncludes(txt, 'as const');

    ast.assertNotMatch(txt, /Literate/);
    ast.assertNotMatch(txt, /Programming/);
    ast.assertNotMatch(txt, /results:/);

});





Deno.test('main', async function () {

    await Promise.all([

        main(ReadableStream.from([]), new WritableStream()),

        ast.assertRejects(async function () {

            await main(

                new ReadableStream({
                    pull () {
                        throw new Error('wrong');
                    }
                }),

                new WritableStream(),

            );

        }),

    ]);

});

