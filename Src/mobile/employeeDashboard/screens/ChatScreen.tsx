import ChatWindow from "../components/ChatWindow";

export const ChatScreen = ({ route, navigation }) => {
  const { channelId, channelName } = route.params;

  return (
    <ChatWindow
      activeChannelId={channelId}
      activeChannelName={channelName}
      hideBottomNav={() => {
        // Optional: hide bottom tab if needed
      }}
    />
  );
};
export default ChatScreen;
