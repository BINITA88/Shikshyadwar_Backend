const stripe=require('stripe')(process.env.STRIPE_SECRETE_KEY)

exports.processPayment=async(req,res)=>{
    const paymentIntent=await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:"npr",
        metadata:{integration_check:"accept_a_payment"}
    })

    // clent secreate kolagi lagi auta banauni fronted kolagi 

    res.json({client_secret:paymentIntent.client_secret})
}


// send staripe api to fronted 
exports.sendStripeApi=async(req,res)=>{
    res.json({stripeApiKey:process.env.STRIPE_API_KEY})
}
