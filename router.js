const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.status(201).send('Server up and running')
})

module.exports = router