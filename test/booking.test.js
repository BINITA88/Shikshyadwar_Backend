const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../srvr');
const Booking = require('../models/bookingModel');
const dotenv = require('dotenv');

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);

describe('📌 Booking API Tests', function () {
    this.timeout(60000); // ✅ Increased timeout to 60s

    let bookingId;
    let userId = "605c72b56b9f3c6f7c5e8a6b"; // Replace with a valid user ID from DB

    before(async function () {
        console.log("🔄 Connecting to Test Database...");

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.TEST_DATABASE, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        await Booking.deleteMany({});
        console.log("✅ Booking Database Cleared.");
    });

    /** ✅ **TEST 1: Ensure database starts empty** **/
    it('should verify that there are 0 bookings in the DB', async function () {
        const count = await Booking.countDocuments();
        console.log(`📌 Initial Booking Count: ${count}`);
        expect(count).to.equal(0);
    });

    /** ✅ **TEST 2: Create a Booking** **/
    it('should successfully add a booking to the database', async function () {
        const bookingData = {
            Address: "123 Main St",
            city: "New York",
            country: "USA",
            phone: "1234567890",
            totalPrice: 500,
            user: userId, // Ensure this user ID exists in your DB
            shift: "morning",
            classMode: "online",
            interestedInCounseling: true
        };

        const res = await chai.request(server)
            .post('/api/postbooking')
            .send(bookingData);

        console.log("📌 Response Status:", res.status);
        console.log("📌 Response Body:", res.body);

        expect([200, 201]).to.include(res.status);
        expect(res.body).to.have.property('country', bookingData.country);

        bookingId = res.body._id; // ✅ Store booking ID for update & get tests
        console.log(`📌 Stored booking ID: ${bookingId}`);

        expect(bookingId).to.exist;
    });

    /** ✅ **TEST 3: Fetch Booking List (Ensure At Least 1 Booking Exists)** **/
    it('should retrieve all bookings', async function () {
        const res = await chai.request(server)
            .get('/api/bookinglist');

        console.log("📌 GET /bookinglist Response Status:", res.status);
        console.log("📌 GET /bookinglist Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(1);
    });

    
    /** ✅ **TEST 5: Get User Bookings** **/
    it('should retrieve bookings for a specific user', async function () {
        expect(userId).to.exist;

        const res = await chai.request(server)
            .get(`/api/userbookings/${userId}`);

        console.log("📌 GET /userbookings Response Status:", res.status);
        console.log("📌 GET /userbookings Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(1);
    });

    /** ✅ **TEST 6: Update Booking Status** **/
    it('should update the booking status', async function () {
        expect(bookingId).to.exist;

        const updatedBooking = {
            status: "confirmed"
        };

        const res = await chai.request(server)
            .put(`/api/updatestatus/${bookingId}`)
            .send(updatedBooking);

        console.log("📌 PUT /updatestatus Response Status:", res.status);
        console.log("📌 PUT /updatestatus Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status', updatedBooking.status);

        // ✅ Ensure DB has updated data
        const updatedData = await Booking.findById(bookingId);
        expect(updatedData.status).to.equal(updatedBooking.status);
    });

    after(async function () {
        console.log("🗑️ Test Database Cleared.");
        await mongoose.connection.close();
    });

     /** ✅ **TEST 6: Delete Booking** **/
     it('should delete the booking', async function () {
        expect(bookingId).to.exist;

        const res = await chai.request(server)
            .delete(`/api/deletebooking/${bookingId}`);

        console.log("📌 DELETE Response Status:", res.status);
        console.log("📌 DELETE Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Booking deleted successfully');
    });

    after(async function () {
        console.log("🗑️ Test Database Cleared.");
        await mongoose.connection.close();
    });
});
// booking seat