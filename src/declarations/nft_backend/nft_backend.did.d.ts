import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface NFT {
  'GetCurrentPrice' : ActorMethod<[], number>,
  'GetDatas' : ActorMethod<[Principal], Uint8Array>,
  'GetDatasLA' : ActorMethod<[], Uint8Array>,
  'GetID' : ActorMethod<[], Principal>,
  'GetName' : ActorMethod<[Principal], string>,
  'PriceHistoryArray' : ActorMethod<[], Array<number>>,
  'SetCurrentPrice' : ActorMethod<[number], undefined>,
  'UpdatePriceHistory' : ActorMethod<[number], undefined>,
}
export interface _SERVICE extends NFT {}
