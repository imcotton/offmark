import * as ast from 'jsr:@std/assert@1';
import { toText } from '@std/streams';

import {

    gen,
    LineJoinStream,

} from '../src/line-join.ts';





const lines: ReadonlyArray<string> = [

    'hello',
    'world',
    'foo',
    'bar',

];





Deno.test('LineJoinStream gen', async function () {

    const head = '[';
    const by = '-';

    const stream = ReadableStream.from(lines);

    const readable = stream.pipeThrough(new LineJoinStream(by, gen(by, head)));

    const result = await toText(readable);

    ast.assertStrictEquals(result, head.concat(lines.join(by)));

});





Deno.test('LineJoinStream by', async function () {

    const each = [

        '',
        ',',
        '/',
        '\n',

    ];

    for (const by of each) {

        const stream = ReadableStream.from(lines);
        const readable = stream.pipeThrough(new LineJoinStream(by));
        const result = await toText(readable);

        ast.assertStrictEquals(result, lines.join(by));

    }

});

