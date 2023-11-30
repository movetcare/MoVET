import { EditPet } from "components/pets/EditPet";
import { Screen } from "components/themed";

const NewPet = () => {
  return (
    <Screen>
      <EditPet mode="add" />
    </Screen>
  );
};

export default NewPet;
