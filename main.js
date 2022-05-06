const serverUrl = "https://gjyexdlwsqwi.usemoralis.com:2053/server";
const appId = "zNakMsSAjNQYtzbJnJ9vaKfZRfKtEz2tvjS9FcCZ";
var proname;
Moralis.start({ serverUrl, appId });


async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
    $("#btn-login").show();
    $("#btn-logout").hide();
    $("#btn-buy").hide();

}
// logOut();

var user;
var isUser;
var TOKENS;
var PRICE;
var SELECTED_TOKEN;
var USD_PRICE;
var ONE_USDT;
var buy_token_json = { 'coin': "", "chain": "", "amount": 0 }
async function login() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");
    user = await Moralis.User.current();
    if (!user) {
        user = await Moralis.authenticate({ signingMessage: "Logging in." })
            .then(function (user) {
                isUser = user;
                console.log("logged in user:", user);
                //console.log(user.get("ethAddress"));
                $("#btn-logout").show();
                $("#btn-login").hide();
                // $("#btn-buy").show();
                // document.getElementById('insuff-bal').innerText = "";
                // isUser = true;

            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        // console.log("already Logged on");
    }
    console.log(isUser, isUser.get('ethAddress'))
    if (isUser) {
        var allTokens = [];
        const bepbalances = await Moralis.Web3.getAllERC20({ chain: "bsc" });
        const ercbalances = await Moralis.Web3.getAllERC20();
        allTokens = bepbalances.concat(ercbalances);
        console.log(allTokens);
        TOKENS = allTokens;
        var valid_tokens = ["BNB", "USDT", "BUSD"]
        var select = document.getElementById('avail-coins');
        for (let index = 0; index < allTokens.length; index++) {
            var element = document.createElement('option');
            if (type == "token") {
                if (valid_tokens.includes(allTokens[index].symbol)) {
                    element.value = allTokens[index].symbol;
                    element.classList.add('opt');
                    element.innerHTML = allTokens[index].symbol;
                    // element.onclick = selected_token;
                    select.appendChild(element);
                }
            }
            else {
                element.value = allTokens[index].symbol;
                element.classList.add('opt');
                element.innerHTML = allTokens[index].symbol;
                // element.onclick = selected_token;
                select.appendChild(element);
            }
        }
    }
}

function changeFunc(selected_token) {
    SELECTED_TOKEN = selected_token;
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");
    console.log("change_func", selected_token);
    for (let index = 0; index < TOKENS.length; index++) {
        if (TOKENS[index].symbol == selected_token) {
            document.getElementById('token-price-label').innerText = parseFloat(Moralis.Units.FromWei(TOKENS[index].balance, TOKENS[index].decimals)).toFixed(4);
        }
    }
    fetch('https://api.coinbase.com/v2/exchange-rates?currency=' + selected_token)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            ONE_USDT = 1 / data.data.rates.USDT;
            var usd_price = parseFloat(data.data.rates.USDT * document.getElementById('token-price-label').innerText).toFixed(2);
            usd_price = parseFloat(usd_price);
            USD_PRICE = usd_price;
            document.getElementById('token-usd-label').innerText = usd_price + " $";
            console.log(proname);
            console.log("PRICE COMPARISON: ", PRICE, usd_price, typeof PRICE, typeof usd_price);
            if (PRICE > usd_price) {
                document.getElementById('insuff-bal').innerText = "Insufficient Balance";
                window.sessionStorage.setItem("payment_coin", null);
                $("#btn-buy").hide();
            }
            else {
                document.getElementById('insuff-bal').innerText = "";
                window.sessionStorage.setItem("payment_coin", selected_token);
                $("#btn-buy").show();
            }
        })
        .catch(err => alert("Coin Not Acceptable."))
}

const input1Func = async function (e) {
    console.log(e.target.value);
    var input_amount = e.target.value;
    if (SELECTED_TOKEN == "BNB") {
        document.getElementById('input-2').value = input_amount * 2666666.7;
        // buy_token("BNB", "0xb2f116fa3624ac807b180023ac77a0ac098f680d", "bsc", document.getElementById('input-2').value);
        buy_token_json.coin = "BNB";
        buy_token_json.chain = "bsc";
        buy_token_json.amount = parseInt(document.getElementById('input-2').value);
        if (input_amount < USD_PRICE && input_amount != null) {
            $("#btn-buy").show();
        }
        else {
            $("#btn-buy").hide();
        }
    }
    else if (SELECTED_TOKEN == "USDT") {
        document.getElementById('input-2').value = input_amount * 6666.7;
        // buy_token("BNB", "0xb2f116fa3624ac807b180023ac77a0ac098f680d", "bsc", document.getElementById('input-2').value);
        buy_token_json.coin = "USDT";
        buy_token_json.chain = "bsc";
        buy_token_json.amount = parseInt(document.getElementById('input-2').value);
        if (input_amount < USD_PRICE && input_amount != null) {
            $("#btn-buy").show();
        }
        else {
            $("#btn-buy").hide();
        }
    }
    else if (SELECTED_TOKEN == "BUSD") {
        document.getElementById('input-2').value = input_amount * 6666.7;
        // buy_token("BNB", "0xb2f116fa3624ac807b180023ac77a0ac098f680d", "bsc", document.getElementById('input-2').value);
        buy_token_json.coin = "BUSD";
        buy_token_json.chain = "bsc";
        buy_token_json.amount = parseInt(document.getElementById('input-2').value);
        if (input_amount < USD_PRICE && input_amount != null) {
            $("#btn-buy").show();
        }
        else {
            $("#btn-buy").hide();
        }
    }
    else {
        alert("Coin Not Selected.");
    }
}

async function purchase() {
    console.log(proname);
    Moralis.enableWeb3();
    var receiver = Moralis.User.current().get("ethAddress");
    console.log("Wallet Adress: ", receiver);
    var bsc_coins = ['BNB', 'BUSD']
    var natives = ['BNB', "ETH"]
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");
    if (type == "product") {
        const name = urlParams.get("name");
        var pay_coin = window.sessionStorage.getItem('payment_coin');
        if (pay_coin != null || pay_coin != undefined || pay_coin != "") {
       
          var order_pay=await pay(pay_coin, bsc_coins.includes(pay_coin) ? "bsc" : "eth", natives.includes(pay_coin) ? "native" : "erc20", USD_PRICE)
          if(order_pay)
          {
              var order_num = urlParams.get("productid");
              var orderDate = new Date();


                fetch("http://localhost/order_add", {
                    headers: {
                      "Content-type": "application/json; charset=UTF-8"
                    },
                    method: "POST",
                    body: JSON.stringify({ "orderid": order_num, "date": orderDate , "proname": proname}),
                  })
          }
       
        }
        else {
            console.log("Missing", pay_coin);
        }
    }
    else {
        var pay_coin = window.sessionStorage.getItem('payment_coin');
        if (pay_coin != null || pay_coin != undefined || pay_coin != "") {
            var is_paid = await direct_pay(pay_coin, bsc_coins.includes(pay_coin) ? "bsc" : "eth", natives.includes(pay_coin) ? "native" : "erc20", document.getElementById('input-1').value)
            if (is_paid) {
                await fetch('http://localhost:8081/make_private_transaction?receiver=' + receiver + '&amount=' + buy_token_json.amount)
                    .then(response => response)
                    .then(data => {
                        if(JSON.parse(data).status){
                            alert("Transaction Successful, Hash: ", JSON.parse(data).hash)
                        }
                        else{
                            alert("Transaction Failed!")
                        }
                    });
            }
            else{
                alert("Payment Cancelled by user.")
            }
        }
        else {
            console.log("Missing", pay_coin);
        }
        // buy_token(buy_token_json.coin, "0xb2f116fa3624ac807b180023ac77a0ac098f680d", buy_token_json.chain, buy_token_json.amount);
    }
}

async function direct_pay(data, chain, asset_type, amount) { // data: topaycoin, chain: chain, asset_type=native/erc20, type=product
    await Moralis.initPlugins();
    console.log("ARGS: ", data, chain, asset_type, amount);
    var dec;

    const token = await Moralis.Plugins.oneInch.getSupportedTokens({
        chain: chain, // The blockchain you want to use (eth/bsc/polygon)
    });
    console.log(token);
    fromTokenAddress = "";
    toTokenAddress = "";
    for (let i = 0; i < Object.keys(token.tokens).length; i++) {
        if (token.tokens[Object.keys(token.tokens)[i]]['symbol'] == data) {
            fromTokenAddress = Object.keys(token.tokens)[i];
            dec = token.tokens[Object.keys(token.tokens)[i]]['decimals'];
        }
    }
    console.log("Direct Decimals ", dec);
    const options = {
        type: asset_type,
        amount: Moralis.Units.Token(amount.toString(), dec),
        receiver: "0xe6BcdC011eB7613a98968C47F1931f55bB1E7919",

        contractAddress: fromTokenAddress,

    }
    const chainId = await Moralis.chainId;

    //   console.log(chainId);
    if (chainId != 0x38) {
        console.log("done");
        await Changenetwork();
    }

    let result = await Moralis.transfer(options)
    return true;

}

async function pay(data, chain, asset_type, amount) { // data: topaycoin, chain: chain, asset_type=native/erc20, type=product
    await Moralis.initPlugins();
    amount = ONE_USDT * amount;
    console.log("ARGS: ", data, chain, asset_type, amount);
    var dec;

    const token = await Moralis.Plugins.oneInch.getSupportedTokens({
        chain: chain, // The blockchain you want to use (eth/bsc/polygon)
    });
    console.log(token);
    fromTokenAddress = "";
    toTokenAddress = "";
    for (let i = 0; i < Object.keys(token.tokens).length; i++) {
        if (token.tokens[Object.keys(token.tokens)[i]]['symbol'] == data) {
            fromTokenAddress = Object.keys(token.tokens)[i];
            dec = token.tokens[Object.keys(token.tokens)[i]]['decimals'];
        }
    }
    console.log("DEcimals ", dec);
    const options = {
        type: asset_type,
        amount: Moralis.Units.Token(amount.toString(), dec),
        receiver: "0xe6BcdC011eB7613a98968C47F1931f55bB1E7919",

        contractAddress: fromTokenAddress,

    }
    const chainId = await Moralis.chainId;

    //   console.log(chainId);
    if (chainId != 0x38) {
        console.log("done");
        await Changenetwork();
    }

    let result = await Moralis.transfer(options)
    return true;

}
// function swap (data: topaycoin -> fromTokenAddress, Hot wallet coin: totokenAddress, chain, amount)
async function buy_token(data, to_token, chain, amount) {
    await Moralis.initPlugins();

    const token = await Moralis.Plugins.oneInch.getSupportedTokens({
        chain: chain, // The blockchain you want to use (eth/bsc/polygon)
    });
    console.log("by_token", token);
    fromTokenAddress = "";
    toTokenAddress = "";
    for (let i = 0; i < Object.keys(token.tokens).length; i++) {
        if (token.tokens[Object.keys(token.tokens)[i]]['symbol'] == data) {
            fromTokenAddress = Object.keys(token.tokens)[i];
        }
        if (token.tokens[Object.keys(token.tokens)[i]]['symbol'] == to_token) {
            toTokenAddress = Object.keys(token.tokens)[i];
        }
    }
    console.log(fromTokenAddress, toTokenAddress);
    //  user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" });
    const receipt = await Moralis.Plugins.oneInch.swap({
        chain: chain, // The blockchain you want to use (eth/bsc/polygon)
        fromTokenAddress: fromTokenAddress, // The token you want to swap
        toTokenAddress: to_token, // The token you want to receive
        amount: Number(Moralis.Units.ETH(amount)),
        fromAddress: Moralis.User.current().get('ethAddress'), // Your wallet address
        slippage: 1,
    });
    // const userObj = new User();
    // await userObj.add(chain, data, to_token, receipt.blockHash, receipt.status, receipt.transactionHash);
    // console.log(await userObj.getAll());

}
document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;
// document.getElementById("btn-changenetwork").onclick = Changenetwork;
async function Changenetwork() {
    const chainId = 56;
    const chainName = "Binance Smart Chain Mainnet";
    const currencyName = "BNB";
    const currencySymbol = "BNB";
    const rpcUrl = "https://bsc-dataseed1.ninicoin.io";
    const blockExplorerUrl = "https://bscscan.com/";

    await Moralis.addNetwork(
        chainId,
        chainName,
        currencyName,
        currencySymbol,
        rpcUrl,
        blockExplorerUrl
    );
}
//document.getElementById("pay").onclick = pay($(this).attr("data-id"));
if (Moralis.User.current()) {
    $("#btn-login").hide();
    console.log("Already Logged in");

}
if (!Moralis.User.current()) {
    $("#btn-login").show();
    $("#btn-logout").hide();
    console.log("Already in");
}
class User {
    usersRef = db.collection("users");

    async add(chain_id, from_token, to_token, blockhash, status, transactionHash) {
        const user = { chain_id, from_token, to_token, blockhash, status, transactionHash };

        try {
            const docRef = await this.usersRef.add(user);
            console.log('User Added with ID: ', docRef.id);
            user.id = docRef.id;

        } catch (error) {
            console.error('Error Adding User: ', error)
        }

        return user;
    }

    async getAll() {
        const users = [];

        try {
            const snapshot = await this.usersRef.get()
            snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }))
        } catch (err) {
            console.error('Error Getting Users: ', error);
        }

        return users;
    }

    async get(id) {
        let user;

        try {
            let doc = await this.usersRef.doc(id).get();

            if (doc.exists)
                user = { id: doc.id, ...doc.data() };
            else
                console.log('No document found with id: ', id);
        } catch (error) {
            console.error('Error in getting user: ', error);
        }

        return user;
    }

    async delete(id) {
        try {
            await this.usersRef.doc(id).delete();
            console.log('User is deleted with id: ', id);
        } catch (error) {
            console.error('Error in deleting user: ', error);
        }
    }
}

window.onload = async function () {
    try {
        await logOut();
        const urlParams = new URLSearchParams(window.location.search);
        // product, token
        const type = urlParams.get("type");
        var price;
        console.log(price, type);
        if (type == "product") {
            const productid = urlParams.get("productid");
            fetch(`http://localhost:8081/getproduct?id=${productid}`)
            .then(res=>res.json())
            .then(async function (data)
            {
                console.log(data);
                 price = data[0].price;

            document.getElementById("input-1").style.display = "none";
            document.getElementById("input-2").style.display = "none";
            document.getElementById("main-title").innerText = "Purchase Product via Crypto";
            const name = data[0].name;
            if (name) {
                document.getElementById("buy-label").innerText = name;
                sessionStorage.setItem("Productname", name);
                proname = name;

            }
            else {
                document.getElementById("buy-label").innerText = "UNKNOWN";
            }
            document.getElementById("buy-price-label").innerText = price + "$"; 
            })
      
        }
        else if (type == "token") {
            document.getElementById("input-1").style.display = "block";
            document.getElementById("input-2").style.display = "block";
            document.getElementById("input-1").addEventListener('input', input1Func);
            document.getElementById("main-title").innerText = "SWAP with StarNet (STR)";
            document.getElementById("buy-label").innerText = "StarNet - STR"
            document.getElementById("buy-price-label").innerText = "0.00015 $"
        }
        else {
            alert("Incomplete Purchase Request");
            window.location = "sorry.html";
        }
        if (price) {
            PRICE = parseFloat(price);
        }
        else {
            PRICE = 0.00015;
        }
        console.log("PRICE: ", PRICE);
        document.getElementById('insuff-bal').innerText = "";
    }
    catch (err) {
        console.log(err);
    }
    // await login();
}