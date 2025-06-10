import { TextLineStream } from '@std/streams/text-line-stream';





const TOGGLE = '`'.repeat(3);

const INDENT_LEN = 4;
const INDENT = ' '.repeat(INDENT_LEN);

export type Opts = Partial<typeof DEFAULT>;

const DEFAULT: {

    toggle (str: string, on: boolean): boolean,

    indent: {
        check (str: string): boolean,
        remove (str: string): string,
    },

} = {

    toggle: str => str.startsWith(TOGGLE),

    indent: {
        check: str => str.startsWith(INDENT),
        remove: str => str.slice(INDENT_LEN),
    },

};





export class OffmarkStream extends TransformStream<string, string> {

    constructor (opts?: Opts) {

        const { toggle, indent } = { ...DEFAULT, ...opts };

        let on = false;

        super({

            transform (data, ctrl) {

                if (toggle(data, on)) {
                    on = !on;
                    return;
                }

                if (on) {
                    return ctrl.enqueue(data);
                }

                if (indent.check(data)) {
                    return ctrl.enqueue(indent.remove(data));
                }

            },

        });

    }

}





export function pipe (

        readable: ReadableStream<Uint8Array>,
        opts?: Opts,

): ReadableStream<Uint8Array> {

    return readable
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new TextLineStream())
        .pipeThrough(new OffmarkStream(opts))
        .pipeThrough(new TransformStream({
            transform (data, ctrl) {
                ctrl.enqueue(data.concat('\n'));
            },
        }))
        .pipeThrough(new TextEncoderStream())
    ;

}





export async function main (

        readable: ReadableStream<Uint8Array>,
        writable: WritableStream<Uint8Array>,
        opts?: Opts,

): Promise<void> {

    await pipe(readable, opts).pipeTo(writable);

}

