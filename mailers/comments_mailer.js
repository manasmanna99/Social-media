const nodeMailer = require('../config/nodemailer');

//this is another way of exporting modules
exports.newComment = (comment)=>{
    console.log('Inside newComment mailer',comment);

    nodeMailer.transporter.sendMail({
        from: 'manastemp1999@gmail.com',
        to: 'madanmanna123456@gmail.com',
        subject: "New Comment Published",
        body: '<h1>New comment is published</h1>'
    }, (err, info)=>{
        if(err){
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent', info);
        return;
    })
}
