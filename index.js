const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();




 
/*stockX.fetchProductDetails('https://stockx.com/adidas-yeezy-boost-700-magnet')
.then(product => test(product))
.catch(err => console.log(`Error scraping product details: ${err.message}`));
*/
function test(t,reg){
	//console.log(t)
	name=t.name
	pimage=t.image
	pid=t.pid
	variantsArr=t.variants
	console.log(t)
	
	//name = name.split("/")[1];
	console.log(variantsArr)
	for(let data of variantsArr) {
    if(data.market.lowestAsk==undefined || data.market.lowestAsk=='undefined'){
      lowestAsk=''
    }else{
      lowestAsk=data.market.lowestAsk

    }

    if(data.market.highestBid==undefined || data.market.highestBid=='undefined'){
      highestBid=''
    }else{
      highestBid=data.market.highestBid

    }

    if(data.market.deadstockSold==undefined || data.market.deadstockSold=='undefined'){
      deadstockSold=''
    }else{
      deadstockSold=data.market.deadstockSold

    }
			var sql = "INSERT INTO products (Product_name,product_id,size,last_sale,imageUrl,lowesAsk,heighestBid,deadstockSold) VALUES ('"+name+"', '"+pid+"','"+data.size+"','"+data.market.lastSale+"','"+pimage+"','"+lowestAsk+"','"+highestBid+"','"+deadstockSold+"')";
		 console.log(sql)
	  conn.query(sql, function (err, result) {
		if (err) throw err;
		  console.log("1 record inserted");
    });
    
 
	}
	setTimeout(function(){ 
       reg.redirect('/message');
	}, 3000);
	  
  /*let sql = "INSERT INTO product SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
  */
}

//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');

const app = express();
 
//Create connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'stockx'
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set public folder as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));
 

var connect = require('connect'),
serveStatic = require('serve-static');


app.use(serveStatic("./angularjs"));
app.listen(5000);


//route for homepage
app.get('/',(req, res) => {
  let sql = "SELECT * FROM products";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      results: results
    });
  });
});

//route for homepage
app.get('/message',(req, res) => {
  let sql = "SELECT * FROM products";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      results: results
    });
  });
});
 



//route for homepage
app.get('/edit/(:id)',(req, res) => {
  let sql = "SELECT * FROM products where";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      results: results
    });
  });
});
 
//route for insert data
app.post('/save',(req, res) => {

	product_name= req.body.product_name
	console.log(product_name)
	stockX.fetchProductDetails(product_name)
	.then(product => test(product,res))
	.catch(err => console.log(`Error scraping product details: ${err.message}`));

  

});
 
//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});
 
//route for delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM product WHERE product_id="+req.body.product_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/');
  });
});
 

/***   Inventory Add */
app.post('/save1',(req, res) => {
  product_name= req.body.pids
	//console.log(JSON.stringify(product_name))
  console.log("Hello...")
  
  productID=product_name.split(",")
  for(let data of productID) {
      var sql = "INSERT INTO inventory (productID) VALUES ("+data+")";
    console.log(sql)
    conn.query(sql, function (err, result) {
    //if (err) throw err;
      console.log("1 record inserted");
    });
  }
	setTimeout(function(){ 
    res.redirect('/message');
}, 3000);
});




/*** Inventory Add */
app.post('/editProduct',(req, res) => {
  pdate=req.body.pdate
  saledt=req.body.saledt
  cprice=req.body.cprice
  sprice=req.body.sprice
  fees=req.body.fees
  ProwID=req.body.ProwID
  
  console.log("Hello...Ajax")
  
  let sql = "update products set 	FM_pdate='"+pdate+"',FM_sdate='"+saledt+"',FM_cprice='"+cprice+"',FM_sprice='"+sprice+"',FM_fees='"+fees+"' where id="+ProwID;
  console.log(sql)
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('inventory',{
      results: results
    });

    res.status(200).send({ 'status': 1 });
  });

  // productID=product_name.split(",")
  // for(let data of productID) {
  //     var sql = "INSERT INTO inventory (productID) VALUES ('"+data+"')";
  //   console.log(sql)
  //   conn.query(sql, function (err, result) {
  //   //if (err) throw err;
  //     console.log("1 record inserted");
  //   });
  // }
});



/*** Inventory Add */
app.post('/addProductFormula',(req, res) => {
  pdate=req.body.pdate
  saledt=req.body.saledt
  cprice=req.body.cprice
  sprice=req.body.sprice
  fees=req.body.fees
  ProwID=req.body.ProwID
  
  console.log("Hello...Ajax")
  
  let sql = "update products set 	FM_pdate='"+pdate+"',FM_sdate='"+saledt+"',FM_cprice='"+cprice+"',FM_sprice='"+sprice+"',FM_fees='"+fees+"' where id="+ProwID;
  console.log(sql)
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('inventory',{
      results: results
    });

    var sql2 = "INSERT INTO inventory (productID) VALUES ('"+ProwID+"')";
      console.log(sql2)
      conn.query(sql2, function (err, result) {
      if (err) throw err;
        console.log("1 record inserted");
      });

    res.status(200).send({ 'status': 1 });
  });

  // productID=product_name.split(",")
  // for(let data of productID) {
  //     var sql = "INSERT INTO inventory (productID) VALUES ('"+data+"')";
  //   console.log(sql)
  //   conn.query(sql, function (err, result) {
  //   //if (err) throw err;
  //     console.log("1 record inserted");
  //   });
  // }
});
 
function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [ pad(d.getDate()),pad(d.getMonth()+1), d.getFullYear()].join('/')
}

/*** Inventory Add */
app.post('/inventory',(req, res) => {
  product_name= req.body.redirect1

  if(product_name=="Formula"){
      res.render('formula');
 }else{


  // let sqlFormula = "SELECT * FROM `formula` ";
  // let ids=''
  // let sqlFormula1 = conn.query(sqlFormula, (err, results) => {
  //   if(err) throw err;

   
  //   ids=results[0].id
  //   pdate=results[0].pdate
  //   sdate=results[0].sdate
  //   cprice=results[0].cprice
  //   sprice=results[0].sprice
  //   fees=results[0].fees

   
  // });

  //console.log("Response..ids",ids);

    let sql = "SELECT * FROM `products` right join inventory on inventory.productID=products.id";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
     // console.log("before...",results)

      //console.log("After push..",results.push(ids))

      for (i = 0; i < results.length; i++) {
        var pd = new Date(results[i]['FM_pdate']);
        var sd = new Date(results[i]['FM_sdate']);
        if(results[i]['FM_cprice']){
          results[i]['FM_cprice']=results[i]['FM_cprice']
        }else{
          results[i]['FM_cprice']=0
        }

        if(results[i]['FM_sprice']){
          results[i]['FM_sprice']=results[i]['FM_sprice']
        }else{
          results[i]['FM_sprice']=0
        }

        if(results[i]['FM_fees']){
          results[i]['FM_fees']=results[i]['FM_fees']
        }else{
          results[i]['FM_fees']=0
        }

        results[i]['ids']=results[i]['ids'] 
        results[i]['pdate']=convertDate(pd)
        results[i]['sdate']=convertDate(sd)
        results[i]['cprice']=results[i]['FM_cprice']
        results[i]['sprice']=results[i]['FM_sprice']

        results[i]['fees']=results[i]['FM_fees']

        sprice=results[i]['FM_sprice']
        cprice=results[i]['FM_cprice']
        fees=results[i]['FM_fees']
        payout=sprice*(1-(fees/100))
        if(payout){
          payout=parseFloat(payout).toFixed(2);
        }
        profit=payout-cprice
        if(profit){
          profit=parseFloat(profit).toFixed(2);
        }
        profit=profit
        rio=profit/cprice
        var profit1 = profit < 1 ? '-$'+ profit.toString().split('-')[1] : '$'+profit;  
        console.log("profit1===>>",profit1)
        if(profit1=='-$undefined'){
          profit1='$0'
        }
        if(rio){
          rio=parseFloat(rio).toFixed(2);
        }
        if(isNaN(rio)){
          rio=''
        }
        results[i]['payout']=payout
        results[i]['profit']=profit1
        results[i]['rio']=rio*100
       
      }

      console.log("After push.2.",results)
      res.render('inventory',{
        results: results
      });
    });

    
 }
  

});




/*** Inventory Add */
app.post('/home',(req, res) => {
  redirect= req.body.redirect

  if(redirect=="searchProduct"){
      res.redirect('/');
  }

  if(redirect=="Formula"){
    res.render('inventory')
  }
  let sql = "SELECT * FROM `products` right join inventory on inventory.productID=products.id";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('inventory',{
      results: results
    });
  });
});

// Save Formula


//route for delete data
app.post('/saveFormula',(req, res) => {
  pdate= req.body.pdate
  sdate= req.body.sdate
  cprice= req.body.cprice
  sprice= req.body.sprice
  fees= req.body.fees
  
     sql = "INSERT INTO formula (pdate,sdate,cprice,sprice,fees) VALUES ('"+pdate+"','"+sdate+"','"+cprice+"','"+sprice+"','"+fees+"')";
    console.log(sql)
    conn.query(sql, function (err, result) {
    if (err) throw err;
        res.render('formula');
      //console.log("Record inserted..");
    });
});
//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
 

//productList = stockX.newSearchProducts('adidas-yeezy-boost-700-magnet');

//console.log(productList.variants)
/*
stockX.searchProducts('yeezy', {
    limit: 5
})
.then(products => console.log(products))
.catch(err => console.log(`Error searching: ${err.message}`));
*/




