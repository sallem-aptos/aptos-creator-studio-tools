
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

/*
 * A helper central place for common code across components
 */

export const DEVNET_PROVIDER = new Aptos(
    new AptosConfig({ network: Network.DEVNET }),
  );
  export const TESTNET_PROVIDER = new Aptos(
    new AptosConfig({ network: Network.TESTNET }),
  );
  export const MAINNET_PROVIDER = new Aptos(
    new AptosConfig({ network: Network.MAINNET }),
  );

export const getProvider = (network: Network) => {
    if (network === Network.MAINNET) {
      return MAINNET_PROVIDER;
    }
    if (network === Network.TESTNET) {
      return TESTNET_PROVIDER;
    }
    if (network === Network.DEVNET) {
      return DEVNET_PROVIDER;
    }
    throw new Error("Unknown network type");
  };