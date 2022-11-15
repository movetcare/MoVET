import Stripe from "stripe";
import {
  stripe,
  throwError,
  stripeWebhookSecret,
  environment,
} from "../../config/config";
import {Response} from "express";
import {terminalReaderActionSucceeded} from "./pos/terminalReaderActionSucceeded";
import {terminalReaderActionFailed} from "./pos/terminalReaderActionFailed";
import {terminalReaderConnected} from "./pos/terminalReaderConnected";
import {terminalReaderDisconnected} from "./pos/terminalReaderDisconnected";
import { checkoutSessionCompleted } from "./checkout/checkoutSessionCompleted";
import { paymentMethodUpdated } from "./paymentMethodUpdated";
import { paymentIntentUpdated } from "./paymentIntentUpdated";
import { sendNotification } from "../../notifications/sendNotification";

export const processStripeWebhook = async (
  request: any,
  response: Response
) => {
  console.log("INCOMING REQUEST PAYLOAD => ", request.body);
  const sig: any = request.headers["stripe-signature"];
  let event: Stripe.Event | any;
  if (environment.type !== "development") {
    try {
      event = stripe.webhooks.constructEvent(
        request?.rawBody,
        sig,
        stripeWebhookSecret
      );
    } catch (error: any) {
      throwError(error);
      response.status(400).send({ error: error?.message });
      return;
    }
  } else event = request.body;
  if (
    event.type.includes("terminal.reader.") ||
    event.type.includes("checkout.session.") ||
    event.type.includes("payment_method.") ||
    event.type.includes("payment_intent.")
  ) {
    let message = null;
    if (request.body?.data?.object?.object === "terminal.reader") {
      message = `:desktop_computer:  ${
        request.body?.data?.object?.label
      }: ${request.body?.data?.type.toUpperCase()} - ${
        request.body?.data?.object?.action?.type
      }: ${request.body?.data?.object?.action?.status}`;
    } else if (request.body?.data?.object?.object === "payment_intent") {
      message = `:moneybag: ${request.body?.type.toUpperCase()} $${
        request.body?.data?.object?.amount_received / 100
      } of $${request.body?.data?.object?.amount / 100} received via ${
        request.body?.data?.object?.payment_method_types[0]
      }`;
    } else if (request.body?.data?.object?.object === "payment_method") {
      message = `:credit_card: ${request.body?.type.toUpperCase()} - ${request.body?.data?.object?.card?.brand.toUpperCase()} : ${
        request.body?.data?.object?.card?.exp_month
      }/${request.body?.data?.object?.card?.exp_year}`;
    } else if (request.body?.data?.object?.object === "checkout.session") {
      message = `:shopping_trolley: ${request.body?.type.toUpperCase()} - ${request.body?.data?.object?.payment_method_types[0].toUpperCase()} - ${
        request.body?.data?.object?.client_reference_id
      }`;
    }
    message += `\n\nhttps://dashboard.stripe.com/events/${request.body?.id}\n\n`;
    sendNotification({ type: "slack", payload: { message } });
    switch (event.type) {
      case "terminal.reader.action_failed":
        terminalReaderActionFailed(event);
        break;
      case "terminal.reader.action_succeeded":
        terminalReaderActionSucceeded(event);
        break;
      case "terminal.reader.connected":
        terminalReaderConnected(event);
        break;
      case "terminal.reader.disconnected":
        terminalReaderDisconnected(event);
        break;
      case "checkout.session.completed":
        checkoutSessionCompleted(event);
        break;
      case "payment_method.updated":
        paymentMethodUpdated(event);
        break;
      case "payment_method.attached":
        paymentMethodUpdated(event);
        break;
      case "payment_method.detached":
        paymentMethodUpdated(event);
        break;
      case "payment_method.automatically_updated":
        paymentMethodUpdated(event);
        break;
      case "payment_intent.amount_capturable_updated":
        paymentIntentUpdated(event);
        break;
      case "payment_intent.canceled":
        paymentIntentUpdated(event);
        break;
      case "payment_intent.created":
        paymentIntentUpdated(event);
        break;
      case "payment_intent.partially_funded":
        paymentIntentUpdated(event);
        break;
      case "payment_intent.payment_failed":
        paymentIntentUpdated(event);
        break;
      case "payment_intent.processing":
        paymentIntentUpdated(event);
        break;
      case "payment_intent.requires_action":
        paymentIntentUpdated(event);
        break;
      case "payment_intent.succeeded":
        paymentIntentUpdated(event);
        break;
      default:
        throwError({ ...event, message: "Stripe Event Type Missing!" });
        break;
    }
  } else
    sendNotification({
      type: "slack",
      payload: {
        message: `:interrobang: UNSUPPORTED SLACK WEBHOOK TRIGGERED\n\nhttps://dashboard.stripe.com/events/${request.body?.id}\n\n`,
      },
    });
  return response.status(200).send({ received: true });
};
