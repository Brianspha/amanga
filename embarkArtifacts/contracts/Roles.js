"use strict";
const isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);
const lib = isNode ? '../embarkjs.node' : '../embarkjs';
const EmbarkJSNode = isNode && require('../embarkjs.node');
let EmbarkJSBrowser;
try {
EmbarkJSBrowser = require('../embarkjs').default;
} catch(e) {};
const EmbarkJS = isNode ? EmbarkJSNode : EmbarkJSBrowser;
let RolesJSONConfig = {"contract_name":"Roles","address":"0xA90Fe3BcEd04121F88eAABCb956C5AC36a5f14f1","code":"60556023600b82828239805160001a607314601657fe5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea265627a7a72305820ac697f913f727d241f7eccfad51ab5abd05d2b68d56bef8462ec9a70ef883f5864736f6c63430005090032","runtime_bytecode":"73000000000000000000000000000000000000000030146080604052600080fdfea265627a7a72305820ac697f913f727d241f7eccfad51ab5abd05d2b68d56bef8462ec9a70ef883f5864736f6c63430005090032","real_runtime_bytecode":"73000000000000000000000000000000000000000030146080604052600080fdfea265627a7a72305820ac697f913f727d241f","swarm_hash":"7eccfad51ab5abd05d2b68d56bef8462ec9a70ef883f5864736f6c6343000509","gas_estimates":{"creation":{"codeDepositCost":"17000","executionCost":"94","totalCost":"17094"},"internal":{"add(struct Roles.Role storage pointer,address)":"infinite","has(struct Roles.Role storage pointer,address)":"infinite","remove(struct Roles.Role storage pointer,address)":"infinite"}},"function_hashes":{},"abi":[]};
let Roles = new EmbarkJS.Blockchain.Contract(RolesJSONConfig);
module.exports = Roles;