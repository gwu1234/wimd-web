const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


/*
input: multiple assignments from employee.assignedOrders.orderKey.
const assigned = {
    orderKey: order.orderKey,
    orderId: order.orderId,
    clientKey: order.clientTag,
    employeeName: employee.name,
    employeeKey: employee.tag,
    usertag: usertag
};
output: employee.assigned.clientKey.workorders.orderKey
feature: select all assigned workorders for an employee
*/
  exports.selectOrders = functions.https.onCall((data, context) => {
     const uid = context.auth.uid;
     const name = context.auth.token.name || null;
     const picture = context.auth.token.picture || null;
     const email = context.auth.token.email || null;
     const token = context.auth.token || null;
     //console.log(name);
     //console.log(email);

     const orders = data.orders;
     //console.log(orders);

     //let clientKeyList = [];
     let employeeKeyList = [];
     let clientKeyList = [];
     let usertag = "1"; //fake usertag

     for (var key in orders) {
        //console.log("order key = " + key);
        //console.log ("order object = :")
        //console.log("key = " + orders[key].orderKey);
        //console.log("orderId = " + orders[key].orderId);
        //console.log("clientKey = " + orders[key].clientKey);
        //console.log("employeeName = " + orders[key].employeeName);
        //console.log("employeeKey = " + orders[key].employeeKey);
        //console.log("usertag = " + orders[key].usertag);
        usertag = orders[key].usertag;
        employeeKeyList.push (orders[key].employeeKey);
        clientKeyList.push (orders[key].clientKey);
     }

     const clientPath = "repos/" + usertag + "/clients/data";
     let clientAssigned  = {};

     return admin.database().ref(clientPath).once('value').then ((snapshot) => {
     //if(snapshot.exists()){
        const clientList = snapshot.val();
        for (var clientkey in clientList) {
           if (clientKeyList.includes(clientkey)) {
               //let clientAssigned  = {};
               clientAssigned[clientkey] = {};
               let contact = clientList[clientkey].contact;
               clientAssigned[clientkey]["city"] = contact["city"];
               clientAssigned[clientkey]["clientKey"] = contact["clientTag"] || contact["tag"];
               clientAssigned[clientkey]["country"] = contact["country"];
               clientAssigned[clientkey]["cells"] = contact["cells"];
               clientAssigned[clientkey]["emails"] = contact["emails"];
               clientAssigned[clientkey]["firstname"] = contact["firstname"];
               clientAssigned[clientkey]["lastname"] = contact["lastname"];
               clientAssigned[clientkey]["lat"] = contact["lat"];
               clientAssigned[clientkey]["lng"] = contact["lng"];
               clientAssigned[clientkey]["name"] = contact["name"];
               clientAssigned[clientkey]["phones"] = contact["phones"];
               clientAssigned[clientkey]["postcode"] = contact["postcode"];
               clientAssigned[clientkey]["street"] = contact["street"];
               let workorders = clientList[clientkey].workorders;
               let deliverys = clientList[clientkey].deliverys;
               let orderAssigned  = {};
               let activeOrders = 0 ;
               for (var orderkey in workorders) {
                   let assignedEmployees = workorders[orderkey].assignedEmployees;
                   for (var employeekey in assignedEmployees) {
                       let coworkers = {};
                       if (employeeKeyList.includes(employeekey)) {
                           const { clientKey, employeeKey, employeeName, orderId,
                                orderKey, usertag } = assignedEmployees[employeekey];

                           const {deliveryTimes,isActive,isRepeat,repeatTimes,work, photo} = workorders[orderkey];
                           let isOrderActive = workorders[orderkey].isActive;
                           if ( isOrderActive && (isOrderActive ==="true" || isOrderActive === true) ) {
                                activeOrders ++;

                                orderAssigned[orderkey] = {
                                    clientKey: clientKey,
                                    employeeKey: employeeKey,
                                    employeeName: employeeName,
                                    orderId: orderId,
                                    orderKey: orderKey,
                                    usertag: usertag,
                                    deliveryTimes: deliveryTimes,
                                    isActive: isActive,
                                    isRepeat: isRepeat,
                                    repeatTimes: repeatTimes,
                                    work: work,
                                    photo: photo
                                };
                                orderAssigned[orderkey]["coworkers"] = {
                                     ...assignedEmployees,
                                     [employeekey]: null,
                               };

                              let delivery4order = {};
                              for (var deliverykey in deliverys) {
                                 if (deliverys[deliverykey].linkedOrderKey === orderkey) {
                                      delivery4order[deliverykey] = deliverys[deliverykey];
                                 }
                              }
                              orderAssigned[orderkey]["deliverys"] = delivery4order;
                           }
                        }
                   }
               }

              clientAssigned[clientkey]["workorders"] = orderAssigned;
              clientAssigned[clientkey]["activeOrders"] = activeOrders;
            }
         }
         //console.log(clientAssigned);
         return { assigned: clientAssigned };
     });
   });


    /*
    input: 1 assignments from employee.assignedOrders.orderKey.
    const assigned = {
        orderKey: order.orderKey,
        orderId: order.orderId,
        clientKey: order.clientTag,
        employeeName: employee.name,
        employeeKey: employee.tag,
        usertag: usertag
    };
    output: employees (0 or more)
    feature: select all employees working on this workorder of this client
    */
    exports.selectCoworkers = functions.https.onCall((data, context) => {
         const order = data.order;
         console.log(order);
         let  usertag = order.usertag;
         let  employeeKey = order.employeeKey;
         let  selectedClientKey = order.clientKey;
         let  selectedOrderKey = order.orderKey;

         const employeePath = "repos/" + usertag + "/employees";
         let coworkers = {};

         return admin.database().ref(employeePath).once('value').then ((snapshot) => {
             const employeeList = snapshot.val();

             for (var employeekey in employeeList) {
                  //coworkers[employeekey] = {};
                  let orders = employeeList[employeekey].assignedOrders;
                  for (var orderkey in orders) {
                       if (orderkey === selectedOrderKey && orders[orderkey].clientKey === selectedClientKey) {
                          coworkers[employeekey] = {};
                          coworkers[employeekey]["employeeKey"] =  employeekey;
                          coworkers[employeekey]["name"] = employeeList[employeekey].name;
                          coworkers[employeekey]["orderKey"] = selectedOrderKey;
                       }
                  }
             }
             console.log(coworkers);
             return { coworkers: coworkers};
         });
    });

    /*
    input: 1 assignments from employee.assignedOrders.orderKey.
    const assigned = {
        orderKey: order.orderKey,
        orderId: order.orderId,
        clientKey: order.clientTag,
        employeeName: employee.name,
        employeeKey: employee.tag,
        usertag: usertag
    };
    output: deliverys of this selectedOrderKey (0 or more)
    feature: select all deliverys of this workorder
    */
    exports.selectDeliverys = functions.https.onCall((data, context) => {
         const order = data.order;
         console.log(order);
         let  usertag = order.usertag;
         //let  employeeKey = order.employeeKey;
         let  selectedClientKey = order.clientKey;
         let  selectedOrderKey = order.orderKey;

         const deliveryPath = "repos/" + usertag + "/clients/data/" + selectedClientKey + "/deliverys";
         let deliverys = {};

         return admin.database().ref(deliveryPath).once('value').then ((snapshot) => {
             const deliveryList = snapshot.val();

             for (var deliverykey in deliveryList) {
                  //deliverys[deliverykey] = {};
                  let delivery = deliveryList[deliverykey];
                  if (delivery.linkedOrderKey === selectedOrderKey) {
                          deliverys[deliverykey] = {};
                          deliverys[deliverykey]["employeeKey"] =  delivery.employeeKey;
                          deliverys[deliverykey]["employeeName"] = delivery.employee;
                          deliverys[deliverykey]["deliveryKey"] = deliverykey;
                          deliverys[deliverykey]["date"] =  delivery.date;
                          deliverys[deliverykey]["deliveryId"] = delivery.deliveryId;
                          deliverys[deliverykey]["work"] = delivery.work;
                          deliverys[deliverykey]["linkedOrderId"] = delivery.linkedOrderId;
                          deliverys[deliverykey]["linkedOrderKey"] = delivery.linkedOrderKey;
                  }
             }
             console.log(deliverys);
             return { deliverys: deliverys};
         });
    });

    /*
    input: multiple assignments from employee.assignedOrders.orderKey.
    deliverys: {
        assignedEmployees: {
             employeeKey: assigned
        },
        delivery: {

      }
    }
    const assigned = {
        orderKey: order.orderKey,
        orderId: order.orderId,
        clientKey: order.clientTag,
        employeeName: employee.name,
        employeeKey: employee.tag,
        usertag: usertag
    };
    output: none
    features: copy delivery to
         data.clients.clientTag.deliverys
         and
         employees.employeeTag.assignedOrders.clientTag.ordertag.deliverys
    */
    exports.makeDeliverys = functions.https.onCall((data, context) => {
         const delivery = data.deliverys.delivery;
         const assignedEmployees = data.deliverys.assignedEmployees

         let selectedClientKey = null;
         let selectedEmployeeKey = null;
         let selectedOrderKey = null;
         let selectedUserTag = null;
         let selectedDeliveryKey = null;;

         for (var employeekey in assignedEmployees) {
              const { orderKey, clientKey, employeeKey, usertag } = assignedEmployees[employeekey];
              selectedClientKey = clientKey;
              selectedEmployeeKey = employeeKey;
              selectedOrderKey = orderKey;
              selectedUserTag = usertag;

              let employeePath =  "repos/" + usertag + "/employees/"
                                  + employeekey + "/assignedOrders/" + clientKey + "/"
                                  + orderKey + "/deliverys";
              const employeeRef = admin.database().ref(employeePath);
              const deliveryKey = employeeRef.getKey();
              selectedDeliveryKey = delievryKey;

              employeeRef.child(deliveryKey).push({...delivery, deliveryKey: deliveryKey});
         }

         const deliveryPath = "repos/" + selectedUserTag + "/clients/data/"
                             + selectedClientKey + "/deliverys/" + selectedDeliveryKey;
         deliveryRef = admin.database().ref(deliveryPath);
         deliveryRef.push({...delivery, deliveryKey: selectedDeliveryKey});
    });


    /*exports.helloWorld = functions.https.onRequest((request, response) => {
     console.log(request);
     response.send("Hello from Firebase!");
   });*/

    /*exports.addMessage = functions.https.onCall((data, context) => {
       const text = data.quote.text;
       const clientEmail = data.quote.email;
       // Authentication / user information is automatically added to the request.
       const uid = context.auth.uid;
       const name = context.auth.token.name || null;
       const picture = context.auth.token.picture || null;
       const email = context.auth.token.email || null;
       var nodemailer = require('nodemailer');
       var transporter = nodemailer.createTransport({
           service: 'gmail',
           auth: {
             user: 'mr.guoping.wu@gmail.com',
             pass: '=Bruce430!',
           }
       });
       var mailOptions = {
           from: email,
           to: clientEmail,
           subject: 'Quote',
           html: '<h1>Quote</h1><p>work: {{work}}</p><p>price: {{price}}</p><p>total: {{total}}</p>'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                return { emailresult: "fail"};
            } else {
               console.log('Email sent: ' + info.response);
               return { emailresult: "succuss"};
           }
        });


        return { text: "Guoping cleaned msg"};
   });*/

   /*exports.sendQuote = functions.https.onCall((data, context) => {
      const uid = context.auth.uid;
      const name = context.auth.token.name || null;
      const picture = context.auth.token.picture || null;
      const email = context.auth.token.email || null;
      const token = context.auth.token || null;
      console.log(name);
      console.log(email);
      //console.log(uid);
      //console.log(token);
      //console.log(data.quote);

      const email1 = email.replace(/[.,#$\[\]@ ]/g,'');
      const name1 = name.replace(/[.,#$\[\]@ ]/g,'');
      const usertag = (name1 + '+' + email1).toLowerCase();
      console.log(usertag);

      const text = data.quote.text;
      const price = data.quote.price;
      const taxes = data.quote.taxes;
      const total = data.quote.total;
      const work = data.quote.work;
      const clientEmail = data.quote.email;
      // Authentication / user information is automatically added to the request.
      //const uid = context.auth.uid;
      //const name = context.auth.token.name || null;
      //const picture = context.auth.token.picture || null;
      //const email = context.auth.token.email || null;
      //console.log(name);
      console.log(price);
      console.log(taxes);
      console.log(total);
      console.log(work);
      //console.log(data.quote);

      var nodemailer = require('nodemailer');

     /* var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'mr.guoping.wu@gmail.com',
            pass: '=Bruce430!',
          }
      });*/

     /* var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                XOAuth2: {
                    user: "mr.guoping.wu@gmail.com",
                    clientId: "1088029675584-nq1tuerdrl96b0f7n7ahu35cjvltk1i8.apps.googleusercontent.com",
                    clientSecret: "x2N2d4mDfLwwyhMiZdCNSYxp",
                    refreshToken: "1/yvD7nGKdRilixLq7qp0qqfwuxlh8rIWRfY5cnwgUpX0"
                }
            },
            debug: true
        });


      console.log("transporter configured");

      var mailOptions = {
          from: 'info@jc.com',
          to: 'info@shop1234.net',
          subject: 'Quote',
          html: '<p>Your html here</p>'
       };

       console.log("mailOption configured");

       transporter.sendMail(mailOptions, function(error, info){
           if (error) {
               console.log(error);
               return { emailresult: "fail"};
           } else {
              console.log('Email sent: ' + info.response);
              return { emailresult: "succuss"};
          }
       });


       //return { text: "Guoping cleaned msg"};

       // Create a SMTP transport object
       /*var transport = nodemailer.createTransport("SMTP", {
               service: 'Gmail',
               auth: {
                   user: "mr.guoping.wu@gmail.com",
                   pass: "=Bruce430!"
               }
           });

       console.log('SMTP Configured');

       // Message object
       var message = {

           // sender info
           from: email,

           // Comma separated list of recipients
           to: clientEmail,

           // Subject of the message
           subject: 'Quote', //

           headers: {
               'X-Laziness-level': 1000
           },


           // HTML body
           html: '<h1>Quote</h1><p>work: {{work}}</p><p>price: {{price}}</p><p>total: {{total}}</p>'

       };

       console.log('Sending Mail');
       transport.sendMail(message, function(error){
           if(error){
               console.log('Error occured');
               console.log(error.message);
               return;
           }
           console.log('Message sent successfully!');

           return { text: "quote sent"};
       );*/

       // This is the easiest way to send mail

       /*var mail = require("nodemailer").mail;

       mail({
       from: email, // sender address
       to: clientEmail, // list of receivers
       subject: "Quote", // Subject line
       html: '<h1>Quote</h1><p>work: {{work}}</p><p>price: {{price}}</p><p>total: {{total}}</p>'
     });*/
   /*}); */
