#!/usr/bin/env node

import { create } from 'create-create-app';
import { resolve } from 'path';

const templateRoot = resolve(__dirname, '..', 'templates');

const caveat = `New embd project created
                Thanks for using embd! ^_^`;

create('create-embd', {
  templateRoot,
  caveat,
});
