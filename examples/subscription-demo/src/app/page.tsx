"use client";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { Network } from "aptos";
import {
  InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { WalletReadyState } from "@aptos-labs/wallet-adapter-core";
import SDK from "@moveflow/sdk-aptos";
import { useCallback } from "react";
import SubscriptionInfo from "@moveflow/sdk-aptos/dist/tsc/types/subscriptionInfo";
type SDKInstance = SDK | null;
const testnet = "https://testnet.aptoslabs.com";

const networkMap: Record<string, Network> = {
  "https://testnet.aptoslabs.com": Network.TESTNET,
  // Add other mappings as needed
};

const getNetworkUrl = (network: Network): string => {
  switch (network) {
    case Network.TESTNET:
      return "https://testnet.aptoslabs.com";
    case Network.MAINNET:
      return "https://mainnet.aptoslabs.com";
    case Network.DEVNET:
      return "https://devnet.aptoslabs.com";
    default:
      return "Unknown network URL";
  }
};

const initSDK = (): SDKInstance => {
  try {
    const network = networkMap[testnet];
    if (!network) {
      throw new Error(`No matching Network enum for URL: ${testnet}`);
    }
    const networkUrl = getNetworkUrl(network);
    console.log("Initializing SDK with network:", network);
    console.log("Using network URL:", networkUrl);
    const sdk = new SDK(network);
    console.log("SDK initialized successfully");
    return sdk;
  } catch (error) {
    console.error("Error initializing SDK:", error);
    return null;
  }
};

const PrettyJsonDisplay: React.FC<{ data: SubscriptionInfo }> = ({ data }) => {
  return (
    <pre className="bg-gray-800 p-4 rounded overflow-x-auto text-sm">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default function Home() {
  const [sdkInstance, setSdkInstance] = useState<SDKInstance | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionInfo[]>([]); // Specify type here
  const [subscriptionType, setSubscriptionType] = useState("");

  const {
    signAndSubmitTransaction,
    wallets,
    wallet,
    connect,
    connected,
    account,
    disconnect,
  } = useWallet();

  useEffect(() => {
    if (connected && account) {
      const sdk = initSDK();
      if (sdk) {
        setSdkInstance(sdk);
      }
    }
  }, [connected, account]); // Only triggers when wallet is connected

  const handleWalletButtonClick = async (val: any) => {
    try {
      if (!connected || wallet?.name !== val.name) {
        if (val.readyState === WalletReadyState.NotDetected) {
          window.open(val.url, "_blank");
        } else {
          await connect(val.name);
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const create = async () => {
    if (!sdkInstance) {
      console.error("SDK not initialized");
      return;
    }

    // Define start and stop times as Unix timestamps
    const start_time = Math.floor(Date.now() / 1000).toString();
    const stop_time = Math.floor(Date.now() / 1000 + 60 * 60 * 24).toString();

    try {
      const sdkPayload = sdkInstance.subscription.create({
        recipient:
          "0xf126877d6a8f33c501edc6ed6d8a114ae4c572a80697acd5be7eef683e36fbfa",
        deposit_amount: 100000000,
        start_time: start_time,
        stop_time: stop_time,
        rate_type: "day",
        amount_type: "fixed",
        coin_type: "0x1::aptos_coin::AptosCoin",
      });

      const txid = await signAndSubmitTransaction(sdkPayload);
      console.log("Transaction ID:", txid);
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  const withdraw = async () => {
    if (!sdkInstance) {
      console.error("SDK not initialized");
      return;
    }

    const sdkPayload = sdkInstance.subscription.withdraw({
      subscription_id: 117,
      withdraw_amount: 100000000,
      coin_type: "", // Optional, defaults to AptosCoin in the module
    });

    try {
      const txid = await signAndSubmitTransaction(sdkPayload);
      console.log("Withdraw Transaction ID:", txid);
      alert(`Withdrawal completed. Transaction ID: ${txid}`);
    } catch (error) {
      console.error("Error withdrawing:", error);
      alert("Error withdrawing. Check console for details.");
    }
  };

  const deposit = async () => {
    if (!sdkInstance) {
      console.error("SDK not initialized");
      return;
    }

    // Generate the SDK payload
    const sdkPayload = sdkInstance.subscription.deposit({
      subscription_id: 117,
      deposit_amount: 10000000,
      coin_type: "0x1::aptos_coin::AptosCoin",
    });

    // Log the SDK payload and function name for debugging
    console.log("SDK Payload:", sdkPayload);

    try {
      // Submit the transaction and log the transaction ID
      const txid = await signAndSubmitTransaction(sdkPayload);
      console.log("Deposit Transaction ID:", txid);
      alert(`Deposit completed. Transaction ID: ${txid}`);
    } catch (error) {
      console.error("Error depositing:", error);
      alert("Error depositing. Check console for details.");
    }
  };

  const cancel = async () => {
    if (!sdkInstance) {
      console.error("SDK not initialized");
      return;
    }

    const payload = sdkInstance.subscription.cancel({
      subscription_id: 117,
      coin_type: "", // Optional, defaults to AptosCoin in the module
    });

    try {
      const txid = await signAndSubmitTransaction(payload);
      console.log("Cancel Transaction ID:", txid);
      alert(`Subscription cancelled. Transaction ID: ${txid}`);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("Error cancelling subscription. Check console for details.");
    }
  };

  const getSubscriptionsByRecipient = async () => {
    if (!sdkInstance) {
      console.error("SDK not initialized");
      return;
    }

    try {
      const output = await sdkInstance.subscription.getSubscriptionsByRecipient(
        "0xf126877d6a8f33c501edc6ed6d8a114ae4c572a80697acd5be7eef683e36fbfa"
      );
      setSubscriptions(output);
      setSubscriptionType("recipient");
      console.log("Subscriptions by recipient:", output);
    } catch (error) {
      console.error("Error getting subscriptions by recipient:", error);
      alert("Error getting subscriptions. Check console for details.");
    }
  };

  const getSubscriptionsBySender = async () => {
    if (!sdkInstance) {
      console.error("SDK not initialized");
      return;
    }

    try {
      const output = await sdkInstance.subscription.getSubscriptionsBySender(
        "0xf126877d6a8f33c501edc6ed6d8a114ae4c572a80697acd5be7eef683e36fbfa"
      );
      setSubscriptions(output);
      setSubscriptionType("sender");
      console.log("Subscriptions by sender:", output);
    } catch (error) {
      console.error("Error getting subscriptions by sender:", error);
      alert("Error getting subscriptions. Check console for details.");
    }
  };
  const petraWallet = wallets!.find((wallet) => wallet.name === "Petra");
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="flex justify-end mb-8">
        {!connected ? (
          petraWallet && (
            <button
              onClick={() => handleWalletButtonClick(petraWallet)}
              disabled={petraWallet.readyState !== WalletReadyState.Installed}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Connect Petra
            </button>
          )
        ) : (
          <button
            onClick={disconnect}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect {account?.address.slice(0, 6)}...
          </button>
        )}
      </header>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={create}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Subscription
        </button>
        <button
          onClick={deposit}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Deposit
        </button>
        <button
          onClick={cancel}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          onClick={withdraw}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Withdraw
        </button>
        <button
          onClick={getSubscriptionsByRecipient}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Get Subscription by Recipient
        </button>
        <button
          onClick={getSubscriptionsBySender}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Get Subscription by Sender
        </button>
      </div>

      {subscriptions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Subscriptions{" "}
            {subscriptionType === "sender" ? "by Sender" : "for Recipient"}:
          </h2>
          <div className="space-y-4 max-w-full overflow-hidden">
            {subscriptions.map((sub, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded">
                <h3 className="text-lg font-semibold mb-2">
                  Subscription {index + 1}
                </h3>
                <PrettyJsonDisplay data={sub} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
