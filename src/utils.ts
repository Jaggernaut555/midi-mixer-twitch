import { ChatClient } from "@twurple/chat";
import { RefreshingAuthProvider } from "@twurple/auth";
import { ApiClient, CommercialLength, HelixPrivilegedUser } from "@twurple/api";
import { ButtonType } from "midi-mixer-plugin";
import { updateChatClient } from ".";

export async function initChatClient(authProvider: RefreshingAuthProvider, currentUser: HelixPrivilegedUser) {

  console.log("Initializing chat client");

  let chatClient = new ChatClient({
    authProvider,
    channels: [currentUser.name],
    isAlwaysMod: true,
  });

  chatClient.onConnect(() => {
    console.log("connected");
  });

  chatClient.onRegister(() => {
    console.log("registered");
  });

  chatClient.onDisconnect(async (manual, reason) => {
    console.log("disconnected");
    if (!manual) {
      console.log(`ChatClient disconnected unexpectedly: ${reason}`);
      log.error(`ChatClient disconnected unexpectedly: ${reason}`);

      // On disconnect, re-setup all the buttons to use a new chat client
      let client = await initChatClient(authProvider, currentUser);
      updateChatClient(client);
    }
  });

  await chatClient.connect();

  return chatClient;
}

export async function initButtons(apiClient: ApiClient, chatClient: ChatClient, currentUser: HelixPrivilegedUser) {
  console.log("Initializing buttons");

  const clipButton = new ButtonType("ClipButton", {
    name: "Clip and post in chat",
    active: true
  });

  clipButton.on("pressed", async () => {
    try {
      let clipId = await apiClient.clips.createClip({
        channelId: currentUser.id
      });

      if (clipId) {
        await chatClient.say(currentUser.name, `https://clips.twitch.tv/${clipId}`);
      }
    }
    catch (err) {
      console.log(err);
      log.error(err);
      $MM.showNotification("Could not create clip");
    }
  });

  for(let i = 30; i <= 180; i += 30) {
    let adButton = new ButtonType(`${i}sCommercial`, {
      name: `Run ${i}s commercial`,
      active: true
    });

    adButton.on("pressed", async () => {
      try {
        await apiClient.channels.startChannelCommercial(currentUser.id, i as CommercialLength);
      }
      catch (err) {
        console.log(err);
        log.error(err);
        $MM.showNotification(`Could not run ${i}s ad`);
      }
    })
  }
}