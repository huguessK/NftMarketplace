export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'Claim' : IDL.Func([IDL.Text], [IDL.Text], []),
    'Mybalance' : IDL.Func([IDL.Text], [IDL.Float64], []),
    'Transfer' : IDL.Func([IDL.Text, IDL.Text, IDL.Float64], [IDL.Text], []),
    'UpdateBalance' : IDL.Func([IDL.Text, IDL.Float64], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
