const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req,res)=>{
    let data = {
        members: [{
            "email_address": req.body.email,
            "status": "subscribed",
            "merge_fields": {
                "FNAME": req.body.fname,
                "LNAME": req.body.lname
              }
        }]
    }
    const jsonData = JSON.stringify(data)
    const url = `https://us20.api.mailchimp.com/3.0/lists/${process.env.uniqueid}`
    const options = {
        method: "POST",
        auth: `jotaro:${process.env.apikey}`
    }
    //above the auth is according to the syntax off https documentaion of options. jotaro here can be any name
    const request = https.request(url, options, (response)=>{
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }
        
        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData)
    request.end()
})
app.post("/failure", (req,res)=>{
    re.redirect("/")
})
app.listen(3000, ()=>{
    console.log("Newsletter server is running")
})
