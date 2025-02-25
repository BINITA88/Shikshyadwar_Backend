import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../srvr.js';
import Category from '../models/categoryModel.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const { expect } = chai;
chai.use(chaiHttp);

describe('📂 Category API Tests', function () {
    this.timeout(20000); // ✅ Increased timeout

    let categoryId;

    before(async function () {
        console.log("🔄 Connecting to Test Database...");

        let retries = 3;
        while (mongoose.connection.readyState === 0 && retries > 0) {
            try {
                await mongoose.connect(process.env.TEST_DATABASE, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                console.log("✅ MongoDB Connected!");
                break;
            } catch (err) {
                console.log(`🔄 Retrying MongoDB connection (${3 - retries + 1}/3)`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // ✅ Wait 3 seconds
                retries--;
            }
        }

        if (mongoose.connection.readyState === 0) {
            console.error("❌ MongoDB connection failed. Skipping tests.");
            this.skip();
        }

        await Category.deleteMany({}); // ✅ Clear database before running tests
        console.log("✅ Database Cleared.");
    });

    /** ✅ **TEST 1: Ensure database starts empty** **/
    it('should verify that there are 0 categories in the DB', async function () {
        const count = await Category.countDocuments();
        console.log(`📌 Initial Category Count: ${count}`);
        expect(count).to.equal(0);
    });

    /** ✅ **TEST 2: Create a Category** **/
    it('should successfully add a category to the database', async function () {
        const category = {
            category_name: "Technology"
        };

        const res = await chai.request(server)
            .post('/api/postcategory')
            .send(category);

        console.log("📌 Response Status:", res.status);
        console.log("📌 Response Body:", res.body);

        expect([200, 201]).to.include(res.status);
        expect(res.body).to.have.property('category_name', category.category_name);

        categoryId = res.body._id; // ✅ Store category ID for update and delete tests

        const count = await Category.countDocuments();
        console.log(`📌 Final Category Count: ${count}`);
        expect(count).to.equal(1);
    });

    /** ✅ **TEST 3: Fetch Category List** **/
    it('should retrieve all categories', async function () {
        const res = await chai.request(server)
            .get('/api/categoryList');

        console.log("📌 GET /categoryList Response Status:", res.status);
        console.log("📌 GET /categoryList Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(1);
    });

    /** ✅ **TEST 4: Update a Category** **/
    it('should update the category name', async function () {
        const updatedCategory = {
            category_name: "Updated Technology"
        };

        const res = await chai.request(server)
            .put(`/api/updateCategory/${categoryId}`)
            .send(updatedCategory);

        console.log("📌 PUT /updateCategory Response Status:", res.status);
        console.log("📌 PUT /updateCategory Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('category_name', updatedCategory.category_name); // ✅ Check category name

        // Verify category is updated in DB
        const updatedData = await Category.findById(categoryId);
        expect(updatedData.category_name).to.equal(updatedCategory.category_name);
    });

    /** ✅ **TEST 5: Delete a Category** **/
    it('should delete the category', async function () {
        const res = await chai.request(server)
            .delete(`/api/deleteCategory/${categoryId}`);

        console.log("📌 DELETE /deleteCategory Response Status:", res.status);
        console.log("📌 DELETE /deleteCategory Response Body:", res.body);

        expect(res).to.have.status(200);
        expect(["category deleted", "Category deleted successfully"]).to.include(res.body.message); // ✅ Allow both messages

        const count = await Category.countDocuments();
        console.log(`📌 Final Category Count: ${count}`);
        expect(count).to.equal(0);
    });

    after(async function () {
        console.log("🗑️ Test Database Cleared.");
        await mongoose.connection.close();
    });
});
