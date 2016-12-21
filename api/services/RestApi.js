var exports = _.cloneDeep(require("sails-wohlig-service")());
var model = {
    getHomeContent: function (data, callback) {
        async.parallel({
            HomeSlider: function (callback) {
                HomeSlider.find({
                    status: "true"
                }).sort({
                    order: -1
                }).exec(function (err, found) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            },
            popularDestination: function (callback) {
                Destination.find({
                    status: "true",
                    isSlider: "Yes"
                }).exec(function (err, found) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            },
            popularAttraction: function (callback) {
                Activities.find({
                    status: "true",
                  isSlider: "Yes"
                }).exec(function (err, found) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            },
            DestinationDropdown: function (callback) {
                Destination.find({
                    status: "true"
                }).exec(function (err, found) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            },
            whatsHotBanner: function (callback) {
                WhatsHotSlider.find({
                    status: "true"
                }).exec(function (err, found) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            },
        }, function (err, results) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (results && results.length > 0) {
                callback(null, results);
            } else {
                callback(null, results);
            }
        });
    },
    subscribeEmail: function (data, callback) {
        var subscribe = Subscribe(data);
        Subscribe.findOne({
            email: data.email
        }, function (err, deleted) {
            if (err) {
                callback(err, null);
            } else if (deleted) {
                callback(null, {
                    value: false,
                    message: "already exists"
                });
            } else {
                subscribe.save(function (err, created) {
                    if (err) {
                        callback(err, null);
                    } else if (created) {
                        callback(null, created);
                    } else {
                        callback(null, {});
                    }
                });
            }
        });
    },








    // Start     Pattaya - Page
    DestinationPage: function (data, callback) {
        async.parallel({

            getDestination: function (callback) {
                Destination.findOne({
                    _id:data.id,
                    status: "true"
                }).exec(function (err, found) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            },

            getTitle: function (callback) {
                DestinationTitle.find({
                  destination:data.id,
                    status: "true"
                }).exec(function (err, found) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            },
            getPackage: function (callback) {
                Package.find({
                    destination:data.id,
                    status: "true"
                }).exec(function (err, found) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            },

            getActivity: function (callback) {
                Activities.find({
                    destination:data.id,
                    status: "true"
                }).exec(function (err, found) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            },
        }, function (err, results) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (results && results.length > 0) {
                callback(null, results);
            } else {
                callback(null, results);
            }
        });
    },


//  Pattaya - Page Activity category

CategoryFilter: function (data, callback) {
    async.parallel({
      Category: function (callback) {
          Activities.find({
              destination:data.destination,
              type: { $in: data.type },
              status: "true"
          }).exec(function (err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else if (found) {
                  callback(null, found);
              } else {
                  callback(null, found);
              }
          });
      },

    }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else if (results && results.length > 0) {
            callback(null, results);
        } else {
            callback(null, results);
        }
    });
},






// 2


DestinationContent: function (data, callback) {
    async.parallel({
      getTitle: function (callback) {
          DestinationContent.find({
              destinationTitle:data.id,
              status: "true"
          }).exec(function (err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else if (found) {
                  callback(null, found);
              } else {
                  callback(null, found);
              }
          });
      },

    }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else if (results && results.length > 0) {
            callback(null, results);
        } else {
            callback(null, results);
        }
    });
},



// Pattaya 2



Pattaya2: function (data, callback) {
    async.parallel({
      packageDetails: function (callback) {
          Package.findOne({
              _id:data.id,
              status: "true"
          }).exec(function (err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else if (found) {
                  callback(null, found);
              } else {
                  callback(null, found);
              }
          });
      },

    }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else if (results && results.length > 0) {
            callback(null, results);
        } else {
            callback(null, results);
        }
    });
},


// 3   Destination Landing


DestinationLand: function (data, callback) {
    async.parallel({
      Banner: function (callback) {
          Banner.findOne({
              name:"Destination",
              status: "true"
          }).exec(function (err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else if (found) {
                  callback(null, found);
              } else {
                  callback(null, found);
              }
          });
      },
      popularDestination: function (callback) {
          Destination.find({
              type:"Popular Destination",
              status: "true"
          }).exec(function (err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else if (found) {
                  callback(null, found);
              } else {
                  callback(null, found);
              }
          });
      },

      allDestination: function (callback) {
          Destination.find({
              type:"None",
              status: "true"
          }).exec(function (err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else if (found) {
                  callback(null, found);
              } else {
                  callback(null, found);
              }
          });
      },


    }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else if (results && results.length > 0) {
            callback(null, results);
        } else {
            callback(null, results);
        }
    });
},


///


//



ActivitiesLand: function (data, callback) {
    async.parallel({
      Banner: function (callback) {
          Banner.findOne({
              name:"Activities",
              status: "true"
          }).exec(function (err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else if (found) {
                  callback(null, found);
              } else {
                  callback(null, found);
              }
          });
      },
      DestinationDropdown: function (callback) {
          Destination.find({
              status: "true"
          }).exec(function (err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else if (found) {
                  callback(null, found);
              } else {
                  callback(null, found);
              }
          });
      },

      Images: function (callback) {
          Activities.find({
              status: "true"
          }).exec(function (err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else if (found) {
                  callback(null, found);
              } else {
                  callback(null, found);
              }
          });
      },

      // DestinationImages: function (callback) {
      //     Activities.find({
      //         destination:data.id,
      //         status: "true"
      //     }).exec(function (err, found) {
      //         if (err) {
      //             console.log(err);
      //             callback(err, null);
      //         } else if (found) {
      //             callback(null, found);
      //         } else {
      //             callback(null, found);
      //         }
      //     });
      // },

    }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else if (results && results.length > 0) {
            callback(null, results);
        } else {
            callback(null, results);
        }
    });
},



////////// In Pattaya AND in Activity Landing
ActivitiesImages: function (data, callback) {
    async.parallel({
      Images: function (callback) {
          Activities.find({
            destination:data.destination,
              status: "true"
          }).exec(function (err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else if (found) {
                  callback(null, found);
              } else {
                  callback(null, found);
              }
          });
      },
    }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else if (results && results.length > 0) {
            callback(null, results);
        } else {
            callback(null, results);
        }
    });
},


//



WhatsHot: function (data, callback) {
    async.parallel({

      Events: function (callback) {
          WhatsHot.find({
              status: "true"
          }).exec(function (err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else if (found) {
                  callback(null, found);
              } else {
                  callback(null, found);
              }
          });
      },
    }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else if (results && results.length > 0) {
            callback(null, results);
        } else {
            callback(null, results);
        }
    });
},


//




WhatsHotDetails: function (data, callback) {
    async.parallel({
      Details: function (callback) {
          WhatsHot.find({
              _id:data.id,
              status: "true"
          }).exec(function (err, found) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else if (found) {
                  callback(null, found);
              } else {
                  callback(null, found);
              }
          });
      },
    }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else if (results && results.length > 0) {
            callback(null, results);
        } else {
            callback(null, results);
        }
    });
},

// Whats Hot Internal Page


    //END




    allDestination: function (data, callback) {
        var newreturns = {};
        newreturns.data = [];
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        async.parallel([
                function (callback) {
                    Destination.count({
                        status: "true"
                    }).exec(function (err, number) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (number && number !== "") {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                },
                function (callback) {
                    Destination.find({
                        status: "true"
                    }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).lean().exec(function (err, data2) {
                        console.log(data2);
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (data2 && data2.length > 0) {
                            newreturns.data = data2;
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                }
            ],
            function (err, data4) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (data4) {
                    callback(null, newreturns);
                } else {
                    callback(null, newreturns);
                }
            });
    },
    destination: function (data, callback) {
        async.parallel({
            Slider: function (callback) {
                Destination.find({
                    status: "true",
                    isSlider: "Yes"
                }, {
                    content: 0,
                    accomodation: 0
                }).sort({
                    order: -1
                }).exec(function (err, found) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            },
            popularDestination: function (callback) {
                Destination.find({
                    status: "true",
                    type: "Popular Destination"
                }, {
                    content: 0,
                    accomodation: 0
                }).sort({
                    order: -1
                }).exec(function (err, found) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            }

        }, function (err, results) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (results && results.length > 0) {
                callback(null, results);
            } else {
                callback(null, results);
            }
            // results is now equals to: {one: 'abc\n', two: 'xyz\n'}
        });
    },

    allActivities: function (data, callback) {
        var newreturns = {};
        newreturns.data = [];
        data.pagenumber = parseInt(data.pagenumber);
        data.pagesize = parseInt(data.pagesize);
        async.parallel([
                function (callback) {
                    Activities.count({
                        status: "true",
                        city: data.city,
                        type: data.category
                    }).exec(function (err, number) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (number && number !== "") {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                },
                function (callback) {
                    Activities.find({
                        status: "true",
                        city: data.city,
                        type: data.category
                    }).skip(data.pagesize * (data.pagenumber - 1)).limit(data.pagesize).lean().exec(function (err, data2) {
                        console.log(data2);
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (data2 && data2.length > 0) {
                            newreturns.data = data2;
                            callback(null, newreturns);
                        } else {
                            callback(null, newreturns);
                        }
                    });
                }
            ],
            function (err, data4) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (data4) {
                    callback(null, newreturns);
                } else {
                    callback(null, newreturns);
                }
            });
    },
};
module.exports = _.assign(module.exports, exports, model);
