import { SDK } from "../sdk";
import { IModule } from "../interfaces/IModule";

import BigNumber from "bignumber.js";

import SubscriptionInfo from "../types/subscriptionInfo";
import { SubscriptionStatus } from "../types/subscriptionStatus";

import { composeType } from "../utils";
import { InputTransactionData, Types } from "@aptos-labs/wallet-adapter-core";
import { removeDuplicateSubscription } from "../utils/duplicate";

// Define payload types
export type CreatePayload = {
  recipient: string;
  deposit_amount: number;
  start_time: string;
  stop_time: string;
  rate_type: "month" | "day" | "year" | undefined;
  amount_type: "fixed" | undefined;
  coin_type?: string;
};

export type DepositPayload = {
  subscription_id: number;
  deposit_amount: number;
  coin_type?: string;
};

export type CancelPayload = {
  subscription_id: number;
  coin_type?: string;
};

export type WithdrawPayload = {
  withdraw_amount: number;
  subscription_id: number;
  coin_type?: string;
};

const AptosCoin = "0x1::aptos_coin::AptosCoin";
const aptosConfigType = "subscription::GlobalConfig";
const aptosSubscriptionType = "subscription::SubscriptionInfo";

export class SubscriptionModule implements IModule {
  protected _sdk: SDK;

  get sdk() {
    return this._sdk;
  }

  constructor(sdk: SDK) {
    this._sdk = sdk;
  }

  // Utility function to wrap SDK payloads into InputTransactionData
  private wrapTransactionPayload(sdkPayload: any): InputTransactionData {
    return {
      data: {
        function: sdkPayload.function as `${string}::${string}::${string}`,
        typeArguments: sdkPayload.type_arguments,
        functionArguments: sdkPayload.arguments,
      },
    };
  }

  // Create method
  create(input: CreatePayload): InputTransactionData {
    const {
      recipient,
      deposit_amount,
      start_time,
      stop_time,
      rate_type,
      amount_type,
      coin_type,
    } = input;

    const { modules } = this.sdk.networkOptions;
    const functionName = composeType(modules.SubscriptionModule, "create");

    const sdkPayload: Types.TransactionPayload_EntryFunctionPayload = {
      type: "entry_function_payload", // Add this line
      function: functionName,
      type_arguments: [coin_type || AptosCoin],
      arguments: [
        recipient,
        deposit_amount,
        start_time.toString(),
        stop_time.toString(),
        this._convertrate_typeToSeconds(rate_type), // interval
        amount_type === "fixed" ? 10000000 : 0, // fixed_rate
      ],
    };

    // Use the utility method to wrap the payload
    return this.wrapTransactionPayload(sdkPayload);
  }

  deposit(input: DepositPayload): InputTransactionData {
    const { deposit_amount, subscription_id, coin_type } = input;

    const { modules } = this.sdk.networkOptions;
    let functionName = composeType(modules.SubscriptionModule, "deposit");
    functionName = removeDuplicateSubscription(functionName);

    console.log("function name from deposit", functionName);

    const sdkPayload: Types.TransactionPayload_EntryFunctionPayload = {
      type: "entry_function_payload",
      function: functionName,
      type_arguments: [coin_type || AptosCoin],
      arguments: [deposit_amount.toString(), subscription_id],
    };

    // Use the utility method to wrap the payload
    return this.wrapTransactionPayload(sdkPayload);
  }

  cancel(input: CancelPayload): InputTransactionData {
    const { subscription_id, coin_type } = input;

    const { modules } = this.sdk.networkOptions;
    const functionName = composeType(modules.SubscriptionModule, "cancel");

    // Log the function name for debugging
    console.log("Function name from cancel:", functionName);

    const sdkPayload: Types.TransactionPayload_EntryFunctionPayload = {
      type: "entry_function_payload", // Ensure consistent payload structure
      function: functionName,
      type_arguments: [coin_type || AptosCoin],
      arguments: [subscription_id],
    };

    // Use the utility method to wrap the payload
    return this.wrapTransactionPayload(sdkPayload);
  }

  withdraw(input: WithdrawPayload): InputTransactionData {
    const { withdraw_amount, subscription_id, coin_type } = input;

    const { modules } = this.sdk.networkOptions;
    const functionName = composeType(modules.SubscriptionModule, "withdraw");

    // Log the function name for debugging
    console.log("Function name from withdraw:", functionName);

    const sdkPayload: Types.TransactionPayload_EntryFunctionPayload = {
      type: "entry_function_payload", // Ensure consistent payload structure
      function: functionName,
      type_arguments: [coin_type || AptosCoin],
      arguments: [withdraw_amount.toString(), subscription_id],
    };

    // Use the utility method to wrap the payload
    return this.wrapTransactionPayload(sdkPayload);
  }

  async getSubscription(subscriptionId: number): Promise<SubscriptionInfo> {
    const address = this.sdk.networkOptions.modules.SubscriptionModuleAccount;

    const resources = await this._sdk.client.getAccountResources(address);

    const subscriptionGlobalConfig = resources.find((r) =>
      r.type.includes(aptosConfigType)
    )!;
    // @ts-ignore
    const inner = subscriptionGlobalConfig.data.subscription_store.inner; // subscriptions_store.inner.handle;

    const tableItemRequest = {
      key_type: "u64",
      value_type: `${address}::${aptosSubscriptionType}`,
      key: subscriptionId.toString(),
    };

    const subscription = await this._sdk.client.getTableItem(
      inner.handle,
      tableItemRequest
    );

    const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()));
    const subscriptionStatus = this._getSubscriptionStatus(
      subscription,
      currTime
    );

    let subscriptionInfo = subscription;
    subscriptionInfo.status = subscriptionStatus;

    return subscriptionInfo;
  }

  async getSubscriptionsByRecipient(
    recipient: string
  ): Promise<SubscriptionInfo[]> {
    const address = this.sdk.networkOptions.modules.SubscriptionModuleAccount;
    const event_handle = `${address}::${aptosConfigType}`;
    const eventField = "subscription_events";

    let subscriptions: SubscriptionInfo[] = [];
    let start = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const eventsChunk = await this._sdk.client.getEventsByEventHandle(
        address,
        event_handle,
        eventField,
        {
          start,
          limit,
        }
      );

      const eventsRecv = eventsChunk.filter(
        (event) => event.data.recipient === recipient
      );

      for (const event of eventsRecv) {
        try {
          const subscription = await this.getSubscription(event.data.id);
          subscriptions.push(subscription);
        } catch (error) {
          console.error(`Error fetching subscription ${event.data.id}:`, error);
        }
      }

      start += limit;
      hasMore = eventsChunk.length === limit;
    }

    subscriptions.sort((a, b) => b.create_at - a.create_at);

    // // Log the newest subscription
    // if (subscriptions.length > 0) {
    //   console.log("Newest subscription:", subscriptions[0]);
    // } else {
    //   console.log("No subscriptions found for this sender.");
    // }

    return subscriptions;
  }

  async getSubscriptionsBySender(sender: string): Promise<SubscriptionInfo[]> {
    const address = this.sdk.networkOptions.modules.SubscriptionModuleAccount;
    const event_handle = `${address}::${aptosConfigType}`;
    const eventField = "subscription_events";

    let subscriptions: SubscriptionInfo[] = [];
    let start = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const eventsChunk = await this._sdk.client.getEventsByEventHandle(
        address,
        event_handle,
        eventField,
        {
          start,
          limit,
        }
      );

      const eventsSent = eventsChunk.filter(
        (event) => event.data.sender === sender
      );

      for (const event of eventsSent) {
        try {
          const subscription = await this.getSubscription(event.data.id);
          subscriptions.push(subscription);
        } catch (error) {
          console.error(`Error fetching subscription ${event.data.id}:`, error);
        }
      }

      start += limit;
      hasMore = eventsChunk.length === limit;
    }

    // Sort subscriptions by creation time, newest first
    subscriptions.sort((a, b) => b.create_at - a.create_at);

    // // Log the newest subscription
    // if (subscriptions.length > 0) {
    //   console.log("Newest subscription:", subscriptions[0]);
    // } else {
    //   console.log("No subscriptions found for this sender.");
    // }

    return subscriptions;
  }

  // async _getEvents(params: any): Promise<any> {

  //   return eventsAll;
  // }

  _getSubscriptionStatus(
    subscription: any,
    currTime: bigint
  ): SubscriptionStatus {
    if (currTime < BigInt(subscription.start_time) * BigInt(1000)) {
      return SubscriptionStatus.Scheduled;
    }
    if (Boolean(subscription.closed)) {
      return SubscriptionStatus.Closed;
    }
    if (currTime > BigInt(subscription.stop_time) * BigInt(1000)) {
      return SubscriptionStatus.Completed;
    }
    return SubscriptionStatus.Unknown;
  }

  displayAmount(amount: BigNumber): string {
    return amount
      .dividedBy(10 ** 8)
      .toFixed(6)
      .toString();
  }

  _convertrate_typeToSeconds(rate_type: "month" | "day" | "year" | undefined) {
    const intervals = [
      {
        value: 1000 * 60 * 60 * 24,
        label: "day",
      },
      {
        value: 1000 * 60 * 60 * 24 * 30,
        label: "month",
      },
      {
        value: 1000 * 60 * 60 * 24 * 365,
        label: "year",
      },
    ];

    const selectedInterval = intervals.find(
      (interval) => interval.label === rate_type
    );

    if (selectedInterval) {
      return selectedInterval.value / 1000; // Convert milliseconds to seconds
    }
    return 0;
  }

  // create
  // cancel
  // deposit
  // withdraw
}
