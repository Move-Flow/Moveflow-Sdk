### Subscription SDK

Moveflow Subscription SDK is a TypeScript SDK for interacting with Aptos smart contracts related to subscription management. It provides a set of functions to create, manage, and retrieve subscription details. This README provides an overview of the functions and their use cases.
Installation
To use this SDK in your app, you'll need to install it via npm or yarn.

```
npm install --save  @moveflow/sdk-aptos

or

yarn add  @moveflow/sdk-aptos
```

### Intitialization

To get started, you'll need to initialize the SDK with your Aptos provider URL and contract information. The following code snippet demonstrates how to do this:


```
import { AptosAccount, Network } from "aptos";
const youMnemonic = "youMnemonic"
const alice = AptosAccount.fromDerivePath("m/44'/637'/0'/0'/0'", youMnemonic);

const { subscription } = new SDK(Network.TESTNET)

```


### Write Operation
#### Create Subscription
This method allows users to create a subscription contract with various parameters, while performing validation checks on the input data. It ensures that the provided data is valid and that the user's balance is sufficient to create the subscription.

```
const _input: CreatePayload = {
    recipient: alice.address.toString(),
    deposit_amount: 1,
    start_time: Math.floor(Date.now() / 1000 ).toString(),
    stop_time: Math.floor(Date.now() / 1000  + 60 * 60 * 24 * 30).toString(),
    rate_type: 'day',
    amount_type: 'fixed'
}

const output = subscription.create(_input);
```

CreatePayload is the input data for creating the subscription. Include fields:
- recipient (string): The recipient's address for the subscription.
- deposit (number): The deposit amount for the subscription.
- coinType (string): The token address of the token for the subscription, the default is aptos.
- startTime (number): The start time of the subscription.
- stopTime (number): The stop time of the subscription.
- interval (number): The interval for the subscription.
- fixedRate (string): The fixed rate for the subscription.

#### Deposit Funds from sender
This method allows the sender to deposit funds to a specific subscription, performing validation checks on the subscription ID and deposit amount. It also checks if the sender's balance is sufficient for the deposit.

```
/**
 * Deposit funds from the sender to a subscription.
 *
 * @param {DepositFromSenderInput} input - The input data for depositing funds.
 * @returns {Promise<boolean>} Returns `true` if the deposit was successful.
 * @throws {Error} Throws an error if validation checks fail or the deposit operation fails.
 */
const depositeFromSender = async (input: DepositFromSenderInput): Promise<boolean> => {
  // ... code ...
};

```

##### Example usage:
```

const depositData = {
  subscriptionId: 1, // ID of the subscription to deposit to
  amount: 0.1, // Amount to deposit in ETH
};

try {
        await subscription.deposit(depositData);
} catch (error) {
        //...
}

```
DepositFromSenderInput is the input data for depositing funds. Include fields:
- subscriptionId (number): The ID of the subscription to deposit to.
- amount (number): The amount to deposit to the subscription.


#### Withdraw Funds from subscription
This method initiates a withdrawal from the recipient's side of the subscription. It validates the subscription ID and withdrawal amount, ensuring they are valid and positive.

```
/**
 * Withdraw funds from the recipient's side of the subscription.
 *
 * @param {WithdrawPayload} input - The input data for withdrawal.
 * @returns {Promise<boolean>} Returns `true` if the withdrawal was successful.
 * @throws {Error} Throws an error if validation checks fail or the withdrawal operation fails.
 */
const withdrawFromRecipient = async (input: WithdrawPayload): Promise<boolean> => {
  // ... code ...
};

```


##### Example usage:
```
const _withdrawInput: WithdrawPayload = {
    subscription_id: 22,        // ID of the subscription to withdraw from
    withdraw_amount: 1          // Amount to withdraw in Aptos
}

try {
    const output = subscription.withdraw(_withdrawInput);
} catch (error) {
        //...
}

```

WithdrawPayload is the input data for withdrawing funds. Include fields:
- subscriptionId (number): The ID of the subscription to withdraw tokens from.
- amount (number): The amount of tokens to withdraw.

####  Cancel a Subscription
This method allows the sender or recipient to cancel a subscription. Before canceling a subscription, the recipient must have completed all withdrawals. After canceling the subscription, any remaining funds will be refunded to the sender.

```
/**
 * Cancel the subscription.
 *
 * @param {subscriptionId} input - The Subscription id.
 * @returns {Promise<boolean>} Returns `true` if the withdrawal was successful.
 * @throws {Error} Throws an error if validation checks fail or the withdrawal operation fails.
 */
const withdraw = async (input: subscriptionId): Promise<boolean> => {
  // ... code ...
};
```

##### Example usage:

```
const specificSubscriptionId = "your subscription id";

try {
    const result = await subscription.withdraw(BigInt(specificSubscriptionId));
} catch (error) {
  // ...
}

```

- subscriptionId(number): subscriptionId is the only input field. The ID of the subscription to cancel.


### Query Subscription API 

Query subscription API
#### List subscriptions of the specific sender
The API list subscriptions created by a specific sender.
const senderSubscriptionData = await subscription.getSubscriptionsBySender(_sender);
const subscriptions = senderSubscriptionData.subscriptionLists;
The input parameters for list subscriptions created by a specific sender include:
- sender: the address of sender.

#### List subscription of the specific recipient
The API list subscriptions received by a specific recipient. The query API supports paginate.
const recipientSubscriptionData = await subscription.getSubscriptionsByRecipient("0xRecipientAddress");

The input parameters for list subscriptions received by a specific recipient include:
- recipient: address of recipient.