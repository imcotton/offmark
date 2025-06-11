export class LineJoinStream extends TransformStream<string, string> {

    constructor (

            by: string,
            join = gen(by),

    ) {

        super({

            transform (data, ctrl) {

                const { value } = join.next();

                if (value == null) {

                    ctrl.enqueue(data);

                } else {

                    ctrl.enqueue(value.concat(data));

                }

            },

        });

    }

}





export function * gen <T> (tail: T, head?: T) {

    yield head;

    while (true) {
        yield tail;
    }

}

