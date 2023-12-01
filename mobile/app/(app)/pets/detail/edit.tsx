import { EditPet } from "components/pets/EditPet";
import { Screen } from "components/themed";

const EditPetScreen = () => {
  return (
    <Screen>
      <EditPet mode="edit" />
    </Screen>
  );
};

export default EditPetScreen;
