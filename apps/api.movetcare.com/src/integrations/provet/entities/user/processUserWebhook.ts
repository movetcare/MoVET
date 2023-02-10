import { getProVetIdFromUrl } from "./../../../../utils/getProVetIdFromUrl";
import { admin, DEBUG, throwError } from "../../../../config/config";
import { fetchEntity } from "./../fetchEntity";
import { Request, Response } from "express";

export const processUserWebhook = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const user = await fetchEntity("user", request.body.user_id);
  const userDetails = await fetchEntity("userdetails", request.body.user_id);
  if (DEBUG) {
    console.log("user", user);
    console.log("userDetails", userDetails);
  }
  if (user && userDetails)
    return await admin
      .firestore()
      .collection("users")
      .doc(`${user?.id}`)
      .set(
        {
          id: user.id,
          created:
            user.created !== null ? new Date(user.created) : user.created,
          firstName: user.first_name,
          lastName: user.last_name,
          isActive: user.is_active,
          lastLogin:
            user.last_login !== null ? new Date(user.last_login) : null,
          userDetails: getProVetIdFromUrl(user.user_details),
          isStaff: user.is_staff,
          groups: user.groups.map((group: any) => getProVetIdFromUrl(group)),
          title: userDetails.title,
          phone: userDetails.phone,
          veterinarianId: userDetails.veterinarian_id,
          activeDepartment: getProVetIdFromUrl(user.active_department),
          initials: userDetails.initials,
          userType: userDetails.user_type,
          areasOfExpertise: userDetails.areas_of_expertise,
          qualifications: userDetails.qualifications,
          picture: userDetails.picture,
          prescriberId: userDetails.prescriber_id,
          employeeId: userDetails.employee_id,
          vdsNumber: userDetails.vdsNumber,
          allDepartmentsActive: userDetails.all_departments_active,
          activeDepartments: userDetails.active_departments.map(
            (department: any) => getProVetIdFromUrl(department)
          ),
          homeDepartment: getProVetIdFromUrl(userDetails.home_department),
          isCabinetUser: userDetails.is_cabinet_user,
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .then(() => response.status(200).send({ received: true }))
      .catch((error: any) => {
        throwError(error);
        return response.status(500).send({ received: false });
      });
  else {
    throwError({ message: "INVALID PAYLOAD" });
    return response.status(500).send({ received: false });
  }
};
