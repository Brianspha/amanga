const AmangaContract = require('Embark/contracts/Amanga')
const TokenContract = require('Embark/contracts/ERC20Detailed')
let url_keys = []
let accounts;

// For documentation please see https://embark.status.im/docs/contracts_testing.html
config({
    //deployment: {
    //  accounts: [
    //    // you can configure custom accounts with a custom balance
    //    // see https://embark.status.im/docs/contracts_testing.html#Configuring-accounts
    //  ]
    //},
    contracts: {
        ERC20Detailed: {
            args: [
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
}, (_err, web3_accounts) => {
    accounts = web3_accounts
});

contract("RhodeIT Deployment", (err) => {
    console.log('accounts: ', accounts)
    console.log('error: ', err)
    let url = 'https://ethereum.stackexchange.com/questions/38704/why-most-erc-20-tokens-have-18-decimals';
    url = web3.utils.fromAscii(url)
    var reason = web3.utils.fromAscii('Not Factual')
    it('should report a url', async () => {

        console.log('url: ', url)
        var receipt = await AmangaContract.methods.report_url(url, reason, accounts[1]).send({
            gas: 8000000,
            from: accounts[0]
        })
        await AmangaContract.methods.save_url_thash(url, receipt.transactionHash).send({
            gas: 8000000,
            from: accounts[0]
        })
        console.log('hash: ', receipt.transactionHash)
    })
    it('should report the same url but different account', async () => {

        console.log('url: ', url)
        var reason = web3.utils.fromAscii('Not Factual')
        var receipt = await AmangaContract.methods.report_url(url, reason,accounts[2]).send({
            gas: 8000000,
            from: accounts[0]
        })
    })
    it('should up vote a url', async () => {
        var receipt = await AmangaContract.methods.up_down_vote_url(url, 1,accounts[2]).send({
            gas: 8000000,
            from: accounts[0]
        })

    })
    it('should down vote a url', async () => {
        var receipt = await AmangaContract.methods.up_down_vote_url(url, 0,accounts[2]).send({
            gas: 8000000,
            from: accounts[0]
        })

    })
    it('should check if a given url has been reported', async () => {
        var reported = await AmangaContract.methods.is_url_reported(url).call({
            gas: 8000000,
            from: accounts[0]
        })
        assert.strictEqual(reported, true);
    })

    it('should down vote a given article 2 times', async () => {
        for (var i = 0; i < 2; i++) {
            var reported = await AmangaContract.methods.up_down_vote_url(url, 0,accounts[3]).send({
                gas: 8000000,
                from: accounts[0]
            })
        }
    })

    it('should up vote a given article 2 times', async () => {
        for (var i = 0; i < 2; i++) {
            var receipt = await AmangaContract.methods.up_down_vote_url(url, 1,accounts[4]).send({
                gas: 8000000,
                from: accounts[0]
            })
        }
    })
    it('should get the total supply', async () => {
        var min_token_payout = await AmangaContract.methods.get_min_token_payout().call({
            gas: 8000000
        })
        var supply = await TokenContract.methods.transfer(accounts[1], min_token_payout).send({
            gas: 8000000,
            from: accounts[0]
        })
        var balance = await TokenContract.methods.balanceOf(accounts[1]).call({
            gas: 8000000
        })
        console.log('balance[1]: ', balance)
        assert.strictEqual(balance > 0, true)
    })

    it('should get a url keys', async () => {
        url_keys = await AmangaContract.methods.get_urls_reported_keys().call({
            gas: 8000000
        })
        console.log('keys: ', url_keys)
        console.log('url_keys.lenght > 0', url_keys.length > 0)
        assert.strictEqual(url_keys.length > 0, true)
    })
    it('should get a url reported details', async () => {
        console.log('Url_keys: ', url_keys)
        for (var i = 0; i < url_keys.length; i++) {
            var key = url_keys[i]
            var details = await AmangaContract.methods.get_url_details(key).call({
                gas: 8000000
            })
            var date = new Date(parseInt(details[4]) * 1000).toUTCString()
            console.log(`url ${web3.utils.toAscii(key)}\nup_votes: ${details[1]}\ndown_votes: ${details[2]}\nhash: ${details[3]}\ndate: ${date}\nreason: ${web3.utils.toAscii(details[5])}`)
            console.log('details: ', details)
        }
    })

})