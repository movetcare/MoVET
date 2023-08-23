import { Link } from "expo-router";
import { View } from "react-native";
import tw from "tailwind";

const Home = () => {
  return (
    <View style={tw`flex-1 items-center justify-center bg-white`}>
      <Link href="/home/details">Go to Details</Link>
      <Link href="/home/new-entry-modal">Present modal</Link>
    </View>
  );
};
export default Home;
