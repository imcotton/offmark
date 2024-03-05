import { TextLineStream } from 'jsr:@std/streams@^0.218.2/text_line_stream';





const INDENT = ' '.repeat(4);

const TOGGLE = '`'.repeat(3);





export class OffmarkStream extends TransformStream<string, string> {

    constructor ({

            indent = (str: string) => str.startsWith(INDENT),
            toggle = (str: string) => str.startsWith(TOGGLE),

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

                if (indent(data)) {
                    return ctrl.enqueue(data.trimStart());
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

