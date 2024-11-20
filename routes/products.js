const  express = require('express');
// create a router
const router = express.Router(); 

const productService = require('../service/productService')

// a router contaains routes
// it can contain PUT, GET, PATCH, POST, DESTROY 
router.get('/', async function(req,res){
   try {
    const products = await productService.getAllProducts();
    res.json(products);
   } catch (error) {
    console.log(error);
    res.sendStatus(500);
   }
})

router.get('/:id', async function(req,res){
   try {
    const products = await productService.getProductById(req.params.id); 
    res.json(products);
   } catch (error) {
    res.sendStatus(500);
   }
})


// export the router object
module.exports = router;