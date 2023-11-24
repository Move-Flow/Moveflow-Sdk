import { SDK } from '../sdk'
import { IModule } from '../interfaces/IModule'

import BigNumber from 'bignumber.js';

import SubscriptionInfo from '../types/subscriptionInfo'
import { SubscriptionStatus } from "../types/subscriptionStatus";

import { Types } from 'aptos';

export type CreatePayload = {

  recipient: string,
  deposit_amount: number,
  start_time: string,
  stop_time: string,
  rate_type: "month" | "day" | "year" | undefined,
  amount_type: "fixed" | undefined,
  coin_type?: string,
}

export type DepositPayload = {
  subscription_id: number,
  deposit_amount: number,
  coin_type?: string,
}

export type CancelPayload = {
  subscription_id: number,
  coin_type?: string,
}

export type WithdrawPayload = {
  withdraw_amount: number,
  subscription_id: number,
  coin_type?: string,
}

const AptosCoin = '0x1::aptos_coin::AptosCoin'
const aptosConfigType = 'subscription::GlobalConfig'
const aptosSubscriptionType = 'subscription::SubscriptionInfo';

export class SubscriptionModule implements IModule {

  protected _sdk: SDK

  get sdk() {
    return this._sdk
  }

  constructor(sdk: SDK) {
    this._sdk = sdk
  }

  create(input: CreatePayload): Types.TransactionPayload_EntryFunctionPayload {

    const {
      recipient,
      deposit_amount,
      start_time,
      stop_time,
      rate_type,
      amount_type,
      coin_type,
    } = input

    const { modules } = this.sdk.networkOptions

    const _type_arguments = [coin_type ?? AptosCoin]

    const _function = `${modules.SubscriptionModule}::subscription::create`;

    const _arguments = [
      recipient,
      deposit_amount,
      start_time.toString(),
      stop_time.toString(),
      this._convertrate_typeToSeconds(rate_type),   // interval
      amount_type === "fixed" ? 10000000 : 0,      // fixed_rate
    ];

    const transaction: Types.TransactionPayload_EntryFunctionPayload = {
      type: "entry_function_payload",
      function: _function,
      arguments: _arguments,
      type_arguments: _type_arguments,
    };

    return transaction;
  }

  deposit(input: DepositPayload): Types.TransactionPayload_EntryFunctionPayload {

    const {
      deposit_amount,
      subscription_id,
      coin_type
    } = input

    const { modules } = this.sdk.networkOptions

    const _type_arguments = [coin_type ?? AptosCoin]

    const _function = `${modules.SubscriptionModule}::subscription::deposit`;


    const _arguments = [
      deposit_amount,
      subscription_id
    ]

    const transaction = {
      type: 'entry_function_payload',
      function: _function,
      type_arguments: _type_arguments,
      arguments: _arguments,
    }

    return transaction;
  }

  cancel(input: CancelPayload): Types.TransactionPayload_EntryFunctionPayload {
    const {
      subscription_id,
      coin_type,
    } = input

    const { modules } = this.sdk.networkOptions

    const _type_arguments = [coin_type ?? AptosCoin]

    const _function = `${modules.SubscriptionModule}::subscription::deposit`;

    const _arguments = [
      subscription_id
    ]

    const transaction = {
      type: 'entry_function_payload',
      function: _function,
      type_arguments: _type_arguments,
      arguments: _arguments,
    }

    return transaction;
  }

  withdraw(input: WithdrawPayload): Types.TransactionPayload_EntryFunctionPayload {
    const {
      withdraw_amount,
      subscription_id,
      coin_type,
    } = input

    const { modules } = this.sdk.networkOptions

    const _type_arguments = [coin_type ?? AptosCoin]

    const _function = `${modules.SubscriptionModule}::subscription::deposit`;

    const _arguments = [
      withdraw_amount,
      subscription_id,
    ]

    const transaction = {
      type: 'entry_function_payload',
      function: _function,
      type_arguments: _type_arguments,
      arguments: _arguments,
    }

    return transaction;
  }

  async getSubscription(subscriptionId: number): Promise<SubscriptionInfo> {


    const address = this.sdk.networkOptions.modules.SubscriptionModuleAccount;
    
    const resources = await this._sdk.client.getAccountResources(address);

    const subscriptionGlobalConfig = resources.find((r) => r.type.includes(aptosConfigType))!;

    // @ts-ignore
    const inner = subscriptionGlobalConfig.data.subscription_store.inner;   // subscriptions_store.inner.handle;

    const tableItemRequest = {
      key_type: "u64",
      value_type: `${address}::${aptosSubscriptionType}`,
      key: subscriptionId.toString(),
    };

    const subscription = await this._sdk.client.getTableItem(inner.handle, tableItemRequest);

    const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))
    const subscriptionStatus = this._getSubscriptionStatus(subscription, currTime);

    let subscriptionInfo = subscription
    subscriptionInfo.status = subscriptionStatus

    return subscriptionInfo;
  }

  async withdrawable(subscriptionId: string): Promise<number> {

    const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))

    const address = this.sdk.networkOptions.modules.DeployerAddress;

    const resources = await this._sdk.client.getAccountResources(address);
    const resGlConf = resources.find((r) => r.type.includes(aptosConfigType))!;
    // @ts-ignore
    const inSubscriptionHandle = resGlConf.data.subscriptions_store.inner.handle!;

    const tbReqSubscriptionInd = {
      key_type: "u64",
      value_type: `${address}::${aptosSubscriptionType}`,
      key: subscriptionId,
    };

    const subscription = await this._sdk.client.getTableItem(inSubscriptionHandle, tbReqSubscriptionInd);

    const status = this. _getSubscriptionStatus(subscription, currTime);

    const withdrawableAmount = this._calculateWithdrawableAmount(
      Number(subscription.start_time) * 1000,
      Number(subscription.stop_time) * 1000,
      Number(currTime),
      Number(subscription.pauseInfo.pause_at) * 1000,
      Number(subscription.last_withdraw_time) * 1000,
      Number(subscription.pauseInfo.acc_paused_time) * 1000,
      Number(subscription.interval),
      Number(subscription.rate_per_interval),
      status,
    );

    return withdrawableAmount;
  }

  async getSubscriptionsByRecipient(recipient: string): Promise<SubscriptionInfo[]> {
    
    const address = this.sdk.networkOptions.modules.SubscriptionModuleAccount;
    
    const resources = await this._sdk.client.getAccountResources(address);

    const subscriptionGlobalConfig = resources.find((r) => r.type.includes(aptosConfigType))!;

    const event_handle = `${address}::${aptosConfigType}`;

    const eventField = "subscription_events";

    const eventsAll = await this._sdk.client.getEventsByEventHandle(
      address,
      event_handle,
      eventField,
      {
        start: 0,
        limit: 1000,
      }
    );

    const eventsRecv = eventsAll.filter(event => event.data.recipient! === recipient);
    if (eventsRecv.length === 0) return [];

    const subscriptionIds = Array.from(new Set(eventsRecv.map(event => event.data.id!)));
    console.log('subscriptionIds:', subscriptionIds)
    // @ts-ignore
    const inSubscriptionHandle = subscriptionGlobalConfig.data.subscription_store.inner.handle!;
    let subscriptions: SubscriptionInfo[] = [];
    for (const subscriptionId of subscriptionIds) {
      const subscription =  await this.getSubscription(subscriptionId)
      subscriptions.push(subscription)
    }

    return subscriptions;
  }

  async getSubscriptionsBySender(sender: string): Promise<SubscriptionInfo[]> {

        
    const address = this.sdk.networkOptions.modules.SubscriptionModuleAccount;
    
    const resources = await this._sdk.client.getAccountResources(address);

    const subscriptionGlobalConfig = resources.find((r) => r.type.includes(aptosConfigType))!;

    const event_handle = `${address}::${aptosConfigType}`;

    const eventField = "subscription_events";

    const eventsAll = await this._sdk.client.getEventsByEventHandle(
      address,
      event_handle,
      eventField,
      {
        start: 0,
        limit: 1000,
      }
    );

    const eventsRecv = eventsAll.filter(event => event.data.sender! === sender);
    if (eventsRecv.length === 0) return [];

    const subscriptionIds = Array.from(new Set(eventsRecv.map(event => event.data.id!)));
    // @ts-ignore
    const inSubscriptionHandle = subscriptionGlobalConfig.data.subscription_store.inner.handle!;
    let subscriptions: SubscriptionInfo[] = [];
    for (const subscriptionId of subscriptionIds) {
      const subscription =  await this.getSubscription(subscriptionId)
      subscriptions.push(subscription)
    }

    console.log('subscriptions length:', subscriptions.length)


    return subscriptions;

  }

  // async _getEvents(params: any): Promise<any> {

    

  //   return eventsAll;
  // }

  _getSubscriptionStatus(subscription: any, currTime: bigint): SubscriptionStatus {
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
    return amount.dividedBy(10 ** 8).toFixed(6).toString();
  }

  _calculateSubscriptionedAmount(
    withdrawnAmount: number,
    start_time: number,
    stop_time: number,
    currTime: number,
    pausedAt: number,
    lastWithdrawTime: number,
    accPausedTime: number,
    interval: number,
    ratePerInterval: number,
    status: SubscriptionStatus,
  ): number {

    let withdrawable = this._calculateWithdrawableAmount(
      start_time,
      stop_time,
      currTime,
      pausedAt,
      lastWithdrawTime,
      accPausedTime,
      interval,
      ratePerInterval,
      status
    )
    return withdrawnAmount + Number(this.displayAmount(new BigNumber(Number(withdrawable))));
  }

  _calculateWithdrawableAmount(
    start_time: number,
    stop_time: number,
    currTime: number,
    pausedAt: number,
    lastWithdrawTime: number,
    accPausedTime: number,
    interval: number,
    ratePerInterval: number,
    status: SubscriptionStatus,
  ): number {
    let withdrawal = 0;
    let timeSpan = BigInt(0)
    if (currTime <= BigInt(start_time)) {
      return withdrawal
    }

    if (currTime > BigInt(stop_time)) {
      if (status === SubscriptionStatus.Completed) {
        timeSpan = BigInt(pausedAt) - BigInt(lastWithdrawTime) - BigInt(accPausedTime);
      } else {
        timeSpan = BigInt(stop_time) - BigInt(lastWithdrawTime) - BigInt(accPausedTime);
      }
    } else {
      if (status === SubscriptionStatus.Unknown) {
        timeSpan = BigInt(pausedAt) - BigInt(lastWithdrawTime) - BigInt(accPausedTime)
      } else {
        timeSpan = BigInt(currTime) - BigInt(lastWithdrawTime) - BigInt(accPausedTime);
      }
    }

    let intervalNum = Math.ceil(Number(timeSpan / BigInt(interval) / BigInt(1000)));
    withdrawal = Number(BigInt(intervalNum) * BigInt(ratePerInterval) / BigInt(1000));
    return withdrawal;
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
  };

  // create
  // cancel
  // deposit
  // withdraw

}

