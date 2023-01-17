export const idlFactory = ({ IDL }) => {
  const NFT = IDL.Service({
    'GetCurrentPrice' : IDL.Func([], [IDL.Float64], ['query']),
    'GetDatas' : IDL.Func([IDL.Principal], [IDL.Vec(IDL.Nat8)], ['query']),
    'GetID' : IDL.Func([], [IDL.Principal], ['query']),
    'GetName' : IDL.Func([IDL.Principal], [IDL.Text], ['query']),
    'PriceHistoryArray' : IDL.Func([], [IDL.Vec(IDL.Float64)], []),
    'SetCurrentPrice' : IDL.Func([IDL.Float64], [], []),
    'UpdatePriceHistory' : IDL.Func([IDL.Float64], [], []),
  });
  return NFT;
};
export const init = ({ IDL }) => { return [IDL.Text, IDL.Vec(IDL.Nat8)]; };
