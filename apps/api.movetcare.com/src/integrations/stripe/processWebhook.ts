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
import {checkoutSessionCompleted} from "./checkout/checkoutSessionCompleted";
import {logEvent} from "../../utils/logging/logEvent";
import {paymentMethodUpdated} from "./paymentMethodUpdated";
import {paymentIntentUpdated} from "./paymentIntentUpdated";

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
      response.status(400).send({error: error?.message});
      return;
    }
  } else event = request.body;
  if (
    event.type.includes("terminal.reader.") ||
    event.type.includes("checkout.session.") ||
    event.type.includes("payment_method.") ||
    event.type.includes("payment_intent.")
  ) {
    await logEvent({
      tag: "stripe-webhook",
      origin: "api",
      success: true,
      data: request.body,
      sendToSlack: true,
    });
    switch (event.type) {
      case "terminal.reader.action_failed":
        await terminalReaderActionFailed(event);
        break;
      case "terminal.reader.action_succeeded":
        await terminalReaderActionSucceeded(event);
        break;
      case "terminal.reader.connected":
        await terminalReaderConnected(event);
        break;
      case "terminal.reader.disconnected":
        await terminalReaderDisconnected(event);
        break;
      case "checkout.session.completed":
        await checkoutSessionCompleted(event);
        break;
      case "payment_method.updated":
        await paymentMethodUpdated(event);
        break;
      case "payment_method.attached":
        await paymentMethodUpdated(event);
        break;
      case "payment_method.detached":
        await paymentMethodUpdated(event);
        break;
      case "payment_method.automatically_updated":
        await paymentMethodUpdated(event);
        break;
      case "payment_intent.amount_capturable_updated":
        await paymentIntentUpdated(event);
        break;
      case "payment_intent.canceled":
        await paymentIntentUpdated(event);
        break;
      case "payment_intent.created":
        await paymentIntentUpdated(event);
        break;
      case "payment_intent.partially_funded":
        await paymentIntentUpdated(event);
        break;
      case "payment_intent.payment_failed":
        await paymentIntentUpdated(event);
        break;
      case "payment_intent.processing":
        await paymentIntentUpdated(event);
        break;
      case "payment_intent.requires_action":
        await paymentIntentUpdated(event);
        break;
      case "payment_intent.succeeded":
        await paymentIntentUpdated(event);
        break;
      default:
        await throwError({...event, message: "Stripe Event Type Missing!"});
        break;
    }
  } else
    await logEvent({
      tag: "stripe-webhook",
      origin: "api",
      success: false,
      data: request.body,
      sendToSlack: true,
    });
  return response.status(200).send({received: true});
};
