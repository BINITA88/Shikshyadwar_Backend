const stripe=require('stripe')(process.env.STRIPE_SECRETE_KEY)

exports.processPayment = async (req, res) => {
    try {
      const { amount } = req.body; // Get amount from frontend
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // Amount in paisa (100 = Rs.1)
        currency: "inr",
        metadata: { integration_check: "accept_a_payment" }
      });
  
      console.log("✅ Payment Intent Created:", paymentIntent.id);
      
      res.status(200).json({ success: true, client_secret: paymentIntent.client_secret });
    } catch (error) {
      console.error("❌ Payment Error:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };


// send staripe api to fronted 
exports.sendStripeApi=async(req,res)=>{
    res.json({stripeApiKey:process.env.STRIPE_API_KEY})
}
