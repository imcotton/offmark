import * as ast from 'jsr:@std/assert';
import { toText } from 'jsr:@std/streams';

import { main } from '../src/offmark.ts';





Deno.test('main on sample.ts.md', async function () {

    using file = await Deno.open('./tests/sample.ts.md', { read: true });

    const { readable, writable } = new TransformStream<Uint8Array>();

    main(file.readable, writable);

    const txt = await toText(readable);

    ast.assertStringIncludes(txt, 'number');
    ast.assertStringIncludes(txt, 'as const');

    ast.assertNotMatch(txt, /Literate/);
    ast.assertNotMatch(txt, /Programming/);
    ast.assertNotMatch(txt, /results:/);

});

