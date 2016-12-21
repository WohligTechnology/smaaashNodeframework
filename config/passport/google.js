global["GoogleKey"] = "AIzaSyBzblvTfnRrpg33LBDzqiMXPqY7dmpwaCk";
global["GoogleclientId"] = "286861177689-uu5fv2jfkm16vs0eg53jacvi6s49n2va.apps.googleusercontent.com";
global["GoogleclientSecret"] = "-kSg4q2lOiuNCZ2WXoqbzS7u";

passport.use(new GoogleStrategy({
        clientId: GoogleclientId,
        clientSecret: GoogleclientSecret,
        callbackURL: global["env"].realHost + "/api/user/loginGoogle",
        accessType: "offline"
    },
    function (accessToken, refreshToken, profile, cb) {
        profile.googleAccessToken = accessToken;
        profile.googleRefreshToken = refreshToken;
        return cb(profile);
    }
));
