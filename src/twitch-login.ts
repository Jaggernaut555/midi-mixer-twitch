// import { Assignment, ButtonType } from "midi-mixer-plugin";
import express from 'express';
import session from 'express-session';
import passport, { AuthenticateOptions } from 'passport';
import { Strategy, StrategyOptions } from 'passport-oauth2';

let clientId = "";
let clientSecret = "";
const SESSION_SECRET = 'Not important here';
const CALLBACK_URL = 'http://localhost:3000/auth/twitch/callback';

let settings: Record<string, any>;

export async function initLoginServer() {
    settings = await $MM.getSettings();
    clientId = settings["ClientID"];
    clientSecret = settings["ClientSecret"];
    initExpress();
}

function initExpress() {
    const app = express()
    const port = 3000
    app.set("view engine", "pug");
    app.set("views", __dirname + '/views');

    app.use(
        session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true, cookie: { maxAge: 1000 * 5 } })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/', (req, res) => {
        res.render('index', { user: req.user });
    });

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user: any, done) {
        done(null, user);
    });

    let strat = new Strategy(
        {
            authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: CALLBACK_URL,
            tokenURL: 'https://id.twitch.tv/oauth2/token',
            state: true
        },
        function (accessToken, refreshToken, expires_in, profile, done) {
            return done(null, { ...profile, accessToken, refreshToken });
        }
    );

    strat.authorizationParams = (options) => {
        return {
            force_verify: true
        };
    };

    passport.use('twitch', strat);

    app.get('/auth/twitch', passport.authenticate('twitch', {
        scope: ['user_read', 'clips:edit', 'channel:edit:commercial', 'chat:edit', 'chat:read'],
    }));

    app.get(
        '/auth/twitch/callback',
        passport.authenticate('twitch', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        }
    );

    app.listen(port, () => {
        console.log(`Twitch login server listening on port ${port}`)
        console.log(`http://localhost:3000`);
        $MM.setSettingsStatus("expressStatus", "Running");
    })
}
