const express = require('express');
const cors = require('cors')
const nodemailer = require('nodemailer');
const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: '*',
}
let errorResponse = {
    "code": "400",
    "response": "Error processing the request",
    "responseCode": "400"
}
let errorExit = false;

async function sendEmail(host, port, secure, user, password, name, from, to, subject, typemsg, message) {
    try {
        if (secure == 'ssl') {
            secure = true;
        } else {
            secure = false;
        }

        let transporter = await nodemailer.createTransport({
            host: host,
            port: port, //true for 465, false for other ports
            secure: secure,
            auth: {
                user: user,
                pass: password,
            }
        });

        if (typemsg == 'text') {
            try {
                var info = await transporter.sendMail({
                    from: `"${name}" <${from}>`, // sender address
                    to: to, // list of receivers
                    subject: subject, // Subject line
                    text: message // plain text body
                });
            } catch (error) {
                console.error(error);
                errorResponse = error;
            }
        } else if (typemsg == 'html') {
            try {
                var info = await transporter.sendMail({
                    from: `"${name}" <${from}>`, // sender address
                    to: to, // list of receivers
                    subject: subject, // Subject line
                    html: message // html body
                });
            } catch (error) {
                console.error(error);
                errorResponse = error;
            }
        }

        if (info) {
            console.log("Message sent: %s", info.messageId);
            errorExit = false;
        } else {
            console.error("Message not sent");
            errorExit = true;
        }
        // Message sent ID
    } catch (error) {
        console.error(error);
    }
}

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options('*', cors())

app.get('/', cors(), (req, res) => {
    res.render('index.html');
});
app.get('/api/v1/', cors(), (req, res) => {
    res.send('POST requests only!');
});

app.post('/api/v1', cors(), async (req, res) => {
    if (req.is('application/json')) {
        const response = await req.body;
        try {
            await sendEmail(
                response.host,
                response.port,
                response.secure,
                response.user,
                response.password,
                response.name,
                response.from,
                response.to,
                response.subject,
                response.typeMSG,
                response.message
            );
            if (errorExit) {
                res.status(400).send(errorResponse);
            } else {
                res.status(200).send('Email sent successfully!');
            }
        } catch (error) {
            if (errorResponse.responseCode == 534) {
                res.status(400).send(`
            Error sending the mail:
            Code: ${errorResponse.code}
            Response: ${errorResponse.response || errorResponse}
            Response code: ${errorResponse.responseCode}
            If you are using Gmail SMTP you must enable Access from unsecured applications.
            You can enable it here: https://myaccount.google.com/lesssecureapps
    
            Check the required fields or contact the administrator (github.com/alanescarcha).
            `);
            }
            res.status(400).send(`
        Error sending the mail:
        Code: ${errorResponse.code || 'None'}
        Response: ${errorResponse.response || errorResponse}
        Response code: ${errorResponse.responseCode || 'None'}

        Check the required fields or contact the administrator (github.com/alanescarcha).
        `);
            console.error(`Error app.post: ${error}`);
        }
    } else {
        res.status(400).send('Invalid content type, only JSON content type!');
        console.error("Message not sent, Invalid content type");
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
