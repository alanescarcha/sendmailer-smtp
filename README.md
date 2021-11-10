# SendMailer-SMTP

Send mails through SMTP you can use the frontend form or the API :)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/alanescarcha/sendmailer-smtp)

## Features
- Send mails using SMTP with backend API
- Send mails using SMTP with frontend Form
- SSL, TLS Support
- Text and HTML body
- Multiple receivers
- Nodemailer module

## Installation

Using NPM:
```bash
cd sendmailer-smtp-main
npm install
npm run start
```
Using Yarn:
```bash
cd sendmailer-smtp-main
yarn
yarn start
```

## Usage with Axios (POST request)

```javascript
const axios = require('axios');

axios.post('https://sendmailer-smtp.herokuapp.com/api/v1', {
    //SMTP config
    host: 'smtp.gmail.com', //SMTP Host server
    port: '465', //SMPT Port server
    secure: 'ssl', // SSL, TLS or none (No capital letters)
    user: 'user@example.com', //SMTP User
    password: 'yourpassword', //SMTP Password

    //Email config
    name: 'Example Name', //from email Name
    from: 'user@example.com', //email from address
    to: 'friend@example.com', //to email address
    subject: 'Subject example', //email subject
    typeMSG: 'text', //text or html
    message: "Hey! It's an example using SendMailer-SMTP :)", //your message
})
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
