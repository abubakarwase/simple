const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;
const PhoneSchema = require('./PhoneSchema');

const UserSchema = new mongoose.Schema({
    // name: {
    //   type: String,
    //   required: [true, "Please add a name"],
    // },
    // email: {
    //   type: String,
    //   required: [true, "Please add an email"],
    //   unique: true,
    //   match: [
    //     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    //     "Please add a valid email",
    //   ],
    // },
    // password: {
    //     type: String,
    //     required: [true, "Please add a password"],
    //     minlength: 6,
    //     select: false,
    // },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    trackingId: {
      type: Number,
      default: 0,
      unique:true,
      sparse:true,
      index:true,
    },
    uid: {
      type: String,
      default: null,
      uppercase: true,
      trim: true,
      unique: true,
      index: true,
      sparse: true
    },
    referrer: {
      type: Schema.Types.ObjectId, ref: 'User'
    },
    referrerUId: {
      type: String, default: null, uppercase: true, trim: true
    },
    referrerRole: {
      type: String, default: 'driver', lowercase: true, trim: true
    },
    profile: {
      name: {
        first: {
          type: String, default: null, lowercase: true, trim: true
        },
        last: {
          type: String, default: null, lowercase: true, trim: true
        }
      },
      dob: { type: Date, default: null },
      gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
      isLock: { type: Boolean, default: false },
      pic: { type: Schema.Types.ObjectId, ref: 'File' }
    },
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    vehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
  
    files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
  
    email: {
      add: {
        type: String,
        required: false,
        default: null,
      },
      address:{},
      isVerified: {
        type: Boolean, default: false
      }
    },
    emailAddress: {
      type: String,
      default: null,
    },
  
    phone: PhoneSchema,
    phoneNumber: {
      type: mongoose.SchemaTypes.Number, required: true, unique: true, index: true
    },
    roles: [{
      name: { type: String, default: 'rider' },
      permission: [{ name: { type: String, default: 'default' } }]
  
    }],
    verifications: [{
      name: { type: String, default: null },
      at: { type: Date, default: null }
    }],
    isOnline: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: false },
    isTestRecord: { type: Boolean, default: false },
    random: { type: String, default: null, hidden: true },
    riderRandom: { type: String, default: null, hidden: true },
    driverRandom: { type: String, default: null, hidden: true },
  
    password: { type: String, default: null, hidden: true },
    isDelete: { type: Boolean, default: false },
    isBlock: { type: Boolean, default: false },
    isAtLeastVehicleVerifiedAndOnlyOneActive: { type: Boolean, default: false },
    isDriverVerified: { type: Boolean, default: false },
    driverVerifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
  
    isDriverTrainingDone: { type: Boolean, default: false },
    driverTrainingDoneBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    isDriverOkForRide: { type: Boolean, default: false },
    isRiderOkForTakeRide: { type: Boolean, default: false },
    idCardStatus: { type: String, default: 'notuploaded' },
    drivingLicenseStatus: { type: String, default: 'notuploaded' },
    policeClearanceStatus: { type: String, default: 'notuploaded' },
    vehicleStatus: { type: String, default: 'notuploaded' },
  
    isDriverBusy: {
      type: Boolean,
      default: false
    },
    isDummyAccount: {
      type: Boolean,
      default: false
    },
    isTestAccount: {
      type: Boolean,
      default: false
    },
    suspendedForNegativeBalanceAT: {
      type: Date,
      default: null
    },
    suspendedForEmailVerificationAT: {
      type: Date,
      default: null
    },
    suspendedForSMSVerificationAT: {
      type: Date,
      default: null
    },
    suspendedForCancelAT: {
      type: Date,
      default: null
    },
    driverTokens: [{ type: String }],
    riderTokens: [{ type: String }],
  
    city: { type: String, default: null, enum:[null,'Lahore','Karachi','Hyderabad'] },
    country: { type: String, default: 'Pakistan', enum:['Pakistan'] },
  
  }, {
    timestamps: true
  });

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
