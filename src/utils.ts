import { parseArgs } from 'node:util';





export function parse (args: readonly string[]) {

    const { values } = parseArgs({

        args: Array.from(args),

        allowNegative: true,

        options: {

            gap: {
                short: 'g',
                type: 'boolean',
            },

        },

    });

    return values;

}

