const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
require('dotenv').config();
const server = require('../srvr'); // Ensure correct path to your server file
const Schedule = require('../models/scheduleModels');

const { expect } = chai;
chai.use(chaiHttp);

describe('📅 Schedule API Tests', function () {
    this.timeout(20000); // ✅ Increased timeout

    let scheduleId;

    before(async function () {
        console.log("🔄 Connecting to Test Database...");

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.TEST_DATABASE, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        await Schedule.deleteMany({}); // ✅ Clear all schedules before testing
        console.log("✅ Schedule Database Cleared.");
    });

    /** ✅ **TEST 1: Create a new schedule** **/
    it('should create a new schedule', async function () {
        const scheduleData = {
            day: "Monday",
            time: "10:00 AM - 12:00 PM",
            subject: "Mathematics",
            type: "active"
        };

        const res = await chai.request(server)
            .post('/api/schedules/addschedule')
            .send(scheduleData);

        console.log("📌 Response Status:", res.status);
        console.log("📌 Response Body:", res.body);

        expect([200, 201]).to.include(res.status);
        expect(res.body).to.have.property('day', scheduleData.day);
        expect(res.body).to.have.property('subject', scheduleData.subject);

        scheduleId = res.body._id; // ✅ Store schedule ID for further tests
    });

    /** ✅ **TEST 2: Fetch all schedules** **/
    it('should retrieve all schedules', async function () {
        const res = await chai.request(server)
            .get('/api/schedules/getschedule');

        console.log("📌 GET /schedules Response Status:", res.status);
        console.log("📌 GET /schedules Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.schedules.length).to.be.at.least(1);
    });

    /** ✅ **TEST 3: Update a schedule** **/
    it('should update a schedule', async function () {
        const updatedSchedule = {
            day: "Tuesday",
            time: "1:00 PM - 3:00 PM",
            subject: "Science",
            type: "paused"
        };

        const res = await chai.request(server)
            .put(`/api/schedules/updateschedule/${scheduleId}`)
            .send(updatedSchedule);

        console.log("📌 PUT /schedules/update Response Status:", res.status);
        console.log("📌 PUT /schedules/update Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('day', updatedSchedule.day);
        expect(res.body).to.have.property('subject', updatedSchedule.subject);
        expect(res.body).to.have.property('type', updatedSchedule.type);
    });

    /** ✅ **TEST 4: Delete a schedule** **/
    it('should delete a schedule', async function () {
        const res = await chai.request(server)
            .delete(`/api/schedules/deleteschedule/${scheduleId}`);

        console.log("📌 DELETE /schedules/delete Response Status:", res.status);
        console.log("📌 DELETE /schedules/delete Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Schedule deleted successfully');
    });

    after(async function () {
        console.log("🗑️ Cleaning up test data...");
        await mongoose.connection.close();
    });
});
