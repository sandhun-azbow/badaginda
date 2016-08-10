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
    //basket[data.cusid] = socket.id;
    console.log("device is connceted %s",  connections.length);

    socket.on("disconnect", function(data){
        console.log("device is disconnceted %s",  connections.length);

    });
    //io.sockets.emit("new_driver", {"id" : "002"});

    socket.on("get drivers", function(data){
      console.log(data);
      // DriverModal.findOne({ driver_id: '001' }, function(err, drivers) {
      // if (err) return console.error(err);
      // console.log(drivers);
      //
      //
      // // var to = basket[data.cusid];
      // // io.sockets.socket(to).emit("new_driver", drivers);
      //
      // });

      io.sockets.emit("new_driver", {"cusid": data['cusid'], "driver_id": data['driver_id'],  "latitude" : data['latitude'], "longitude" : data['longitude']});

    });

    socket.on("new dining", function(data){
      console.log(data);
      io.sockets.emit("dining status", {"cusid": data['cusid'], "dining_id": data['dining_id'],  "status" : data['status'], "message" : data['message']});

      // var to = basket[data.cusid];
      // io.sockets.socket(to).emit("new_driver", drivers);

    });
    socket.on("new order driver", function(data){
      console.log(data);
      io.sockets.emit("order for driver", {"driver_id": data['driver_id'], "status": data['status'],  "order_id" : data['order_id']});

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
      console.log(data);
        var order = new OrderModal({
          cusId: data['cusid']
        , order_id: data['order_id']
        , status: data['status']
        });

      io.sockets.emit("get_order_status", {"cusId": data['cusid'],  "order_id" : data['order_id'], "status" : data['status'], "driver_no" : data['driver_no']});

      // order.save(function(err, thor) {
      //   if (err) return console.error(err);
      //   console.dir(order);
      //   //var to = basket[data.cusid];
      //
      //   //io.sockets.socket(to).emit("get_order_status", order);
      // });

    });


});
