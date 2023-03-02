import { admin, throwError } from "../../config/config";

export const logServiceRequest = (data: {
  email: string;
  zipcode: string;
  inState: boolean;
}): void =>
  admin
    .firestore()
    .collection(
      data.inState
        ? "in_state_service_requests"
        : "out_of_state_service_requests"
    )
    .doc(data.email)
    .set(
      {
        updatedOn: new Date(),
        email: data.email,
        addedOn: new Date(),
        zipcode: data.zipcode,
      },
      { merge: true }
    )
    .catch((error: any) => throwError(error));
