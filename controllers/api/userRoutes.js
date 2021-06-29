const router = require("express").Router();
const User = require("../../models/User");

// --------------------- POST NEW USER ---------------------
router.post("/", async (req, res) => {
  try {
    console.log('body:',req.body);
    const dbUserData = await User.create(req.body);
    res.status(201).json(dbUserData);
  } catch (err) {
    res.status(401).json(err);
  }
});

// --------------------- POST LOGIN ---------------------
router.post('/login', async (req,res) => {
    try {
        console.log(req.body)
        const dbUserData = await User.findOne({
            where:
            {
                email: req.body.email
            }
        });
        if(!dbUserData){
            res.status(401).json({
                message: 'Incorrect email or password, please try again'
            })
            return
        };
        UserData = dbUserData.get({plain:true});
        console.log(UserData)
        console.log(req.body.password)
        
        const validPassword = await dbUserData.checkPassword(req.body.password);
        console.log('validPasword:',validPassword)
        
        if(!validPassword){
            res.status(400).json({
                message: 'Incorrect email or password, please try again'
            });
            return;
        };
        console.log('after')

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.userId = UserData.id;
            res.status(201).json({
                message:'You are logged in!'
            });
        });
    } catch(err){
        res.status(400).json(err);
    };
});

module.exports = router;