import { TextLineStream } from 'jsr:@std/streams@~0.221.0/text-line-stream';





const TOGGLE = '`'.repeat(3);

const INDENT_LEN = 4;
const INDENT = ' '.repeat(INDENT_LEN);





export class OffmarkStream extends TransformStream<string, string> {

    constructor ({

            toggle = (str: string) => str.startsWith(TOGGLE),

            indent = {
                check: (str: string) => str.startsWith(INDENT),
                remove: (str: string) => str.slice(INDENT_LEN),
            },

    } = {}) {

        let on = false;

        super({

            transform (data, ctrl) {

                if (toggle(data)) {
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

): ReadableStream<Uint8Array> {

    return readable
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new TextLineStream())
        .pipeThrough(new OffmarkStream())
        .pipeThrough(new TransformStream({
            transform (data, ctrl) {
                ctrl.enqueue(data.concat('\n'))
            },
        }))
        .pipeThrough(new TextEncoderStream())
    ;

}





export async function main (

        readable: ReadableStream<Uint8Array>,
        writable: WritableStream<Uint8Array>,

): Promise<void> {

    await pipe(readable).pipeTo(writable);

}

