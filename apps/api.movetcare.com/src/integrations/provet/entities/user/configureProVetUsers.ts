import {getProVetIdFromUrl} from "./../../../../utils/getProVetIdFromUrl";
import {throwError, admin, DEBUG} from "./../../../../config/config";
import {fetchEntity} from "./../fetchEntity";

export const configureProVetUsers = async () => {
  if (DEBUG) console.log("configureProVetUsers");
  const users = await fetchEntity("user");
  if (DEBUG) console.log("users", users);
  if (users.length > 0) {
    const allUserData = await fetchAllUserDetails(users);
    await saveProVetUserData(allUserData);
  }
};

const fetchAllUserDetails = async (users: any) => {
  const allUsers = users;
  await Promise.all(
    users.map(
      async (user: any, index: number) =>
        await fetchEntity("userdetails", user.id)
          .then((response: any) => {
            if (DEBUG) console.log("PROVET USER DETAILS => ", response);
            allUsers[index] = {
              ...user,
              title: response.title,
              phone: response.phone,
              veterinarian_id: response.veterinarian_id,
              active_department: response.active_department,
              initials: response.initials,
              user_type: response.user_type,
              areas_of_expertise: response.areas_of_expertise,
              qualifications: response.qualifications,
              picture: response.picture,
              prescriber_id: response.prescriber_id,
              employee_id: response.employee_id,
              vds_number: response.vds_number,
              all_departments_active: response.all_departments_active,
              active_departments: response.active_departments,
              home_department: response.home_department,
              is_cabinet_user: response.is_cabinet_user,
            };
          })
          .catch(async (error: any) => await throwError(error))
    )
  ).catch(async (error: any) => await throwError(error));
  if (DEBUG) console.log("allUsers", allUsers);
  return allUsers;
};

const saveProVetUserData = async (users: Array<ProVetUser>) =>
  await Promise.all(
    users.map(
      async (user: any) =>
        await admin
          .firestore()
          .collection("users")
          .doc(`${user.id}`)
          .set(
            {
              email: user?.email,
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
              groups: user.groups.map((group: any) =>
                getProVetIdFromUrl(group)
              ),
              title: user.title,
              phone: user.phone,
              veterinarianId: user.veterinarian_id,
              activeDepartment: getProVetIdFromUrl(user.active_department),
              initials: user.initials,
              userType: user.user_type,
              areasOfExpertise: user.areas_of_expertise,
              qualifications: user.qualifications,
              picture: user.picture,
              prescriberId: user.prescriber_id,
              employeeId: user.employee_id,
              vdsNumber: user.vdsNumber,
              allDepartmentsActive: user.all_departments_active,
              activeDepartments: user.active_departments.map(
                (department: any) => getProVetIdFromUrl(department)
              ),
              homeDepartment: getProVetIdFromUrl(user.home_department),
              isCabinetUser: user.is_cabinet_user,
              updatedOn: new Date(),
            } as ProVetUser,
            {merge: true}
          )
          .then(() => DEBUG && console.log("PROVET USER UPDATED ", user))
          .catch(async (error: any) => await throwError(error))
    )
  ).catch(async (error: any) => await throwError(error));
