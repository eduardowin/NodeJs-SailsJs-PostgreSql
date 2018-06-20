


module.exports = {
  sendMail:function(p_from, p_to, p_subject, p_content) {


    /*
    // clean it and return
    console.log('REGISTRE LA SOLICITUD DE INFORMACIÓN')
    var helper = require('sendgrid').mail;
    var from_email = new helper.Email(p_from);
    var to_email = new helper.Email(p_to);
    var content = new helper.Content('text/html', p_content);
    var mail = new helper.Mail(from_email, p_subject, to_email, content);

    // var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var sg = require('sendgrid')('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');
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    sg.API(request, function(error, response) {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });
    */


    var sgMail = require('@sendgrid/mail');
    sgMail.setApiKey('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');
    const msg = {
      to: p_to,
      from: p_from,
      subject: p_subject, 
      html: p_content,
    };
    sgMail.send(msg);
 
  } 

}
