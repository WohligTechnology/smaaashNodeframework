var objectid = require("mongodb").ObjectId;
var request = require("request");
var schema = new Schema({
    name: String,
    mobile: String,
    email: {
        type: String,
        validate: validators.isEmail(),
        unique: true
    },
    eventDate: Date,
    city: {
        type: String,
        enum: ["Mumbai", "Ludhiana", "Gurgoan", "Bengaluru", "Noida", "Hyderabad", , ]
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('RegisterVR', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {



    saveVRegisteration: function (data, callback) {
        var registerdata = data;

        console.log("DATA", data);


        registerdata = this(registerdata);

        registerdata.save(function (err, data) {
            if (err) {
                callback(err, null);
            } else {

                var id = data._id;
                var CODESTRING = id.toString();
                // console.log(id);
                console.log("ID", CODESTRING);
                var code = CODESTRING.substr(18);
                var CODE = code.toUpperCase();
                console.log("CODE", CODE);

                //callback("Resp", data);
                console.log("DATA", data.email);
                console.log("NAMEDATA", data.name);
                var emailData = {};
                emailData.email = data.email;
                emailData.cc = "pratik.gawand@wohlig.com";
                emailData.content = data;
                emailData.code = CODE;

                emailData.filename = "emailer.ejs";
                emailData.subject = "SMAAASH - VR";
                Config.email(emailData, function (err, emailRespo) {
                    if (err) {
                        console.log("EROR in EMAIL CONFIG", err);
                        callback(err, null);
                    } else {
                        console.log(emailRespo);

                        callback(null, data);
                    }
                    //   callback(null, data);
                });



            }
        });
    },
      searchVR: function (data, callback) {
            var Model = this;
            var Const = this(data);
            var maxRow = Config.maxRow;

            var page = 1;
            if (data.page) {
                page = data.page;
            }
            var field = data.field;




            var options = {
                field: data.field,
                filters: {
                    keyword: {
                        fields: ['name'],
                        term: data.keyword
                    }
                },
                sort: {
                    desc: 'updatedAt'
                },
                start: (page - 1) * maxRow,
                count: maxRow
            };

            if (defaultSort) {
                if (defaultSortOrder && defaultSortOrder === "desc") {
                    options.sort = {
                        desc: defaultSort
                    };
                } else {
                    options.sort = {
                        asc: defaultSort
                    };
                }
            }

            var Search = Model.find(data.filter)

            .order(options)
                .deepPopulate(deepSearch)
                .keyword(options)
                .page(options, callback);

        }
    


};
module.exports = _.assign(module.exports, exports, model);