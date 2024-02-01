// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from "react";
import { InputTransactionData, } from "@aptos-labs/wallet-adapter-core";
import { TransactionResponse, ViewRequest, Network } from "@aptos-labs/ts-sdk";
import makeContext from "../hooks/makeContext";
import { getProvider } from "../utils/getProvider";

export interface TransactionContextValue {
    runTransaction: (payload: InputTransactionData) => Promise<TransactionResponse | any | undefined>
    runViewFunction: (payload: ViewRequest) => Promise< any | undefined>
}

export const [TransactionContext, useTransactionContext] =
  makeContext<TransactionContextValue>("TransactionContext");

export interface TransactionProviderProps {
  children: React.JSX.Element;
  network: Network;
  account: any; 
  signAndSubmitTransaction: any;
}
/**
 * Hook for Transaction Provider
 */
export default function TransactionProvider({
  children,
  network,
  account, 
  signAndSubmitTransaction,
}: TransactionProviderProps) {
  const provider = getProvider(network);
  const runTransaction = async (
    payload: InputTransactionData,
  ) => {
    try {
      const response = await signAndSubmitTransaction(payload);
      try {
        await provider.waitForTransaction({ transactionHash: response.hash });
        return await provider.getTransactionByHash({
          transactionHash: response.hash,
        });
      } catch (error: any) {
        return response;
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(`Failed to wait for txn ${error}`);
    }
    return undefined;
  };

  const runViewFunction = async (
    payload: ViewRequest,
  ) => {
    try {
      return await provider.view({ payload });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(`Failed to wait for txn ${error}`);
    }
  
    return undefined;
  };
  const TransactionValue = useMemo(
    () => ({
        runTransaction,
        runViewFunction
    }),
    [ account, network ],
  );

  return (
    <TransactionContext.Provider value={TransactionValue}>
      {children}
    </TransactionContext.Provider>
  );
}
