var schema = new Schema({
  email:{
    type:String,
    validate:validators.isEmail(),
    unique:true
  }
  // ,
  // timestamp: {
  //     type: Date,
  //     default: Date.now()
  // }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Subscribe', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
