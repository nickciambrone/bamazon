var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
})
function start() {
    inquirer
        .prompt({
            name: "viewOrAdd",
            type: "list",
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ]
        }).then(function (answer) {
            if (answer.viewOrAdd == 'Add New Product') {
                addNewProduct()
            }
            if (answer.viewOrAdd == 'Add to Inventory') {
                addToInventory()
            }
            if (answer.viewOrAdd=='View Products for Sale'){
                viewProducts()
            }
            if (answer.viewOrAdd=='View Low Inventory'){
                viewLow()
            }
        })
}
function viewLow(){
    connection.query("SELECT * FROM inventory", function(err,results){
        for (var i=0; i<results.length;i++){
            if(results[i].quantity<5){
            console.log('--------------------------------------------------------------------------------------------------------')
            console.log("Item id: "+results[i].item_id+" | "+"Item Name: "+results[i].item_name+" | "+"Price: "+results[i].price+" | "+"Quantity: "+results[i].quantity+"\n")
            }
        }
        start()

    })
}
var num =25;
var n=num.toString();
console.log(n.length)

function viewProducts(){

    connection.query("SELECT * FROM inventory", function(err,results){
        var spaces=[];
        var spacesEnd=[];
       
        for (var i=0; i<results.length;i++){
            var amountOfSpaces=14-results[i].item_name.length
            for(var x=0;x<amountOfSpaces;x++){
                spaces.push(" ")
                
            }
        }
        for (var i=0; i<results.length;i++){
            var str=results[i].quantity.toString()
            var amountOfSpaces=5-str.length
            for (var x=0; i<amountOfSpaces;i++){
                spacesEnd.push(" ")
                
            }
            

        }
        
        
           
            console.log('\n----------------------------------------------------------------------------------------------')
            for (var i=0;i<results.length;i++){
                var spacesLength=32-results[i].item_name.length
                var stringy=results[i].price.toString()
                var stringyy=results[i].quantity.toString()
                var spacesAfterQuantitiyLength=7-stringyy.length
                var spacesAfterPriceLength=5-stringy.length
            var spacesAfterName=[];
            var spacesAfterPrice=[];
            var spacesAfterQuant=[];
            for (var x=0;x<spacesLength;x++){
                spacesAfterName.push(" ")
            }
            for (var y=0;y<spacesAfterPriceLength;y++){
                spacesAfterPrice.push(" ")
            }
            for (var z=0;z<spacesAfterQuantitiyLength;z++){
                spacesAfterQuant.push(" ")
            }
           
         
            console.log("| Item id: "+results[i].item_id+" | "+"Item Name: "+results[i].item_name+spacesAfterName.join("")+"| "+"Price: "+results[i].price+spacesAfterPrice.join("")+" | "+"Quantity: "+results[i].quantity+spacesAfterQuant.join("")+"|")
            spacesAfterName=[];
            spacesAfterPrice=[];
            spacesAfterQuant=[];
            }
           
           spaces=[];
           
            
           console.log('----------------------------------------------------------------------------------------------')

        
        
    })
    start()
}
function addNewProduct() {

    inquirer.prompt([
        {
            name: "productName",
            message: "Enter the Product Name"
        },
        {
            name: "productPrice",
            message: "Enter the Product Price"
        },
        {
            name: "productQuantity",
            message: "Enter the quantity that you would like to add"
        }
    ]).then(function (answer) {
        connection.query(
            "INSERT INTO inventory SET ?",
            {
                item_name: answer.productName,
                price: answer.productPrice,
                quantity: answer.productQuantity
            },
            function (err) {
                if (err) throw err;
                console.log("You have added " + answer.productName + " to the inventory.")
                
            }
        )
        start()
    })


}
var newQuan;
function addToInventory() {
    connection.query("SELECT item_name FROM inventory", function (err, results) {
        if (err) throw err;
        // console.log(results)
        inquirer.prompt([
            {
                name: "productName",
                type: "list",
                message: "Enter the name of the product that you would like to add to add to",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].item_name)
                    }
                    return choiceArray;
                }
            },
            {
                name: "productQuantity",
                message: "Enter the quantity that you would like to add"
            }
        ]).then(function (answer) {
            var chosenItem = answer.productName
            var quan=answer.productQuantity
            
            
            var chosenItemQuantity;
            connection.query("SELECT quantity FROM inventory WHERE ?", [
                {
                  item_name: chosenItem
                }],function (err, results) {
                    chosenItemQuantity=results[0].quantity;
                    console.log(chosenItemQuantity)
                    console.log(quan)
                    var newQuan=parseInt(quan)+parseInt(chosenItemQuantity)
                    console.log(newQuan)
                    connection.query("UPDATE inventory SET ? WHERE ?",    
                    [{
                            quantity: newQuan
                        },
                        {
                            item_name: chosenItem
                        }],
                        function (err) {
                            if (err) throw err;
                            // console.log("Added to Inventory successfully!");
        
                            connection.end()
                        })
                })
        
            
           
        })

    })

}
function createArray(){
  var spacesEnd=[]
            var amountAtEnd=5-2
            for (var x=0;x<amountAtEnd;x++){
                spacesEnd.push(" ")
            }
}
createArray()