"use strict";
const isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);
const lib = isNode ? '../embarkjs.node' : '../embarkjs';
const EmbarkJSNode = isNode && require('../embarkjs.node');
let EmbarkJSBrowser;
try {
EmbarkJSBrowser = require('../embarkjs').default;
} catch(e) {};
const EmbarkJS = isNode ? EmbarkJSNode : EmbarkJSBrowser;
let SafeMathJSONConfig = {"contract_name":"SafeMath","address":"0x06E090D16205DA729798bEC224fbDc99761d3E1F","code":"60556023600b82828239805160001a607314601657fe5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea265627a7a72305820d6011ecc42425446ab6f8165b686dbc4f8bc1a0452b909d201c49adc6c87582064736f6c63430005090032","runtime_bytecode":"73000000000000000000000000000000000000000030146080604052600080fdfea265627a7a72305820d6011ecc42425446ab6f8165b686dbc4f8bc1a0452b909d201c49adc6c87582064736f6c63430005090032","real_runtime_bytecode":"73000000000000000000000000000000000000000030146080604052600080fdfea265627a7a72305820d6011ecc42425446ab","swarm_hash":"6f8165b686dbc4f8bc1a0452b909d201c49adc6c87582064736f6c6343000509","gas_estimates":{"creation":{"codeDepositCost":"17000","executionCost":"94","totalCost":"17094"},"internal":{"add(uint256,uint256)":"infinite","div(uint256,uint256)":"infinite","mod(uint256,uint256)":"infinite","mul(uint256,uint256)":"infinite","sub(uint256,uint256)":"infinite"}},"function_hashes":{},"abi":[]};
let SafeMath = new EmbarkJS.Blockchain.Contract(SafeMathJSONConfig);
module.exports = SafeMath;