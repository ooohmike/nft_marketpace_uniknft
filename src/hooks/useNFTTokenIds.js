import { useEffect, useState } from "react";
import {
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
  useMoralis,
} from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useNFTTokenIds = (addrs) => {
  const { token } = useMoralisWeb3Api();
  const { chainId } = useMoralis();
  const { resolveLink } = useIPFS();
  const [NFTTokenIds, setNFTTokenIds] = useState([]);
  const {
    fetch: getNFTTokenIds,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(token.getAllTokenIds, {
    chain: chainId,
    address: addrs,
  });

  useEffect(() => {
    if(data?.result) {
        const NFTs = data.result;
        for (let NFT of NFTs) {
            if(NFT?.metadata) {
                NFT.metadata = JSON.parse(NFT.metadata);
                NFT.image = resolveLink(NFT?.metadata.image)
            }
        }
        setNFTTokenIds(NFTs);
    }
  }, [data]);

  return {
    getNFTTokenIds,
    NFTTokenIds,
    chainId,
    error,
    isLoading,
  };
};
