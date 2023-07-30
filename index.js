import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import express, { json } from "express";

var serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Content-type', "application/json");
    next();
})

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.post("/send", function (req, res) {
    const receivedToken = req.body.fcmToken;
    const message = {
        notification: {
            title: "Notify",
            body: "this a test notification"
        },
        token: receivedToken
    }

    getMessaging()
        .send(message)
        .then((response) => {
            res.status(200).json({
                message: "Successfuly sent message",
                token: receivedToken,
            });

            console.log("Successfuly sent message:", response);
        })
        .catch((error) => {
            res.status(400);
            res.send(error);
            console.log("Error sending message:", error);
        })

});


app.listen(3000, function () {
    console.log("Server started on port 3000");
})