import Principal "mo:base/Principal";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug"; //Debug.print(debug_show(varToshow))

actor Token{

//just to test my functions 
var principletest1 : Principal = Principal.fromText("gy5kf-7rn2l-uauh5-jnfuc-wrcf2-rhbcf-eploh-6lm44-aya2e-6sz6n-5ae");
var principletest2 : Principal = Principal.fromText("ai7t5-aibaq-aaaaa-aaaaa-c");

//To persist non stable variable type ~ HashMap 
/* by using stable variable type, 
Preupgrade and postupgrade system methods*/

stable var balancesEntries : [(Principal, Float)]=[];

//can not be accessed outside of this actor
private stable var TotalSupply : Float = 1000000;

//constants : don't know for the moment if these constants will be useful to me
let TokenName : Text = "HuKou";
let TokenSymbol : Text = "HK";

//use of hashmap to store each principal ("wallet") balance
var balances= HashMap.HashMap<Principal,Float>(1, Principal.equal, Principal.hash);

//return asynchronously a given principal ("wallet") balance
//be sure that 'id' equal to the one provided by the system when calling this function ~ Security
public shared(msg) func Mybalance(id : Text) : async Float{
     let principal : Principal = Principal.fromText(id);
    if(msg.caller == principal)
    {
            switch (balances.get(principal)) {
            case null {
                return 0;
            };
            case (?mybalance) {return  mybalance};
            }
    }
    else{
        return -1;
    }
};


//to update the remaining balance of a given principal ("wallet")
public func UpdateBalance(id : Text, amount: Float) : async() {
    //amount can be negative (->withdrawal) or positive (->deposit)
    //operation to be performed only if id exists in balances Hashmap
    let principal : Principal = Principal.fromText(id);
    
             switch (balances.get(principal)) 
             {
                case null {};
                case (?mybalance) {
                    balances.put(principal, mybalance+amount);
                };
             }
    
   
};

//to transfer tokens from a wallet to another one
//amount >0
public shared(msg) func Transfer(from : Text, to: Text, amount: Float) : async Text {
    let fromprincipal : Principal = Principal.fromText(from);
    let toprincipal : Principal = Principal.fromText(to);
    if(msg.caller==fromprincipal and fromprincipal!=toprincipal){
            switch (balances.get(fromprincipal)) {
            case null {return "WalletNotFound"};
            case (?mybalance) {
                if(mybalance+amount < 0){return "NotEnoughTokens"}
                else{
                        //'from' exists in 'balances' -> possible to call the UpdateBalance method
                        await UpdateBalance(from, -amount);
                        //
                        balances.put(toprincipal, amount);
                        return "SuccessfulTransaction"
                }
            
            };
            }
    }

    else{
        return "UnauthorizedOperation"
    }
};

//function to call when a wallet claim its 10,000 HK (possibility to claim once)
public shared(msg) func Claim (id : Text) : async Text 
{
    let principal : Principal = Principal.fromText(id);
    Debug.print(debug_show(msg.caller));
    if(msg.caller==principal)
    {
            switch (balances.get(principal)) 
            {
                    case null 
                    {
                        TotalSupply -=10000;
                        if(TotalSupply < 0){return "NoLongerPossibleToClaim"}
                        else{
                            balances.put(principal, 10000);
                            return "SuccessfulTransaction"
                            } 
                    };

                    case (?mybalance) {
                        return "AlreadyClaimed"
                    };
            }
    }

else{return "UnauthorizedOperation"}

};


//https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/upgrades

system func preupgrade() {
    balancesEntries := Iter.toArray(balances.entries());
  };

  system func postupgrade() {
     balances := HashMap.fromIter<Principal,Float>(
        balancesEntries.vals(), 1, Principal.equal, Principal.hash);
  };


}//end Token actor