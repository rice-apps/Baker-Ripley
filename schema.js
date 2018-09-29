// Require Mongoose
let mongoose = require('mongoose');

// Define a schema
let Schema = mongoose.Schema;
require('../db')

// Describe profile schema
let ProfileSchema = new Schema({
  demographics: [{
      dob:{type: String}, // date of birth
      ethnicity:{type: String},
      zipcode: [{
        home:{type: String},
        work:{type: String}
      }],
      gender:{type: String}
  }],
  firstName:{type: String},
  lastName:{type: String},
  UID: Number,
  email:{type: String},
  phone:{type: String},
  identifier: Number
});
