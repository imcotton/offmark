#!/usr/bin/env node

import { stdin, stdout } from 'node:process';
import { Readable, Writable } from 'node:stream';

import { main } from './offmark.ts';





main(
    // @ts-ignore YOLO
    Readable.toWeb(stdin),
    Writable.toWeb(stdout),
);

