module.exports = {
    default: {
        deployment: {
            host: "localhost",
            port: 12000,
            protocol: 'ws',
            type: "ws",
        },
        gas: "8000000",
        contracts: {
            ERC20Detailed: {
                address: '0x0ee7110d91a23e6d5aab6f178249803158d23f71',
            },
            Amanga: {
                address: '0x41acc439c4a79940cc2d2ba419c35ed30dd87e66'
            }

        }
    }
};