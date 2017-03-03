var _ = require('lodash');
var nodemailer = require('nodemailer');


const RESPONSE = {
  OK : {
    status : 'ok',
    message: 'You have successfully subscribed!',
  },
  DUPLICATE : {
    status : 'error',
    message : 'You are already subscribed.'
  },
  ERROR : {
    status : 'error',
    message: 'Something went wrong. Please try again.'
  }
};

module.exports = function(context, cb){

  var email = context.query.email;

  var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

  var mailOptions = {
    to: 'email',
    subject: 'Hello ✔',
    text: 'Funny gif',
    html: '<img src="http://cdn.fansided.com/wp-content/blogs.dir/369/files/2016/09/FB-final-trailer-niffler-slide.gif">'
  };

  if(email){

    context.storage.get(function(err, data){
      if(err){
        cb(null, RESPONSE.ERROR);
      }

      data = data || [];

      if(_.indexOf(data, email)){
        data.push(email);

        context.storage.set(data, function(err){
          if(err){
            cb(null, RESPONSE.ERROR);
          } else {
            cb(null, RESPONSE.OK);
            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                return console.log(error);
              }
                console.log('Message sent: ' + info.response);
            });
          }
        })
      } else {

        cb(null, RESPONSE.DUPLICATE);
      }
    })
  } else {

    cb(null, RESPONSE.ERROR)
  }
};
