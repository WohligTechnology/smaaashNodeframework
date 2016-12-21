module.exports = function (profile) {
    var req = this.req;
    var res = this.res;
    var sails = req._sails;
    if (_.isEmpty(profile)) {
        res.callback("Error fetching profile in Social Login", profile);
    } else {
        if (req.session.returnUrl) {
            User.existsSocial(profile, function (err, data) {
                if (err || !data) {
                    console.log(err);
                    console.log(data);
                    res.serverError();
                } else {
                    res.redirect(req.session.returnUrl + "/" + data.accessToken[0]);
                    req.session.destroy(function () {});
                }
            });

        } else {
            User.existsSocial(profile, res.callback);
        }
    }
};