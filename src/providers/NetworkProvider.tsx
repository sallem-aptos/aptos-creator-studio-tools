// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import makeContext from "../hooks/makeContext";

export interface NetworkContextValue {
  network: Network
}

export const [NetworkContext, useNetworkContext] =
  makeContext<NetworkContextValue>("NetworkContext");

interface NetworkProviderProps {
  children: Element;
  accountNetwork: any;
}
/**
 * Hook for Network Provider
 */
export default function NetworkProvider({
  children,
  accountNetwork,
}: NetworkProviderProps) {
  const NetworkValue = useMemo(
    () => ({
        network: accountNetwork?.name ? accountNetwork?.name.toLocaleLowerCase() as Network : Network.MAINNET,
    }),
    [ accountNetwork ],
  );

  return (
    <NetworkContext.Provider value={NetworkValue}>
      {children}
    </NetworkContext.Provider>
  );
}
