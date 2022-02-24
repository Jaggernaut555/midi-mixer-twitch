import { ApiClient, HelixPrivilegedUser } from "@twurple/api";
import { AccessToken, RefreshingAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { Assignment, ButtonType } from "midi-mixer-plugin";
import { initLoginServer } from "./twitch-login";
import { initButtons, initChatClient } from './utils';

let tokenData: AccessToken;
let settings: Record<string, any>;
let authProvider: RefreshingAuthProvider;
let chatClient: ChatClient;
let apiClient: ApiClient;
let currentUser: HelixPrivilegedUser;

$MM.onSettingsButtonPress("runLogin", () => {
  initLoginServer();
})

async function init() {
  settings = await $MM.getSettings();
  let clientId = settings["ClientID"];
  let clientSecret = settings["ClientSecret"];
  let accessToken = settings["AccessToken"];
  let refreshToken = settings["RefreshToken"];

  if (!clientId || !clientSecret) {
    log.error("Cannot function without client ID or Secret");
    $MM.showNotification("Cannot run spotify plugin without a ClientID or ClientSecret");
    process.exit(1);
  }

  if (!accessToken || !refreshToken) {
    log.error("Need an access and refresh token. Follow the instuctions on the Info page to log in.");
    $MM.showNotification("Need an access and refresh token. Follow the instuctions on the Info page to log in.");
    return;
  }

  let initialToken = {
    accessToken,
    refreshToken,
    expiresIn: 0,
    obtainmentTimestamp: 0
  };

  try {
    authProvider = new RefreshingAuthProvider({
      clientId,
      clientSecret,
      onRefresh: async (newToken) => {
        tokenData = newToken;
        console.log("Refreshing token");
      },
    }, initialToken);

    apiClient = new ApiClient({ authProvider });

    currentUser = await apiClient.users.getMe();

    chatClient = await initChatClient(authProvider, currentUser);

    initButtons(apiClient, chatClient, currentUser);
  }
  catch (err) {
    console.log(err);
    log.error(err);
  }
}

init();