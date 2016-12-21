module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
      getHomeContent: function (req, res) {
        if (req.body) {
            RestApi.getHomeContent(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    DestinationPage: function (req, res) {
      if (req.body) {
          RestApi.DestinationPage(req.body, res.callback);
      } else {
          res.json({
              value: false,
              data: "Invalid Request"
          });
      }
  },
    Pattaya2: function (req, res) {
      if (req.body) {
          RestApi.Pattaya2(req.body, res.callback);
      } else {
          res.json({
              value: false,
              data: "Invalid Request"
          });
      }
  },
    DestinationLand: function (req, res) {
      if (req.body) {
          RestApi.DestinationLand(req.body, res.callback);
      } else {
          res.json({
              value: false,
              data: "Invalid Request"
          });
      }
  },
    CategoryFilter: function (req, res) {
      if (req.body) {
          RestApi.CategoryFilter(req.body, res.callback);
      } else {
          res.json({
              value: false,
              data: "Invalid Request"
          });
      }
  },

ActivitiesImages: function (req, res) {
  if (req.body) {
      RestApi.ActivitiesImages(req.body, res.callback);
  } else {
      res.json({
          value: false,
          data: "Invalid Request"
      });
  }
},

WhatsHot: function (req, res) {
  if (req.body) {
      RestApi.WhatsHot(req.body, res.callback);
  } else {
      res.json({
          value: false,
          data: "Invalid Request"
      });
  }
},


WhatsHotDetails: function (req, res) {
  if (req.body) {
      RestApi.WhatsHotDetails(req.body, res.callback);
  } else {
      res.json({
          value: false,
          data: "Invalid Request"
      });
  }
},
    ActivitiesLand: function (req, res) {
      if (req.body) {
          RestApi.ActivitiesLand(req.body, res.callback);
      } else {
          res.json({
              value: false,
              data: "Invalid Request"
          });
      }
  },

    DestinationContent: function (req, res) {
      if (req.body) {
          RestApi.DestinationContent(req.body, res.callback);
      } else {
          res.json({
              value: false,
              data: "Invalid Request"
          });
      }
  },
    Package: function (req, res) {
      if (req.body) {
          RestApi.Package(req.body, res.callback);
      } else {
          res.json({
              value: false,
              data: "Invalid Request"
          });
      }
  },
    subscribeEmail: function (req, res) {
        if (req.body) {
            RestApi.subscribeEmail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    destination: function (req, res) {
        if (req.body) {
            RestApi.destination(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    allDestination: function (req, res) {
        if (req.body) {
            if (req.body.pagenumber && req.body.pagenumber !== "" && req.body.pagesize && req.body.pagesize !== "") {
                RestApi.allDestination(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    allActivities: function (req, res) {
        if (req.body) {
            if (req.body.pagenumber && req.body.pagenumber !== "" && req.body.pagesize && req.body.pagesize !== "") {
                RestApi.allActivities(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
};
module.exports = _.assign(module.exports, controller);
