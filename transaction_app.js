var express = require('express');
var mysql = require('mysql');

var bodyParser = require('body-parser');
var cors = require('cors')
var app = express();
var Moralis = require('moralis/node');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
var db_config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'scd75'
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {              // The server is either down
    if (err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();
var moralisSecret = "oK1EP6e4gPagutaRxYbCP8l8XgyqFBIK63FspD1EQGdo95qCauMhiml9PTH8ryQP";
var serverUrl = "https://lfvk6rjxnjql.usemoralis.com:2053/server";
var appId = "j7K9Jx6KmRjlpwWXiKfqv7T7rRuMxVaCVjHqm4EF"

const trans = async (receiver, amount) => {
  try {
    await Moralis.start({ serverUrl, appId, moralisSecret });

    // Enable web3
    await Moralis.enableWeb3({
      //BSC mainnet
      chainId: 56,
      privateKey: "312349b8ce25c1483bd58a23e0d319aae11a7678411bb6bdd004ae3764936e5b",
    });

    // sending 0.5 DAI tokens with 18 decimals on BSC mainnet
    const options = {
      type: "erc20",
      amount: Moralis.Units.Token(amount.toString(), 18),
      receiver: receiver, //"0x0FBd315BDd44F6a92B36DC32A9245B44f33B2cED",
      contractAddress: "0xb2f116fa3624ac807b180023ac77a0ac098f680d",
    };
    await Moralis.transfer(options).then((result) => {
      console.log(result);
      return { "hash": result.hash, "status": true }
    });

  }
  catch (err) {
    console.log(err);
    return { "hash": "", "status": false }
  }
};
// trans();
app.get('/make_private_transaction', async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  var receiver = req.query.receiver;
  var amount = req.query.amount;
  var confirmed_payment = await trans(receiver, amount);
  res.send(confirmed_payment)
})
app.get('/getproduct', async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
    connection.query(`SELECT * FROM product WHERE id="${req.query.id}"`, function (err, result) {
        if (err) throw err;
        res.send(result);
      });
  })
app.post('/addproduct', async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log("hit");
  console.log(req.body);

  if (req.body.type = "Product") {
    if (!req.body.name  || !req.body.price) {
      res.send('Invalid Parameters');
    }
    else
    {
      connection.query(`insert into product (name,price) VALUES ('${req.body.name}','${req.body.price}')`, function (err, result) {
                if (err) throw err;
                var lastid = result.insertId;
                // Data = lastid;
                // res.send({ Data});
                // console.log(lastid);
                res.send('Product Added \n Link :http://127.0.0.1:5501/indexs.html?type=product&productid=' + lastid);
              });
    }
  }

})
app.post('/order_status',async function (req,res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  connection.query(`select * from order_table where order_id =${req.body.orderid}`, function (err, result) {
    if (err) throw err;
    console.log(result.length);
    if(result.length > 0)
    {
      var status = 200;
          res.json({status : status , Message: "confirmed" });

      //res.status(200).send('some text');

    }
    else
    {
      var status = 404;

      res.json({status : status , Message: "order Not Found" });

    }
   
  });
})
app.post('/order_add',async function (req,res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  connection.query(`insert into order_table (order_id,date,product_name) VALUES ('${req.body.orderid}','${req.body.date}','${req.body.proname}')`, function (err, result) {
    if (err) throw err;
    
    res.send(result);
  });
})
app.get('/adminlogin',async function (req,res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  connection.query(`select * from admin where email='${req.query.email}' and password ='${req.query.pass}'`, function (err, result) {
    if (err) throw err;
    
    res.send(result);
  });
})
app.get('/order_table',async function (req,res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  connection.query(`SELECT order_table.order_id, product.name,product.price, order_table.date FROM order_table INNER JOIN product ON order_table.order_id=product.id;`, function (err, result) {
    if (err) throw err;
    
    res.send(result);
  });
})
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
});