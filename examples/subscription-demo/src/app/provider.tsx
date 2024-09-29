"use client";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { config } from "process";
import React, { FC, ReactNode, useState } from "react";
const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallets = [
    // new PontemWallet(),
    // new MSafeWalletAdapter(),
    // new RiseWallet(),
    new MartianWallet(),
    new PetraWallet(),
  ];

  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  );
};

export default AppProvider;
