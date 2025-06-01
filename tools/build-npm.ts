#!/usr/bin/env -S deno run --allow-run -E -R -W=./

import { build, stop } from 'npm:esbuild@0.25.5';

import * as fs from 'jsr:@std/fs@1';

import { denoPlugins } from 'jsr:@luca/esbuild-deno-loader@0.11.1';

import pkg from '../deno.json' with { type: 'json' };





async function main () {

    await fs.ensureDir('./dist');

    await build({

        entryPoints: [
            './src/index.ts',
        ],
        outdir: './dist',
        bundle: true,
        format: 'esm',
        platform: 'node',
        target: [ 'node18', 'es2022' ],
        plugins: [ ...denoPlugins() ],

    }).then(stop);

    await Promise.all([

        Deno.readTextFile('./dist/index.js')

            // const is fine
            .then(replace_all(/^var /gm, 'const '))

            // class is fine, too
            .then(replace_all(/^const (.*) = class/gm, 'class $1'))

            .then(write_text_file('./dist/index.js'))

        ,

        Deno.readTextFile('./src/bin.ts')

            // budget --rewriteRelativeImportExtensions
            .then(replace_all(`.ts';`, `.js';`))

            .then(write_text_file('./dist/bin.js'))

        ,

        Deno.readTextFile('./tmp-package.json')

            .then(replace_one('0.0.0-VERSION', pkg.version))

            .then(write_text_file('./package.json'))

        ,

    ]);

}





const write_text_file: (path: string) => (source: string) => Promise<void>
= path => source => Deno.writeTextFile(path, source);

const replace_one: (old: string | RegExp, next: string) => (origin: string) => string
= (older, newer) => origin => origin.replace(older, newer);

const replace_all: typeof replace_one
= (older, newer) => origin => origin.replaceAll(older, newer);





if (import.meta.main) {

    main();

}

