//Import database code that we are testing
import * as db from "../database.js";

//Set up Chai library
import chai from "chai";
let should = chai.should();
let assert = chai.assert;
let expect = chai.expect;

//Wrapper for all database tests
describe("Database", () => {
	//Test usersFindAll method in database
	describe("#usersFindAll", () => {
		it("should return all of the users in the database", async () => {
			const results = await db.usersFindAll();

			results.should.be.a("array");

			if (results.length > 1) {
				results[0].should.have.property("username");
				results[0].should.have.property("password");
				results[0].should.have.property("email");
				results[0].should.have.property("name");
				results[0].should.have.property("phone");
			}
		});
	});

	//Test usersInsert method in database
	describe("#usersInsert", () => {
		it("should add a user to the database", async () => {
			const userUsername = Math.random().toString(36).substring(2, 15);
			const userName = Math.random().toString(36).substring(2, 15);
			const userPassword = Math.random().toString(36).substring(2, 20);
			const userPhone = Math.floor(Math.random() * 1000000000000);
			const userEmail =
				Math.random().toString(36).substring(2, 15) +
				"@" +
				Math.random().toString(36).substring(2, 5) +
				".com";

			const testUser = {
				phone: userPhone,
				email: userEmail,
				username: userUsername,
				name: userName,
				password: userPassword,
			};

			let result = await db.usersInsert(testUser);
			expect(result).to.equal(1);

			result = await db.userdb.find({ name: userName }).toArray();
			expect(result.length).to.equal(1);

			result = await db.userdb.deleteOne({ name: userName });
			expect(result.deletedCount).to.equal(1);
		});
	});
});
