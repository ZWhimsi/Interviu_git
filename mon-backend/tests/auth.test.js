const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index");
const User = require("../src/models/User");

// Setup and teardown
beforeAll(async () => {
  // Connect to test database if not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(
      process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/interviu_test"
    );
  }
});

beforeEach(async () => {
  // Clear users collection before each test
  await User.deleteMany({});
});

afterAll(async () => {
  // Close connection after tests
  await mongoose.connection.close();
});

describe("Authentication Endpoints", () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "Password123",
    confirmPassword: "Password123",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("name", testUser.name);
      expect(res.body.user).toHaveProperty("email", testUser.email);
    });

    it("should reject duplicate email", async () => {
      // First create a user
      await User.create({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      });

      // Try to register with the same email
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should validate user input", async () => {
      const invalidUser = {
        name: "",
        email: "not-an-email",
        password: "short",
        confirmPassword: "doesnt-match",
      };

      const res = await request(app)
        .post("/api/auth/register")
        .send(invalidUser);

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toHaveProperty("name");
      expect(res.body.errors).toHaveProperty("email");
      expect(res.body.errors).toHaveProperty("password");
      expect(res.body.errors).toHaveProperty("confirmPassword");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login an existing user", async () => {
      // First create a user
      await User.create({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      });

      // Try to login
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("name", testUser.name);
      expect(res.body.user).toHaveProperty("email", testUser.email);
    });

    it("should reject invalid credentials", async () => {
      // First create a user
      await User.create({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      });

      // Try to login with wrong password
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrong-password",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should get current user profile", async () => {
      // First create a user
      const user = await User.create({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      });

      // Login to get token
      const loginRes = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      const token = loginRes.body.token;

      // Get user profile with token
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("id", user.id);
      expect(res.body.data).toHaveProperty("name", testUser.name);
      expect(res.body.data).toHaveProperty("email", testUser.email);
    });

    it("should reject request without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /api/auth/logout", () => {
    it("should logout user", async () => {
      // First create a user
      await User.create({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      });

      // Login to get token
      const loginRes = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      const token = loginRes.body.token;

      // Logout
      const res = await request(app)
        .get("/api/auth/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);

      // Cookie should be set to expire
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"][0]).toContain("token=none");
    });
  });
});
