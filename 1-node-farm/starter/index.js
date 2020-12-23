const hello="hello world";
console.log(hello);
// no need index.html anymore, just type node index.js
// so npm is an environment

const fs=require('fs');
// like import fs as fs
const textIn=fs.readFileSync('./txt/input.txt','utf-8');
console.log(textIn);

const textOut=`this is what we get from input: ${textIn}.\nCreated on ${Date.now()}`;
// note that we should use ` instead of '
// ${} like string + string in java
fs.writeFileSync('./txt/output.txt',textOut);

