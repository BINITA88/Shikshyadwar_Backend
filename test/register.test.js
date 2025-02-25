const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const server = require('../srvr'); // Ensure correct server file
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { expect } = chai;
chai.use(chaiHttp);

describe('User Authentication', function () {
    this.timeout(40000); // ✅ Increased timeout to 20 seconds

    let userStub, bcryptStub, jwtStub;

    beforeEach(() => {
        userStub = sinon.stub(User, 'findOne');
        bcryptStub = sinon.stub(bcrypt, 'compare');
        jwtStub = sinon.stub(jwt, 'sign');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should register a new user successfully', async function () {
        const mockUser = new User({
            _id: '65d12c3482345f1234567890',
            name: "Test User",
            email: "test@example.com",
            password: "hashedpassword",
            contact_no: "1234567890"
        });

        const saveStub = sinon.stub(User.prototype, 'save').resolves(mockUser);

        const res = await chai.request(server)
            .post('/api/users/signup') // ✅ Ensure correct endpoint
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
                contact_no: "1234567890"
            });

        console.log("📌 Register Response:", res.status);
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal("User created successfully");

        saveStub.restore();
    });

    it('should log in an existing user successfully', async function () {
        const mockUser = {
            _id: '65d12c3482345f1234567890',
            name: "Test User",
            email: "test@example.com",
            password: "$2b$10$hashedpassword",
            contact_no: "1234567890",
            isAdmin: false
        };

        userStub.resolves(mockUser);
        bcryptStub.resolves(true);
        jwtStub.returns("mocked-jwt-token");

        const res = await chai.request(server)
            .post('/api/users/signin')
            .send({ email: "test@example.com", password: "password123" });

        console.log("📌 Login Response:", res.status);
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal("Login successful...");
        expect(res.body.token).to.equal("mocked-jwt-token");
    });
});
