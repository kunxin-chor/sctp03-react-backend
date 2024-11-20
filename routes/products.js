const  express = require('express');
// create a router
const router = express.Router(); 

// a router contaains routes
// it can contain PUT, GET, PATCH, POST, DESTROY 
router.get('/', function(req,res){
    res.json({
        message:"GET products"
    })
})

router.get('/:id', function(req,res){
    res.json({
        message:"GET product with id" + req.params.id
    })
})


// export the router object
module.exports = router;