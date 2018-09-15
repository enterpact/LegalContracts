#!/bin/bash

rm compiledcode
rm abi 
solc --bin --abi --overwrite --optimize -o . ./contracts/leth_contract.sol
cat TwoPartyLegalContract.bin > compiledcode
cat TwoPartyLegalContract.abi > abi
sed -ie "s/$/\"/" compiledcode
sed -ie "s/^/var bytecode=\"0x\" + \"/" compiledcode
sed -ie "s/^/var abiinterface=/" abi
cp src/dapp_module.js src/dapp_module_final.js
sed -i -e "/insertcompiledcodehere/r compiledcode" src/dapp_module_final.js;
sed -i -e "/insertabihere/r abi" src/dapp_module_final.js;
rm src/dapp_module_final.js-e
rm abie
rm abi
rm dist/main.js
rm compiledcode
rm compiledcodee
