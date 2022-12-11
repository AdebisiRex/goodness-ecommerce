const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
    console.log("Goodness Ecommerce is now online at localhost:"+ PORT);
});



const userRoute = require("./routes/user.route")
app.use("/user", userRoute);

app.get("/", (req, res)=>{
    res.send("They don't know fr")
})


mongoose.connect(URI, (err) => {
    console.log("Mongoose is now online");
});
