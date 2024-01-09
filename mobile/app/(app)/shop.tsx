import { Loader } from "components/Loader";
import { View } from "components/themed";
import tw from "tailwind";

const Shop = () => {
  return (
    <View style={tw`h-screen -mt-12`}>
      <Loader />
    </View>
  );
};

export default Shop;
