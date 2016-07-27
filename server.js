var express = require("express");
var app = express();
var server =  require("http"). createServer(app);
var mongoose = require('mongoose');
var io  = require("socket.io").listen(server);

var users = [];
var connections = [];


server.listen(process.env.PORT || 3000);

mongoose.connect('mongodb://localhost/badaginida');

console.log("server is runinng");

app.get("/", function(req , res){
  console.log("server is connected");

});

app.get("/neworder", function(req , res){
  console.log("neworder is connected");
  res.send(404);
});


var DriverSchema = new mongoose.Schema({
  driver_id: String
, latitude: String
, longitude: String
, status: String
});

var OrderSchema = new mongoose.Schema({
  cusId: String
, order_id: String
, status: String
});

var OrderModal = mongoose.model('orders', DriverSchema);

var DriverModal = mongoose.model('driverlocations', DriverSchema);

var basket = {};


io.sockets.on('connection', function(socket){
    connections.push(socket);
    basket[data.cusid] = socket.id;
    console.log("device is connceted %s",  connections.length);

    socket.on("disconnect", function(data){
        console.log("device is disconnceted %s",  connections.length);

    });
    //io.sockets.emit("new_driver", {"id" : "002"});

    socket.on("get drivers", function(data){
      console.log("got driver");
      DriverModal.findOne({ driver_id: '001' }, function(err, drivers) {
      if (err) return console.error(err);
      console.log(drivers);
      //io.sockets.emit("new_driver", drivers);

      var to = basket[data.cusid];
      io.sockets.socket(to).emit("new_driver", drivers);

      });

    });

    socket.on("update driver", function(data){
        var driver = new DriverModal({
          driver_id: '001'
        , latitude: '6.912089'
        , longitude: '79.860593'  // Notice the use of a String rather than a Number - Mongoose will automatically convert this for us.
        , status: '1'
        });

      driver.save(function(err, thor) {
        if (err) return console.error(err);
        console.dir(driver);
      });

    });
    socket.on("add order", function(data){
      console.log("add order is connected");
        var order = new OrderModal({
          cusId: '06'
        , order_id: '000022122'
        , status: '1'
        });

      order.save(function(err, thor) {
        if (err) return console.error(err);
        console.dir(order);
        var to = basket[data.cusid];
        io.sockets.socket(to).emit("get_order_status", order);
      });

    });


});
