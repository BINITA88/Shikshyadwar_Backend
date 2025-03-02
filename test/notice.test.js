
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../srvr'); // Ensure it's CommonJS
const Notification = require('../models/noticeModel');
require('dotenv').config();

const { expect } = chai;
chai.use(chaiHttp);

describe('🔔 Notification API Tests', function () {
    this.timeout(20000); // ✅ Increased timeout

    let notificationId;

    before(async function () {
        console.log("🔄 Connecting to Test Database...");

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.TEST_DATABASE, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        await Notification.deleteMany({});
        console.log("✅ Notification Database Cleared.");
    });

    /** ✅ **TEST 1: Verify Empty Notification Database** **/
    it('should verify that there are 0 notifications in the DB', async function () {
        const count = await Notification.countDocuments();
        console.log(`📌 Initial Notification Count: ${count}`);
        expect(count).to.equal(0);
    });

    /** ✅ **TEST 2: Create a Notification** **/
    it('should successfully create a new notification', async function () {
        const notification = { message: "Test notification message" };

        const res = await chai.request(server)
            .post('/api/notifications/create')
            .send(notification);

        console.log("📌 Response Status:", res.status);
        console.log("📌 Response Body:", res.body);

        expect([200, 201]).to.include(res.status);
        expect(res.body).to.have.property('message', "Notification created successfully");
        expect(res.body).to.have.property('newNotification');
        expect(res.body.newNotification).to.have.property('message', notification.message);

        notificationId = res.body.newNotification._id; // ✅ Store the notification ID for update/delete tests
        expect(notificationId).to.exist;
    });

    /** ✅ **TEST 3: Retrieve All Notifications** **/
    it('should GET all notifications and return an array', async function () {
        const res = await chai.request(server)
            .get('/api/notifications/');

        console.log("📌 GET Response Status:", res.status);
        console.log("📌 GET Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(1);
    });

    /** ✅ **TEST 4: Update a Notification** **/
    it('should update an existing notification', async function () {
        expect(notificationId).to.exist;

        const updatedNotification = { message: "Updated notification message" };

        const res = await chai.request(server)
            .put(`/api/notifications/update/${notificationId}`)
            .send(updatedNotification);

        console.log("📌 PUT Response Status:", res.status);
        console.log("📌 PUT Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Notification updated successfully');
        expect(res.body.updatedNotification).to.have.property('message', updatedNotification.message);

        // ✅ Verify in DB
        const updatedData = await Notification.findById(notificationId);
        expect(updatedData.message).to.equal(updatedNotification.message);
    });

    /** ✅ **TEST 5: Delete a Notification** **/
    it('should delete an existing notification', async function () {
        expect(notificationId).to.exist;

        const res = await chai.request(server)
            .delete(`/api/notifications/delete/${notificationId}`);

        console.log("📌 DELETE Response Status:", res.status);
        console.log("📌 DELETE Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Notification deleted successfully');

        // ✅ Verify that notification is removed from DB
        const count = await Notification.countDocuments();
        console.log(`📌 Final Notification Count: ${count}`);
        expect(count).to.equal(0);
    });

    after(async function () {
        await Notification.deleteMany({});
        console.log("🗑️ Notification Database Cleared.");
        await mongoose.connection.close();
    });
});
