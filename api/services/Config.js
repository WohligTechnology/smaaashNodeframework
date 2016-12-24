/**
 * Config.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var fs = require("fs");
var lwip = require("lwip");
var process = require('child_process');
var lodash = require('lodash');
var moment = require('moment');
var MaxImageSize = 1600;
var request = require("request");
//  var requrl ="http://wohlig.io/"
var requrl = "http://localhost:80/api/";
var xlsx = require('node-xlsx').default;
var http = require('http');
var gfs = Grid(mongoose.connections[0].db, mongoose);
gfs.mongo = mongoose.mongo;
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    content: String,
});
//
// var client = new Twitter({
//     consumer_key: 'w0Mizb3YKniG8GfZmhQJbMvER',
//     consumer_secret: '6wnwpnm6a475ROm3aY8aOy8YXynQxQgZkcoJ05Y8D9EvL0Duov',
//     access_token_key: '121427044-PJTEM2zmqwcRu4K0FBotK9jtTibsNOiomyVlkSo0',
//     access_token_secret: 'TvMPCXaXpJOvpu8hCGc61kzp5EpIPbrAgOT7u6lDnastg'
// });

module.exports = mongoose.model('Config', schema);

var models = {
    maxRow: 10,
    getForeignKeys: function (schema) {
        var arr = [];
        _.each(schema.tree, function (n, name) {
            if (n.key) {
                arr.push({
                    name: name,
                    ref: n.ref,
                    key: n.key
                });
            }
        });
        return arr;
    },
    checkRestrictedDelete: function (Model, schema, data, callback) {

        var values = schema.tree;
        var arr = [];
        var ret = true;
        _.each(values, function (n, key) {
            if (n.restrictedDelete) {
                arr.push(key);
            }
        });


        Model.findOne({
            "_id": data._id
        }, function (err, data2) {
            if (err) {
                callback(err, null);
            } else if (data2) {
                _.each(arr, function (n) {
                    if (data2[n].length !== 0) {
                        ret = false;
                    }
                });
                callback(null, ret);
            } else {
                callback("No Data Found", null);
            }
        });
    },

    GlobalCallback: function (err, data, res) {
        if (err) {
            res.json({
                error: err,
                value: false
            });
        } else {
            res.json({
                data: data,
                value: true
            });
        }
    },

    manageArrayObject: function (Model, id, data, key, action, callback) {
        Model.findOne({
            "_id": id
        }, function (err, data2) {
            if (err) {
                callback(err, null);
            } else if (data2) {
                switch (action) {
                    case "create":
                        {
                            data2[key].push(data);
                            data2[key] = _.uniq(data2[key]);
                            console.log(data2[key]);
                            data2.update(data2, {
                                w: 1
                            }, callback);
                        }
                        break;
                    case "delete":
                        {
                            _.remove(data2[key], function (n) {
                                return (n + "") == (data + "");
                            });
                            data2.update(data2, {
                                w: 1
                            }, callback);
                        }
                        break;
                }
            } else {
                callback("No Data Found for the ID", null);
            }
        });


    },

    importExcel: function (name) {
        var jsonExcel = xlsx.parse(name);
        var retVal = [];
        var firstRow = _.slice(jsonExcel[0].data, 0, 1)[0];
        var excelDataToExport = _.slice(jsonExcel[0].data, 1);
        var dataObj = [];
        _.each(excelDataToExport, function (val, key) {
            dataObj.push({});
            _.each(val, function (value, key2) {
                dataObj[key][firstRow[key2]] = value;
            });
        });
        return dataObj;
    },
    uploadFile: function (filename, callback) {
        // console.log("filename in config", filename);
        var id = mongoose.Types.ObjectId();
        var extension = filename.split(".").pop();
        extension = extension.toLowerCase();
        if (extension == "jpeg") {
            extension = "jpg";
        }

        var newFilename = id + "." + extension;


        var writestream = gfs.createWriteStream({
            filename: newFilename
        });
        var imageStream = fs.createReadStream(filename);

        function writer2(metaValue) {
            var writestream2 = gfs.createWriteStream({
                filename: newFilename,
                metadata: metaValue
            });
            writestream2.on('finish', function () {
                callback(null, {
                    name: newFilename
                });
                fs.unlink(filename);
            });
            fs.createReadStream(filename).pipe(writestream2);
        }

        if (extension == "png" || extension == "jpg" || extension == "gif") {
            lwip.open(filename, extension, function (err, image) {
                var upImage = {
                    width: image.width(),
                    height: image.height(),
                    ratio: image.width() / image.height()
                };

                if (upImage.width > upImage.height) {
                    if (upImage.width > MaxImageSize) {
                        image.resize(MaxImageSize, MaxImageSize / (upImage.width / upImage.height), function (err, image2) {
                            upImage = {
                                width: image2.width(),
                                height: image2.height(),
                                ratio: image2.width() / image2.height()
                            };
                            image2.writeFile(filename, function (err) {
                                writer2(upImage);
                            });
                        });
                    } else {
                        writer2(upImage);
                    }
                } else {
                    if (upImage.height > MaxImageSize) {
                        image.resize((upImage.width / upImage.height) * MaxImageSize, MaxImageSize, function (err, image2) {
                            upImage = {
                                width: image2.width(),
                                height: image2.height(),
                                ratio: image2.width() / image2.height()
                            };
                            image2.writeFile(filename, function (err) {
                                writer2(upImage);
                            });
                        });
                    } else {
                        writer2(upImage);
                    }
                }
            });
        } else {
            imageStream.pipe(writestream);
        }

        writestream.on('finish', function () {
            callback(null, {
                name: newFilename
            });
            fs.unlink(filename);
        });
    },
    /////////////////////////
    // uploadFile: function (filename, callback) {
    //     var id = mongoose.Types.ObjectId();
    //     var extension = filename.split(".").pop();
    //     extension = extension.toLowerCase();
    //     if (extension == "jpeg") {
    //         extension = "jpg";
    //     }
    //     var newFilename = id + "." + extension;

    //     var writestream = gfs.createWriteStream({
    //         filename: newFilename
    //     });
    //     var imageStream = fs.createReadStream(filename);

    //     function writer2(metaValue) {
    //         var writestream2 = gfs.createWriteStream({
    //             filename: newFilename,
    //             metadata: metaValue
    //         });
    //         writestream2.on('finish', function () {
    //             callback(null, {
    //                 name: newFilename
    //             });
    //             fs.unlink(filename);
    //         });
    //         fs.createReadStream(filename).pipe(writestream2);
    //     }

    //     if (extension == "png" || extension == "jpg" || extension == "gif" ) {
    //         console.log("FILENAME LWIP",filename);
    //         lwip.open(filename, extension, function (err, image) {
    //             if (err) {

    //                 console.log("IN LWIP",err);
    //                  callback(err, null);
    //             } else {
    //                 var upImage = {
    //                     width: image.width(),
    //                     height: image.height(),
    //                     ratio: image.width() / image.height()
    //                 };

    //                 if (upImage.width > upImage.height) {
    //                     if (upImage.width > MaxImageSize) {
    //                         image.resize(MaxImageSize, MaxImageSize / (upImage.width / upImage.height), function (err, image2) {
    //                             if (err) {
    //                                 console.log(err);
    //                                 callback(err, null);
    //                             } else {
    //                                 upImage = {
    //                                     width: image2.width(),
    //                                     height: image2.height(),
    //                                     ratio: image2.width() / image2.height()
    //                                 };
    //                                 image2.writeFile(filename, function (err) {
    //                                     writer2(upImage);
    //                                 });
    //                             }
    //                         });
    //                     } else {
    //                         writer2(upImage);
    //                     }
    //                 } else {
    //                     if (upImage.height > MaxImageSize) {
    //                         image.resize((upImage.width / upImage.height) * MaxImageSize, MaxImageSize, function (err, image2) {
    //                             if (err) {
    //                                 console.log(err);
    //                                 callback(err, null);
    //                             } else {
    //                                 upImage = {
    //                                     width: image2.width(),
    //                                     height: image2.height(),
    //                                     ratio: image2.width() / image2.height()
    //                                 };
    //                                 image2.writeFile(filename, function (err) {
    //                                     writer2(upImage);
    //                                 });
    //                             }
    //                         });
    //                     } else {
    //                         writer2(upImage);
    //                     }
    //                 }
    //             }
    //         });
    //     } else {
    //         imageStream.pipe(writestream);
    //     }

    //     writestream.on('finish', function () {
    //         callback(null, {
    //             name: newFilename
    //         });
    //         fs.unlink(filename);
    //     });
    // },
    generateExcel: function (name, found, res) {
        name = _.kebabCase(name);
        var excelData = [];
        _.each(found, function (singleData) {
            var singleExcel = {};
            _.each(singleData, function (n, key) {
                if (key != "__v" && key != "createdAt" && key != "updatedAt") {
                    singleExcel[_.capitalize(key)] = n;
                }
            });
            excelData.push(singleExcel);
        });
        var xls = sails.json2xls(excelData);
        var folder = "./.tmp/";
        var path = name + "-" + moment().format("MMM-DD-YYYY-hh-mm-ss-a") + ".xlsx";
        var finalPath = folder + path;
        sails.fs.writeFile(finalPath, xls, 'binary', function (err) {
            if (err) {
                res.callback(err, null);
            } else {
                fs.readFile(finalPath, function (err, excel) {
                    if (err) {
                        res.callback(err, null);
                    } else {
                        res.set('Content-Type', "application/octet-stream");
                        res.set('Content-Disposition', "attachment;filename=" + path);
                        res.send(excel);
                        sails.fs.unlink(finalPath);
                    }
                });
            }
        });

    },

    email: function (data, callback) {
        // console.log(data);
        Password.find().exec(function (err, userdata) {
            if (err) {
                //     console.log(err);
                callback(err, null);
            } else if (userdata && userdata.length > 0) {
                if (data.filename && data.filename != "") {
                    request.post({
                        url: requrl + "config/emailReader/",
                        json: data
                    }, function (err, http, body) {
                        //console.log(err,http,body);
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            //   console.log('email else');
                            if (body && body.value != false) {
                                //console.log("body", body);
                                var sendgrid = require("sendgrid")(userdata[0].name);
                                sendgrid.send({
                                    to: data.email,
                                    cc: data.cc,
                                    from: "smaaashmumbai@gmail.com",
                                    subject: data.subject,
                                    html: body
                                }, function (err, json) {
                                    if (err) {
                                        console.log('in email error');
                                        callback(err, null);
                                    } else {
                                      
                                        callback(null, json);
                                    }
                                });
                            } else {
                                callback({
                                    message: "Some error in html"
                                }, null);
                            }
                        }
                    });
                } else {
                    callback({
                        message: "Please provide params"
                    }, null);
                }
            } else {
                callback({
                    message: "No api keys found"
                }, null);
            }
        });
    },
    readUploaded: function (filename, width, height, style, res) {
        var readstream = gfs.createReadStream({
            filename: filename
        });
        readstream.on('error', function (err) {
            res.json({
                value: false,
                error: err
            });
        });

        function writer2(filename, gridFSFilename, metaValue) {
            var writestream2 = gfs.createWriteStream({
                filename: gridFSFilename,
                metadata: metaValue
            });
            writestream2.on('finish', function () {
                fs.unlink(filename);
            });
            fs.createReadStream(filename).pipe(res);
            fs.createReadStream(filename).pipe(writestream2);
        }

        function read2(filename2) {
            var readstream2 = gfs.createReadStream({
                filename: filename2
            });
            readstream2.on('error', function (err) {
                res.json({
                    value: false,
                    error: err
                });
            });
            readstream2.pipe(res);
        }
        var onlyName = filename.split(".")[0];
        var extension = filename.split(".").pop();
        if ((extension == "jpg" || extension == "png" || extension == "gif") && ((width && width > 0) || (height && height > 0))) {
            //attempt to get same size image and serve
            var newName = onlyName;
            if (width > 0) {
                newName += "-" + width;
            } else {
                newName += "-" + 0;
            }
            if (height) {
                newName += "-" + height;
            } else {
                newName += "-" + 0;
            }
            if (style && (style == "fill" || style == "cover")) {
                newName += "-" + style;
            } else {
                newName += "-" + 0;
            }
            var newNameExtire = newName + "." + extension;
            gfs.exist({
                filename: newNameExtire
            }, function (err, found) {
                if (err) {
                    res.json({
                        value: false,
                        error: err
                    });
                }
                if (found) {
                    read2(newNameExtire);
                } else {
                    var imageStream = fs.createWriteStream('./.tmp/uploads/' + filename);
                    readstream.pipe(imageStream);
                    imageStream.on("finish", function () {
                        lwip.open('./.tmp/uploads/' + filename, function (err, image) {
                            ImageWidth = image.width();
                            ImageHeight = image.height();
                            var newWidth = 0;
                            var newHeight = 0;
                            var pRatio = width / height;
                            var iRatio = ImageWidth / ImageHeight;
                            if (width && height) {
                                newWidth = width;
                                newHeight = height;
                                switch (style) {
                                    case "fill":
                                        if (pRatio > iRatio) {
                                            newHeight = height;
                                            newWidth = height * (ImageWidth / ImageHeight);
                                        } else {
                                            newWidth = width;
                                            newHeight = width / (ImageWidth / ImageHeight);
                                        }
                                        break;
                                    case "cover":
                                        if (pRatio < iRatio) {
                                            newHeight = height;
                                            newWidth = height * (ImageWidth / ImageHeight);
                                        } else {
                                            newWidth = width;
                                            newHeight = width / (ImageWidth / ImageHeight);
                                        }
                                        break;
                                }
                            } else if (width) {
                                newWidth = width;
                                newHeight = width / (ImageWidth / ImageHeight);
                            } else if (height) {
                                newWidth = height * (ImageWidth / ImageHeight);
                                newHeight = height;
                            }
                            image.resize(parseInt(newWidth), parseInt(newHeight), function (err, image2) {
                                image2.writeFile('./.tmp/uploads/' + filename, function (err) {
                                    writer2('./.tmp/uploads/' + filename, newNameExtire, {
                                        width: newWidth,
                                        height: newHeight
                                    });
                                });
                            });
                        });
                    });
                }
            });
            //else create a resized image and serve
        } else {
            readstream.pipe(res);
        }
        //error handling, e.g. file does not exist
    },


    // uploadAllFile: function (filedata, filename, callback) {
    //     console.log("filedata", filedata);

    //     console.log("filename", filename);
    //     var id = mongoose.Types.ObjectId();
    //     var extension = filename.split(".").pop();
    //     extension = extension.toLowerCase();
    //     if (extension == "jpeg") {
    //         extension = "jpg";
    //     }
    //     var newFilename = filedata;
    //     var writestream = gfs.createWriteStream({
    //         filename: newFilename
    //     });
    //     var imageStream = fs.createReadStream(filename);

    //     function writer2(metaValue) {
    //         var writestream2 = gfs.createWriteStream({
    //             filename: newFilename,
    //             metadata: metaValue
    //         });
    //         writestream2.on('finish', function () {
    //             callback(null, {
    //                 name: newFilename
    //             });
    //             fs.unlink(filename);
    //         });
    //         fs.createReadStream(filename).pipe(writestream2);
    //     }

    //     if (extension == "png" || extension == "jpg" || extension == "gif") {
    //         lwip.open(filename, extension, function (err, image) {
    //             var upImage = {
    //                 width: image.width(),
    //                 height: image.height(),
    //                 ratio: image.width() / image.height()
    //             };

    //             if (upImage.width > upImage.height) {
    //                 if (upImage.width > MaxImageSize) {
    //                     image.resize(MaxImageSize, MaxImageSize / (upImage.width / upImage.height), function (err, image2) {
    //                         upImage = {
    //                             width: image2.width(),
    //                             height: image2.height(),
    //                             ratio: image2.width() / image2.height()
    //                         };
    //                         image2.writeFile(filename, function (err) {
    //                             writer2(upImage);
    //                         });
    //                     });
    //                 } else {
    //                     writer2(upImage);
    //                 }
    //             } else {
    //                 if (upImage.height > MaxImageSize) {
    //                     image.resize((upImage.width / upImage.height) * MaxImageSize, MaxImageSize, function (err, image2) {
    //                         upImage = {
    //                             width: image2.width(),
    //                             height: image2.height(),
    //                             ratio: image2.width() / image2.height()
    //                         };
    //                         image2.writeFile(filename, function (err) {
    //                             writer2(upImage);
    //                         });
    //                     });
    //                 } else {
    //                     writer2(upImage);
    //                 }
    //             }
    //         });
    //     } else {
    //         imageStream.pipe(writestream);
    //     }

    //     writestream.on('finish', function () {
    //         callback(null, {
    //             name: newFilename
    //         });
    //         fs.unlink(filename);
    //     });
    // },
    import: function (name) {
        var jsonExcel = xlsx.parse(name);
        var retVal = [];
        var firstRow = _.slice(jsonExcel[0].data, 0, 1)[0];
        var excelDataToExport = _.slice(jsonExcel[0].data, 1);
        var dataObj = [];
        _.each(excelDataToExport, function (val, key) {
            dataObj.push({});
            _.each(val, function (value, key2) {
                dataObj[key][firstRow[key2]] = value;
            });
        });
        return dataObj;
    },
    importGS: function (filename, callback) {
        var readstream = gfs.createReadStream({
            filename: filename
        });
        readstream.on('error', function (err) {
            // res.json({
            //     value: false,
            //     error: err
            // });
        });
        var buffers = [];
        readstream.on('data', function (buffer) {
            buffers.push(buffer);
        });
        readstream.on('end', function () {
            var buffer = Buffer.concat(buffers);
            callback(null, Config.import(buffer));
        });
    },

    excelDateToDate: function isDate(value) {
        value = (value - (25567 + 1)) * 86400 * 1000;
        var mom = moment(value);
        if (mom.isValid()) {
            return mom.toDate();
        } else {
            return undefined;
        }
    },
    downloadFromUrl: function (url, callback) {
        var dest = "./.tmp/" + moment().valueOf() + "-" + _.last(url.split("/"));
        var file = fs.createWriteStream(dest);

        var request = http.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                Config.uploadFile(dest, callback);
            });
        }).on('error', function (err) {
            console.log("HERE IN DWN FROM URL");
            fs.unlink(dest);
            callback(err);
        });

    }
};
module.exports = _.assign(module.exports, models);