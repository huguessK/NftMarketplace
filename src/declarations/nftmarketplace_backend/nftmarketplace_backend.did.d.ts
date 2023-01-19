import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'BuyNft' : ActorMethod<[Principal, number, Principal, Principal], number>,
  'FreeMintCount' : ActorMethod<[], number>,
  'cancelSale' : ActorMethod<[Principal], undefined>,
  'getOwnedNfts' : ActorMethod<[Principal], Array<Principal>>,
  'getSellerId' : ActorMethod<[Principal], Principal>,
  'getWalletId' : ActorMethod<[], Principal>,
  'mint' : ActorMethod<[string, Uint8Array, boolean], undefined>,
  'nftTosell' : ActorMethod<[Principal, Principal], undefined>,
  'onSale' : ActorMethod<[], Array<Principal>>,
}
