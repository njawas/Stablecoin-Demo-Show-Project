pragma solidity 0.5.13;
pragma experimental ABIEncoderV2;
import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.5/ChainlinkClient.sol";
import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.5/vendor/Ownable.sol";
import "./IERC20.sol";

contract TokenUtils{
    function mintFromDai(uint256, address) public {}

}

contract BRL_USD_Consumer is ChainlinkClient, Ownable {
  uint256 constant private ORACLE_PAYMENT = 1 * LINK;

  
  uint256 public currentPrice;
  int256 public changeDay;
  bytes32 public lastMarket;

  event RequestRealUsdPriceFulfilled(
    bytes32 indexed requestId,
    uint256 indexed price
  );

  address public daiAddress;
  address public brlxAddress;
  TokenUtils brlxInstance;

  uint32 countVaultId;
  mapping (uint32 => LockedVault) vaultData;
  mapping (address => uint32[]) userListVaults;
  struct LockedVault {
        uint256 amountLockedDai;
        uint256 amountBrlxMint;
        uint256 priceBrlxUsd;
        VaultStatus status;
        address owner;
        uint32 id;
  }
  
  event NewVault(
    address indexed user,
    uint32 vaultId
  );
  
  
    enum VaultStatus {
        NOT_EXIST,
        MINTED,
        CLOSED
    }

  constructor(address _daiAddress,  address _brlxAddress ) public Ownable() {
    setPublicChainlinkToken();
    daiAddress = _daiAddress;
    brlxAddress = _brlxAddress;
    brlxInstance = TokenUtils(_brlxAddress);
    countVaultId = 0;
  }

  
    modifier validateAmountDaiTransfer(uint256 _amount){
        uint amount = _amount * (10 ** uint256(16));
        require(
            amount <= IERC20(daiAddress).allowance(msg.sender, address(this))
            &&
            amount <= IERC20(daiAddress).balanceOf(msg.sender)

        , "Not available balance");
        _;
    }
  function calculateAmount(uint256 daiTokens) public view returns(uint256, uint256, uint256){
        uint256 convertDaiXRealRaw = daiTokens * currentPrice;
        uint256 rawBrlx = convertDaiXRealRaw * (10 ** uint256(14));
        uint256 rawDai = daiTokens * (10 ** uint256(16));
        return (convertDaiXRealRaw, rawBrlx, rawDai);
        
  }
  
  function getVaultsId(address userAddress) public view returns(LockedVault[] memory){
     uint32[] memory ids = userListVaults[userAddress];
     LockedVault[] memory vaults = new LockedVault[](ids.length);
     for (uint i=0; i<ids.length; i++) {
        vaults[i] = vaultData[ids[i]];
     }
     return vaults;
  }

  // Receive Dai amount with 2 decimals example: 2,26 = 226
  function mintBrlx(uint256 daiTokens) public {
    uint256 convertDaiXRealRaw = daiTokens * currentPrice;
    uint256 rawBrlx = convertDaiXRealRaw * (10 ** uint256(14));
    uint256 rawDai = daiTokens * (10 ** uint256(16));
    vaultData[countVaultId] = LockedVault({
        amountLockedDai: rawDai,
        amountBrlxMint: rawBrlx,
        priceBrlxUsd: currentPrice,
        status: VaultStatus.MINTED,
        owner: msg.sender,
        id: countVaultId
    });
    userListVaults[msg.sender].push(countVaultId);
    emit NewVault(msg.sender, countVaultId);
    countVaultId += 1;
    //Lock
    TokenUtils(brlxAddress).mintFromDai(rawBrlx, msg.sender);
    if (!IERC20(daiAddress).transferFrom(msg.sender, address(this), rawDai)) {
       revert(""); //make sure the transfer went ok
    }
    //Unlock
  }
  
  modifier onlyMinted(uint32 vaultId){
      require(vaultData[vaultId].status == VaultStatus.MINTED);
      _;
  }
  
  modifier onlyVaultOwner(address _owner, uint32 _vaultId){
      require(_owner == vaultData[_vaultId].owner);
      _;
  }
  
  function withdrawnDai(uint32 vaultId) public onlyMinted(vaultId) onlyVaultOwner(msg.sender, vaultId){
    vaultData[vaultId].status = VaultStatus.CLOSED;
    if (!IERC20(daiAddress).transfer(msg.sender, vaultData[vaultId].amountLockedDai)) {
        revert(""); //make sure the transfer went ok
    }
    if (!IERC20(brlxAddress).transferFrom(msg.sender, address(this), vaultData[vaultId].amountBrlxMint)) {
        revert(""); //make sure the transfer went ok
    }
  }

  function requestRealUsdPrice(address _oracle, string memory _jobId)
    public
  {
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillRealUsdPrice.selector);
    req.add("get", "https://economia.awesomeapi.com.br/json/all/USD-BRL");
    req.add("path", "USD.ask");
    req.addInt("times", 100);
    sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
  }


  function fulfillRealUsdPrice(bytes32 _requestId, uint256 _price)
    public
    recordChainlinkFulfillment(_requestId)
  {
    emit RequestRealUsdPriceFulfilled(_requestId, _price);
    currentPrice = _price;
  }

 

  function getChainlinkToken() public view returns (address) {
    return chainlinkTokenAddress();
  }

  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
    onlyOwner
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(source, 32))
    }
  }

}
