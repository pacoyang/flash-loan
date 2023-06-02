// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import "./interfaces/IUniswapV2Router02.sol";

contract FlashLoan is FlashLoanSimpleReceiverBase {
    address payable owner;
    constructor(address _addressProvider) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) {
        owner = payable(msg.sender);
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
      uint256 amountOwed = amount + premium;
      IERC20(asset).approve(address(POOL), amountOwed);
      return true;
    }

    function requestFlashLoan(address _token, uint256 _amount) public {
      address receiverAddress = address(this);
      address asset = _token;
      uint256 amount = _amount;
      bytes memory params = "";
      uint16 referralCode = 0;
      POOL.flashLoanSimple(
          receiverAddress,
          asset,
          amount,
          params,
          referralCode
      );
    }

    function getBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    function getUniswapPrice(
        address routerAddress,
        address sell_token,
        address buy_token,
        uint256 amount
    ) external view returns (uint256) {
        address[] memory pairs = new address[](2);
        pairs[0] = sell_token;
        pairs[1] = buy_token;
        uint256 price = IUniswapV2Router02(routerAddress).getAmountsOut(amount, pairs)[1];
        return price;
    }

    receive() external payable {}

}
