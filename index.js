'use strict';

let wiki = require('node-wikipedia'),
    pgm  = require('commander');

if (process.argv.length <= 2) {
  console.log('No search query, exiting...');
  process.exit(-1);
}

let query = (process.argv.length > 3)
  ? process.argv.slice(2, process.argv.length).join(' ')
  : process.argv[2];

wiki.page.data(query, { content: true }, (res) => {
  res = res.text['*'].split('\n');

  let startIndex, endIndex;
  // Find start of relevant text
  for (let i=0; i < res.length; i++) {
    if (res[i].startsWith('<div class="mw-parser-output"')) {
      startIndex = i + 1;
      break;
    }
  }
  //Find end
  for (let i=0; i < res.length; i++) {
    if (res[i].startsWith('<div id="toc"')) {
      endIndex = i - 1;
      break;
    }
  }

  let shortRes = [];
  for (let i=startIndex; i < endIndex; i++) {
    if (res[i].startsWith('<p')) {
      shortRes.push(res[i]);
    }
  }
  shortRes = shortRes.join('\n');
  shortRes = shortRes.replace(/<(?:.|\n)*?>/g, ''); // remove HTML
  shortRes = shortRes.replace(/\[[0-9]*\]|\[note [0-9]*\]/g, ''); // remove citation numbers
  //TODO replace html ascii codes
  console.log(shortRes);
});
