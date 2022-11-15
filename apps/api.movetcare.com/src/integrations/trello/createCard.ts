import * as TrelloNodeAPI from "trello-node-api";
import { DEBUG, functions, throwError } from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";

const Trello = new TrelloNodeAPI();
Trello.setApiKey(functions.config()?.trello?.api_key);
Trello.setOauthToken(functions.config()?.trello?.o_auth);

export const createCard = async ({
  type,
  name,
  description,
  application,
  screenshot,
  url = "",
  priority,
  createdBy,
}: {
  type: "bug" | "feature";
  name: string;
  description: string;
  application: "web" | "mobile" | "admin";
  url: string;
  screenshot: Array<string>;
  priority: "low" | "medium" | "high";
  createdBy: string;
}): Promise<boolean> => {
  const bugDetails = `${
    type === "bug" ? "Bug" : "Feature"
  } Description: ${description}\n\nApplication: ${application?.toUpperCase()}\n\n${
    screenshot ? `Screenshot: ${JSON.stringify(screenshot)}` : ""
  }\n\n${createdBy ? `Submitted By: ${createdBy}` : ""}`;
  const labels: Array<string> = [];
  if (application === "web") labels.push("625edf5ecca29f071cca230d");
  else if (application === "mobile") labels.push("625edf5dcca29f071cca223a");
  else if (application === "admin") labels.push("625edf5ecca29f071cca2404");
  if (priority === "low") labels.push("625ede88463b8c5145e57308");
  else if (priority === "medium") labels.push("6282777ca4eb153efc6a5728");
  else if (priority === "high") labels.push("625edf5dcca29f071cca2244");
  if (type === "bug") labels.push("625edf5dcca29f071cca223f");
  else if (type === "feature") labels.push("625edf5ecca29f071cca2307");
  const payload: {
    name: string;
    desc: string;
    pos: "top" | "bottom";
    idList: string;
    idMembers: Array<string>;
    idLabels: Array<string>;
    urlSource: string;
  } = {
    name: name || "NAME MISSING!",
    desc: bugDetails || "MISSING DESCRIPTION!",
    urlSource: url,
    idLabels: labels,
    idMembers: ["5bef0f649676801d5504c130"],
    idList: "625edeb5117ed038a4a1cdd2",
    pos: "bottom",
  };
  if (DEBUG) console.log("TRELLO CREATE CARD PAYLOAD", payload);
  let response;
  try {
    response = await Trello.card.create(payload);
  } catch (error) {
    if (error) {
      return throwError(error);
    }
  }
  if (DEBUG) console.log("API RESPONSE FROM TRELLO", response);
  sendNotification({
    type: "slack",
    payload: {
      message: `:${type === "bug" ? "bug" : "star2"}: New ${
        type === "bug" ? "Bug Report" : "Feature Request"
      } - ${response.shortUrl}`,
    },
  });
  return response ? true : false;
};
