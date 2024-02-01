// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from "react";
import makeContext from "../hooks/makeContext";
import { getProvider } from "../utils/getProvider";
import { FETCH_COLLECTIONS_DATA_IDS, FETCH_COLLECTIONS_DATA_ITEM, FETCH_COLLECTIONS_FLOOR, FETCH_COLLECTION_DATA, FETCH_LISTING_DETAILS } from "../Queries";
import { AccountAddress, Network } from "@aptos-labs/ts-sdk";

interface IndexerContextValue {
    queryIndexer: (query: string, variables?: {}) => Promise<any>;
    getTopCollections: any;
    getCollectionData: any;
    getCollectionsFloor: any;
    getListingData: any;
}

export const [IndexerContext, useIndexerContext] =
  makeContext<IndexerContextValue>("IndexerContext");

interface IndexerProviderProps {
  children: React.JSX.Element;
  network: Network;
}
/**
 * Hook for Indexer Provider
 */
export default function IndexerProvider({
  children,
  network,
}: IndexerProviderProps) {
  
  async function queryIndexer<T extends {}>(query: string, variables?: {}): Promise<T> {
    const graphqlQuery = {
      query,
      variables,
    };
    return getProvider(network).queryIndexer<T>({
      query: graphqlQuery,
    });
  }

  const getTopCollections = async (): Promise<any>  => {
    // const variables = {
    //   offset: 0,
    //   limit: 25,
    // };
    try {
      const result = await queryIndexer<any>(
        FETCH_COLLECTIONS_DATA_IDS,
        // variables,
      );
      const collectionIds = result.nft_marketplace_v2_current_nft_marketplace_listings;
      const collections = await Promise.all(collectionIds.map((collectionId: string) => queryIndexer(
        FETCH_COLLECTIONS_DATA_ITEM,
        collectionId,
      )))
      const formattedCollections = collections.map((collection: any) => ({
        ...collection.current_collections_v2_by_pk,
        num_listings: collection.nft_marketplace_v2_current_nft_marketplace_listings_aggregate.aggregate.count,
        price: collection.nft_marketplace_v2_current_nft_marketplace_listings_aggregate.aggregate.sum.price
      })).sort((collectionA, collectionB) => collectionB.price - collectionA.price);
      return formattedCollections;
    } catch (error) {
      return [];
    }
  }

  const getCollectionData = async (collection_id: string): Promise<any> => {
    const variables = {
      collection_id: AccountAddress.from(collection_id).toStringLong(),
    };
    const result: any = await queryIndexer(
      FETCH_COLLECTION_DATA,
      variables,
    );
    return result.current_collections_v2[0];
  }

  const getCollectionsFloor = async (collection_id: string): Promise<any> => {
    const variables = {
      collection_id: AccountAddress.from(collection_id).toStringLong(),
    };
    const result = await queryIndexer(
      FETCH_COLLECTIONS_FLOOR,
      variables,
    );
    return result;
  }

  const getListingData = async (listing_id: string): Promise<any> => {
    const variables = {
      listing_id: AccountAddress.from(listing_id).toStringLong(),
    };
    const result: any = await queryIndexer(
      FETCH_LISTING_DETAILS,
      variables,
    );
    return result.nft_marketplace_v2_current_nft_marketplace_listings[0];
  }

  const IndexerValue = useMemo(
    () => ({
        queryIndexer,
        getTopCollections,
        getCollectionData,
        getCollectionsFloor,
        getListingData,
    }),
    [ network ],
  );

  return (
    <IndexerContext.Provider value={IndexerValue}>
      {children}
    </IndexerContext.Provider>
  );
}
