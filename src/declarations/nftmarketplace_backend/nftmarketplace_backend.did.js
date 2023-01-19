export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'BuyNft' : IDL.Func(
        [IDL.Principal, IDL.Float64, IDL.Principal, IDL.Principal],
        [IDL.Float64],
        [],
      ),
    'FreeMintCount' : IDL.Func([], [IDL.Nat8], ['query']),
    'cancelSale' : IDL.Func([IDL.Principal], [], []),
    'getOwnedNfts' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'getSellerId' : IDL.Func([IDL.Principal], [IDL.Principal], ['query']),
    'getWalletId' : IDL.Func([], [IDL.Principal], []),
    'mint' : IDL.Func([IDL.Text, IDL.Vec(IDL.Nat8), IDL.Bool], [], []),
    'nftTosell' : IDL.Func([IDL.Principal, IDL.Principal], [], []),
    'onSale' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
