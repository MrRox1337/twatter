//Import database code that we are testing
import { app } from "../webservice.js";

//Set up Chai library
import chai from "chai";
let should = chai.should();
let assert = chai.assert;
let expect = chai.expect;

//Set up Chai for testing web service
import chaiHttp from "chai-http";
chai.use(chaiHttp);

//Wrapper for all web service tests
describe("Web Service", () => {
	//Test of GET request sent to /users
	describe("/GET M00983641/users", () => {
		it("should GET all the users", (done) => {
			chai.request(app)
				.get("/M00983641/users")
				.end((err, response) => {
					expect(err).to.equal(null);

					response.should.have.status(200);

					let responseObject = JSON.parse(response.text);

					responseObject.should.be.a("array");

					if (responseObject.length > 1) {
						responseObject[0].should.have.property("username");
						responseObject[0].should.have.property("password");
						responseObject[0].should.have.property("name");
						responseObject[0].should.have.property("phone");
						responseObject[0].should.have.property("email");
					}

					done();
				});
		});
	});

	//Test of GET request sent to /posts
	describe("/GET M00983641/post", () => {
		it("should GET all the users", (done) => {
			chai.request(app)
				.get("/M00983641/post")
				.end((err, response) => {
					expect(err).to.equal(null);

					response.should.have.status(200);

					let responseObject = JSON.parse(response.text);

					responseObject.should.be.a("array");

					if (responseObject.length > 1) {
						responseObject[0].should.have.property("username");
						responseObject[0].should.have.property("content");
						responseObject[0].should.have.property("name");
						responseObject[0].should.have.property("likes");
					}

					done();
				});
		});
	});

	describe("/GET M00983641/post", () => {
		it("should GET all the users", (done) => {
			chai.request(app)
				.get("/M00983641/post")
				.end((err, response) => {
					expect(err).to.equal(null);

					response.should.have.status(200);

					let responseObject = JSON.parse(response.text);

					responseObject.should.be.a("array");

					if (responseObject.length > 1) {
						responseObject[0].should.have.property("username");
						responseObject[0].should.have.property("content");
						responseObject[0].should.have.property("name");
						responseObject[0].should.have.property("likes");
					}

					done();
				});
		});
	});
});
