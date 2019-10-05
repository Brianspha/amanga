module.exports = {
    default: {
        deployment: {
            protocol: "http",
            type: "rpc",
            host: "localhost",
            port: "11003",
        },
        gas: "8000000",
        contracts: {
            ERC20Detailed: {
                args:[
                    "AToken",
                    "AT",
                    18,
                    2000000000
                ]
            },
            Amanga: {
                args: [
                ]
            }

        }
    }
};