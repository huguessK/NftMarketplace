import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'Claim' : ActorMethod<[string], string>,
  'Mybalance' : ActorMethod<[string], number>,
  'Transfer' : ActorMethod<[string, string, number], string>,
  'UpdateBalance' : ActorMethod<[string, number], undefined>,
}
