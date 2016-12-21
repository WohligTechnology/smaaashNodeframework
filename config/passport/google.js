global["GoogleKey"] = "AIzaSyBzblvTfnRrpg33LBDzqiMXPqY7dmpwaCk";
global["GoogleclientId"] = "313217298558-fv9d0jaknqj7ijdk2fkqk0suj1pl6e6r.apps.googleusercontent.com";
global["GoogleclientSecret"] = "hqCAw4pPbJ-sM-u1HtYjtrw-";

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
