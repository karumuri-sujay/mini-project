const express=require("express");
const authController=require("../controllers/auth");

const app=express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const router=express.Router();

const accountSid = 'ACb107ee97899385cd835d9a4d134854ab';
const authToken = 'b9d27310cb2c60b916633ce57b83cfb0';
const twilio=require('twilio');


router.get("/",authController.isLoggedIn,(req,res)=>{
    // no need of hbs
    res.render("index",{
        user:req.user
    });
});

router.get("/register",authController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render("index",{
            user:req.user
        });
    }
    else{
        res.render("register");
    }
});

router.get("/login",authController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render("index",{
            user:req.user
        });
    }
    else{
        res.render("login");
    }
});

router.get("/about",authController.isLoggedIn,(req,res)=>{
    res.render("about",{
        user:req.user
    });
});

router.get("/contact",authController.isLoggedIn,(req,res)=>{
    res.render("contact",{
        user:req.user
    });
});

router.get("/message",authController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render("message",{
            user:req.user
        });
    }
    else{
        res.redirect("login");
    }
});

router.post("/send-message",(req,res)=>{
    const msg=req.body.messageInput;
    console.log(msg);
    let output=message(msg);
    if(output){
        res.render("message",{
            message:"Message was not send. Try to send it again"
        });
    }
    else{
        res.render("messageSent");
    }
    // res.send("Message sent... Redirecting to Home Page");
    // res.render("index");
})

//middle ware isLoggedIn
router.get("/profile",authController.isLoggedIn,(req,res)=>{
    // console.log(req.message);
    if(req.user){
        res.render("profile",{
            user: req.user
        });
    }
    else{
        res.redirect("login");
    }
});

function message(msg){
    const client = new twilio(accountSid, authToken);
    let sid;
    client.messages.create({
        body: msg,
        to: '+919182387304',
        from: '+18184084586',
    }).then((message) => sid=message.sid);
    return sid;
}

module.exports=router;