# Twitch

Run ads and clip your twitch channel via Midi Mixer.

This plugin will request permissions to run commercials, create clips, and post in chat. The newly created clips will be posted into your chat room as you.

## Installing
To install without compiling from source, download the [.midiMixerPlugin from the latest release](https://github.com/Jaggernaut555/midi-mixer-twitch/releases/latest) and double click the file.

# Setting up this plugin

1. Log in to the [Twitch developers dashboard](https://dev.twitch.tv/)
2. Click on `Your Console` in the top right
3. Click `Register Your Application`. Enter `Midi Mixer Plugin` as the name, though it can be anything
4. Enter `http://localhost:3000/auth/twitch/callback` into the `OAuth Redirect URLs` and click `Add`
5. Select the category `Application Integration`
6. Click `Create`
7. Click `Manage` on the newly created application
8. Click the `New Secret` button
9. Copy the `Client ID` and `Client Secret` and enter them into this plugin's `Settings` page
10. Activate this plugin
11. On this plugin's `Settings` page click the `Run Login Server` button
12. Open the webpage [http://localhost:3000](http://localhost:3000)
13. Click the `Login with Twitch` button. This should prompt you to log in to your twitch account. After logging in you will be prompted to approve of the app you created on step 3
14. Copy the `Access Token` and `Refresh Token` and enter them into this plugin's `Settings` page
15. Deactivate and reactivate this plugin


This package uses:
- [midi-mixer-plugin](https://github.com/midi-mixer/midi-mixer-plugin)
- [twurple](https://github.com/twurple/twurple)
- [express](https://github.com/expressjs/express)
- [express-session](https://github.com/expressjs/session)
- [passport](https://github.com/jaredhanson/passport)
- [passport-spotify](https://github.com/JMPerez/passport-spotify)
- [pug](https://github.com/pugjs/pug)
