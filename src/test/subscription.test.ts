import SDK from "../main";
import {
  CancelPayload,
  CreatePayload,
  DepositPayload,
  WithdrawPayload,
} from "../modules/SubscriptionModule";
import { AptosAccount, Network } from "aptos";


import // signAndSubmitTx, waitForTx,
// delay
"../utils";
import SubscriptionInfo from "../types/subscriptionInfo";

let mnemonic =
  "remain exercise lecture shuffle length dial vapor steel gather away better exit";
const alice = AptosAccount.fromDerivePath("m/44'/637'/0'/0'/0'", mnemonic);

describe("Subscription Module", () => {
  const { subscription } = new SDK(Network.TESTNET);

  it("create", async () => {
    const _input: CreatePayload = {
      recipient: alice.address.toString(),
      deposit_amount: 1,
      start_time: Math.floor(Date.now() / 1000).toString(),
      stop_time: Math.floor(Date.now() / 1000 + 60 * 60 * 24 * 30).toString(),
      coin_type: "",
      rate_type: "day",
      amount_type: "fixed",
    };

    const output = subscription.create(_input);

    expect(output).toBeDefined();
  });

  it("deposit", async () => {
    const subscriptionId = 22;
    const depositAmount = 10000000;

    const _input: DepositPayload = {
      deposit_amount: depositAmount,
      subscription_id: subscriptionId,
    };

    console.log(
      `Depositing ${depositAmount} to subscription ${subscriptionId}`
    );

    const output = await subscription.deposit(_input);

    expect(output).toBeDefined();
    console.log("Deposit output:", output);

    // Verify the deposit was successful
    const updatedSubscription = await subscription.getSubscription(
      subscriptionId
    );
    expect(updatedSubscription).toBeDefined();

    // Convert deposit_amount to a number for comparison
    const updatedDepositAmount = parseInt(
      updatedSubscription.remaining_amount.toString(),
      10
    );
    expect(updatedDepositAmount).toBe(depositAmount);

    console.log(
      `Updated subscription deposit amount: ${updatedSubscription.deposit_amount}`
    );

    // Additional check to ensure the type
    expect(typeof updatedSubscription.deposit_amount).toBe("string");
    console.log(
      `Type of deposit_amount: ${typeof updatedSubscription.deposit_amount}`
    );
  });

  it("cancel", async () => {
    const _input: CancelPayload = {
      subscription_id: 22,
    };

    const output = subscription.cancel(_input);

    expect(output).toBeDefined();
  });

  it('withdraw', async () => {
    const _input: WithdrawPayload = {
        subscription_id: 22,
        withdraw_amount: 1
    }
    const output = subscription.withdraw(_input);
    expect(output).toBeDefined()
})

  it("creates a new subscription and verifies it appears first in the list", async () => {
    const recipient = alice.address().hex();

    // Create a new subscription
    const createInput: CreatePayload = {
      recipient: recipient,
      deposit_amount: 1,
      start_time: Math.floor(Date.now() / 1000).toString(),
      stop_time: Math.floor(Date.now() / 1000 + 60 * 60 * 24 * 30).toString(),
      coin_type: "",
      rate_type: "day",
      amount_type: "fixed",
    };

    console.log("Creating subscription with input:", createInput);

    const createOutput = subscription.create(createInput);
    expect(createOutput).toBeDefined();
    console.log("Create output:", createOutput);

    // Fetch subscriptions
    const subscriptions: SubscriptionInfo[] =
      await subscription.getSubscriptionsByRecipient(recipient);

    console.log("Fetched subscriptions:", subscriptions);
    expect(subscriptions).toBeDefined();
    expect(Array.isArray(subscriptions)).toBe(true);
    expect(subscriptions.length).toBeGreaterThan(0);

    // Verify that subscriptions are sorted by creation time
    for (let i = 1; i < subscriptions.length; i++) {
      console.log(
        `Comparing subscription ${i - 1} (${
          subscriptions[i - 1].create_at
        }) with ${i} (${subscriptions[i].create_at})`
      );
      expect(
        parseInt(subscriptions[i - 1].create_at.toString())
      ).toBeGreaterThanOrEqual(parseInt(subscriptions[i].create_at.toString()));
    }
  }, 60000);

  it("get subscription list by recipient with correct sorting", async () => {
    const recipient =
      "0xf126877d6a8f33c501edc6ed6d8a114ae4c572a80697acd5be7eef683e36fbfa";
    const output: SubscriptionInfo[] =
      await subscription.getSubscriptionsByRecipient(recipient);

    console.log("Subscriptions by recipient:", output);
    expect(output).toBeDefined();
    expect(Array.isArray(output)).toBe(true);
    expect(output.length).toBeGreaterThan(0);

    // Verify that subscriptions are sorted by creation time
    for (let i = 1; i < output.length; i++) {
      console.log(
        `Comparing subscription ${i - 1} (${
          output[i - 1].create_at
        }) with ${i} (${output[i].create_at})`
      );
      expect(
        parseInt(output[i - 1].create_at.toString())
      ).toBeGreaterThanOrEqual(parseInt(output[i].create_at.toString()));
    }
  }, 30000);

  it("get subscription list by sender with correct sorting", async () => {
    const sender =
      "0xf126877d6a8f33c501edc6ed6d8a114ae4c572a80697acd5be7eef683e36fbfa";
    const output: SubscriptionInfo[] =
      await subscription.getSubscriptionsBySender(sender);

    console.log("Subscriptions by sender:", output);
    expect(output).toBeDefined();
    expect(Array.isArray(output)).toBe(true);
    expect(output.length).toBeGreaterThan(0);

    // Verify that subscriptions are sorted by creation time
    for (let i = 1; i < output.length; i++) {
      console.log(
        `Comparing subscription ${i - 1} (${
          output[i - 1].create_at
        }) with ${i} (${output[i].create_at})`
      );
      expect(
        parseInt(output[i - 1].create_at.toString())
      ).toBeGreaterThanOrEqual(parseInt(output[i].create_at.toString()));
    }
  }, 30000);
});
