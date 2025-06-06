import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import { Message } from "./utils/types";

type RootStackParamList = {
  Home: undefined;
  Chat: {
    chatData: Message[];
    contactName: string;
    participants: string[];
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "WhatsArchive Viewer" }} />
          <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.contactName, headerShown: false })} />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
