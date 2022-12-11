const nodemailer = require("nodemailer");

const resetEmail = (name, link)=>{
    return `<body>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;1,500;1,900&display=swap");
  
      
      body {
        font-family: "Roboto", sans-serif;
        padding: 5%;
        background-color:#fff;
        display: grid;
        place-items: center;
      }
      .general {
        width: 100%;
        max-width: 500px;
    
      main {
        line-height: 1.5rem;
        text-align: justify;
        box-sizing: border-box;
      }
      @media screen and (max-width: 750px) {
        main {
          text-align: start;
        }
      }
      h1 {
        text-align: center;
        font-weight: 500;
        margin: 50px;
        font-size: 1.1rem;
        /* letter-spacing: 2px; */
      }
      h2 {
        font-weight: 500;
        margin: 20px 0px;
      }
      
      a {
        color: blue;
        text-decoration: none;
      }
      a:hover {
        color: rgba(0, 0, 255, 0.685);
        text-decoration: underline;
      }
      
      
    </style>
    <div class="general">
      <header class="logo">
        <p>Goodness E-commerce</p>
      </header>
      <main>
        <h1>Reset Password</h1>
        <h2>Hi ${name}</h2>
        <p>
          You have requested to reset your nerdshelve password, if you didn"t make this request, kindly ignore this message.
  
          This message expires in 20mins
          
        </p>
        <p>
          <a href="${link}">
           Click here to Create New Password</a
          >
        </p>
  
        <section>
         
          <p>Goodness E-commerce</p>
        </section>
      </main>
     
      
    </div>
  </body>
    ` 
  }


  const sendMail = ({ receiver_mail, msg_subject, message }) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        tyoe: "OAuth2",
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });
    let messageObj = {
      from: "Goodness E-commerce donotreply@nerdshelves.com ", 
      to: receiver_mail, 
      subject: msg_subject, // Subject line
      //   text: "Hello to me myself", // plain text body
      html: message, // html body
    };
  
    transporter.sendMail(messageObj, (err, success) => {
      if (err) {
        return false;
        console.log(err, "error mess");
      } else {
        return true;
        console.log("The message was sent");
      }
    });
  };

  module.exports={resetEmail, sendMail}