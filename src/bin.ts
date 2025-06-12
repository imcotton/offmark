#!/usr/bin/env node

import { stdin, stdout, argv } from 'node:process';
import { Readable, Writable } from 'node:stream';

import { main } from './index.ts';
import { parse } from './utils.ts';





main(
    // @ts-ignore YOLO
    Readable.toWeb(stdin),
    Writable.toWeb(stdout),
    parse(argv.slice(2)),
);

