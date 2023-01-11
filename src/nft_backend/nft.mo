import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";


actor class NFT(name: Text, datas: [Nat8])=this{


//to record this NFT price history 
var PriceHistory = Buffer.Buffer<Float>(0); // Creates a new Buffer
stable var PriceHistoryEntries : [Float] = []; //useful to make PriceHistory stable


//
stable var currentPrice : Float = 0;


public query func GetName() : async Text{
    return name;
};

public query func GetDatas() : async [Nat8]{
    return datas;
};

public query func GetID() : async Principal {
    return Principal.fromActor(this);
};


public func UpdatePriceHistory (soldPrice : Float) : async (){
PriceHistory.add(soldPrice);
};

public func PriceHistoryArray () : async [Float] {
    return Buffer.toArray(PriceHistory);
};

public func SetCurrentPrice( price: Float) : async () {
 currentPrice := price;
};

public query func GetCurrentPrice () : async Float {
    return currentPrice;
};


//to make PriceHistory stable

system func preupgrade() {
    PriceHistoryEntries := Buffer.toArray(PriceHistory);
  };

  system func postupgrade() {
     PriceHistory := Buffer.Buffer<Float>(0);
     for ( price in PriceHistoryEntries.vals()){
        PriceHistory.add(price);
     }
  };


}//end actor class NFT