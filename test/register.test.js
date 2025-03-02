const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const server = require('../srvr'); // Ensure this is the correct server file
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { expect } = chai;
chai.use(chaiHttp);

describe('User Authentication', function () {
    this.timeout(60000); // ✅ Increased timeout to 60 seconds to avoid timeout errors

    let userStub, bcryptStub, jwtStub;

    beforeEach(() => {
        // Stubbing necessary database and auth-related methods
        userStub = sinon.stub(User, 'findOne');
        bcryptStub = sinon.stub(bcrypt, 'compare');
        jwtStub = sinon.stub(jwt, 'sign');
    });

    afterEach(() => {
        // Restore original behavior after each test
        sinon.restore();
    });

    // Test for user registration
    it('should register a new user successfully', async function () {
        // Mock user data to simulate the User model behavior
        const mockUser = new User({
            _id: '65d12c3482345f1234567890',
            name: "Test User",
            email: "test@example.com",
            password: "hashedpassword",
            contact_no: "1234567890"
        });

        // Stub the `save` method to resolve with the mock user
        const saveStub = sinon.stub(User.prototype, 'save').resolves(mockUser);

        // Perform the API request to register the user
        const res = await chai.request(server)
            .post('/api/users/signup')
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
                contact_no: "1234567890"
            });

        // Assert the status and response
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal("User created successfully");

        // Restore the save stub after the test
        saveStub.restore();
    });

    // Test for user login
    it('should log in an existing user successfully', async function () {
        // Mock an existing user with hashed password
        const mockUser = {
            _id: '65d12c3482345f1234567890',
            name: "Test User",
            email: "test@example.com",
            password: "$2b$10$hashedpassword", // Simulating a hashed password
            contact_no: "1234567890",
            isAdmin: false
        };

        // Simulate the database returning this user
        userStub.resolves(mockUser);


        bcryptStub.resolves(true);

        jwtStub.returns("mocked-jwt-token");

        const res = await chai.request(server)
            .post('/api/users/signin')
            .send({ email: "test@example.com", password: "password123" });

        expect(res).to.have.status(201);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal("Login successful...");
        expect(res.body.token).to.equal("mocked-jwt-token");
    });
});
