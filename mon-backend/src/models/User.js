const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please provide a valid email",
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        // Password only required for local auth (not OAuth)
        return !this.authProvider || this.authProvider === "local";
      },
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // OAuth fields
    authProvider: {
      type: String,
      enum: ["local", "google", "apple", "microsoft"],
      default: "local",
    },
    googleId: {
      type: String,
      sparse: true, // Allows multiple null values but unique non-null values
      unique: true,
    },
    appleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    microsoftId: {
      type: String,
      sparse: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Profile information
    experience: {
      type: String,
      trim: true,
    },
    field: {
      type: String,
      trim: true,
    },
    cvPath: {
      type: String,
    },
    profilePicturePath: {
      type: String,
    },

    // Role system
    availableRoles: [
      {
        type: String,
        enum: ["recruiter", "interviewer"],
      },
    ],
    currentRole: {
      type: String,
      enum: ["recruiter", "interviewer"],
      default: "interviewer",
    },

    // Profile completion
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
UserSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Handle isProfileComplete field validation
UserSchema.pre("save", function (next) {
  // Ensure isProfileComplete is always a boolean
  if (
    this.isProfileComplete === "" ||
    this.isProfileComplete === null ||
    this.isProfileComplete === undefined
  ) {
    this.isProfileComplete = false;
  }
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last login time
UserSchema.methods.updateLastLogin = async function () {
  this.lastLogin = Date.now();
  await this.save();
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
