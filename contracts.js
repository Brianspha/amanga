module.exports = {
    default: {
        deployment: {
            host: "ropsten.infura.io/v3/1ff323953d2a4cd1ac1cea6ab59a04f5",
            port: false,
            protocol: 'https',
            type: "rpc",
            accounts: [{
            mnemonic: 'merry core shrug element key enough ski pigeon toilet addict zone brass',
            addressIndex: "0", // Optional. The index to start getting the address
            numAddresses: "10"
      }]
        },
        gas: "8000000",
        contracts: {
            ERC20Detailed: {
                args:[
                    "AToken",
                    "AT",
                    18,
                    2000000000
                ],
                gasPrice: 1200
            },
            Amanga: {
                args: [
                ],
                gasPrice:1200
            },
            SafeMath:{
                args:[],
                gasPrice:1200
            },
            Roles:{
                args:[],
                gasPrice:1200
            }

        }
    }
};