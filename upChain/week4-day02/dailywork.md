# 设计一个合约，具备IDO的能力，具备以下能力：
1、项目方接收ETH作为募集资金，总量设置为100个ETH，硬顶（最大募集的资金上限）为200ETH。
2、用户通过调用preSale方法，向项目方支付ETH，可以获得RNT代币，1ETH可以购买1000个RNT代币。
3、IDO结束的时候，用户可以领取代币，我们将这个方法名称设置为claimTokens
4、用户claimTokens的时候，会存在两种情况，IDO失败，也就是没有筹集到预期的100个ETH,此时用户 cliamToken的时候，会将自己存入合约的以太坊取回来。如果IDO成功，用户取出来的代币就是RNT代币。
5、IDO合约中会有一个withdraw的方法，这个方法只有在IDO成功的时候，才能调用。

## 题解思路：
1、alice 向IDO合约中转入了10个ETH
2、bob 向IDO合约中转入了90个ETH
3、此时已经到达了100枚ETH的最少募集目标
4、此时alice可以通过claimToken的函数将RNT的token取回自己的钱包。计算公式: 
  alice投入的 10个ETH * 1000比率 / 100个总共的ETH = 100个RNT代币。
  bob投入的 90个ETH * 1000比率 / 100个总共的ETH = 900个RNT代币。
5、此时就就可以断言对应的买家获得代币数量了。

# 设计一个合约，实现一个质押机制，实现以下功能：
1、项目方IDO的形式募资，用户可以通过ETH从项目方的手中购买了一种叫做RNT的ERC20 Token。这部分IDO的代币，可能只占项目方RNT代币的5%。
2、项目方还有一个质押奖励机制，项目方有一个stakePool的质押合约。用户可以先授权这个合约使用自己的RNT代币, 然后就可以将代币放入stakePool合约中赚取收益。
3、为了节省用户的GAS消耗，我们将RNT这个Token设计成符合ERC2612的标准，用户可以通过链下签名的方式进行授权，这样可以减少GAS消耗。
4、用户不仅仅可以质押，还可以随时解除质押。
5、我们一般按照时间线的维度来算用户的质押收益，随着时间的流逝，用户可能在这个过程中不断地增加质押和解除质押，为了避免频繁的计算收益，我们会根据用户上次操作的时间，记录他未提取的奖励，这样，用最新的一次操作时间减去上次操作的时间计算本次周期的奖励再加上之前的已经算过的累计收益。
6、我们会设计一个mapping，这个结构体的key是用户的地址，value 是一个结构体，结构体中至少包含三个字段 stateAmount:用户质押的数量，updateTime:用户上次操作的时间，unclaimAmount: 用户还没有提取的收益。每次用户执行stake或者unstake操作的时候，我们更新stateAmount和updateTime这两个字段，同时更新unclaimAmount字段的值。
7、用户可以执行claim操作来领取收益，这个操作是用户在stakepool合约中执行的，执行的时候同时就会mint esRNT给用户，不过在mint之前，应该将用户的等值的RNT从stakepool中转移到esRNT中。而不是直接将RNT的ERC20Token给用户，而是esRNT, esRNT是锁仓性质的RNT,1个esRNT在30天之后可以1比1兑换为一个RNT,所以它是线性解锁的，也支持提前解锁，但是没有到期的部分，也就是被锁定的部分的RNT会按照天数比例燃烧掉。
8、esRNT线性解锁的时间是30天, 到了30天，用户手中的esRNT可以全部兑换为RNT回到用户的钱包。
9、esRNT中应该有一个结构体，名字叫做lockInfo, 这个结构体包含以下字段,用户的地址，锁仓的esRNT的数量，锁仓的时间。
10、esRNT中还应该有一个数组，名字叫做lockArr, 每一次mint esRNT的时候, 都会将 lockInfo push进去。
11、esRNT中还有一个burn函数，会传入一个id字段，去数组中匹配lockInfo，从中取出锁仓的esRNT的数量，和 锁仓的时间，从而计算在当下的这个时间点。用户可以取出多少的RNT.


题目#1
编写一个质押挖矿合约，实现如下功能：

用户随时可以质押项目方代币 RNT(自定义的ERC20) ，开始赚取项目方Token(esRNT)；
可随时解押提取已质押的 RNT；
可随时领取esRNT奖励，每质押1个RNT每天可奖励 1 esRNT;
esRNT 是锁仓性的 RNT， 1 esRNT 在 30 天后可兑换 1 RNT，随时间线性释放，支持提前将 esRNT 兑换成 RNT，但锁定部分将被 burn 燃烧掉。


## 题解思路：
整体的设计中包括了ERC20的Token合约（RNT和esRNT）和一个质押合约（stakePool）。

### 1. ERC20 Token合约 (RNT)
- 实现一个标准的`ERC20 Token`合约，符合`ERC2612`标准以支持链下签名授权。
- 用于项目方通过IDO募资，用户购买`RNT Token`。

### 2. 质押合约 (stakePool)
- 用户可以将他们的`RNT Token`授权给质押合约并进行质押。
- 用户可以随时解除质押并提取收益。
- 质押和解除质押的收益计算基于用户的操作时间。
- 使用mapping结构体来记录用户的质押信息，包括质押数量、上次操作时间和未提取的收益。

### 3. 锁仓Token合约 (esRNT)
- 用户在`claim`收益时会`mint esRNT`给用户。
- esRNT是锁仓性质的RNT，30天后可以1比1兑换为RNT。
- 支持提前解锁，但未到期部分按天数比例燃烧。

### 4. 合约详细设计

在用户执行claim操作时，先将等值的RNT代币转移到esRNT合约中，然后再铸造esRNT给用户，最后burn掉的是RNT而不是esRNT。

### 1. ERC20 Token合约 (RNT)
```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract RNT is ERC20, ERC20Permit {
    constructor(uint256 initialSupply) ERC20("RNT Token", "RNT") ERC20Permit("RNT Token") {
        _mint(msg.sender, initialSupply);
    }
}
```

### 2. 质押合约 (StakePool)
```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./RNT.sol";
import "./esRNT.sol";

contract StakePool {
    using SafeERC20 for RNT;

    RNT public rntToken;
    esRNT public esrntToken;
    uint256 public rewardRate; // 奖励利率

    struct UserInfo {
        uint256 stakedAmount;
        uint256 updateTime;
        uint256 unclaimedAmount;
    }

    mapping(address => UserInfo) public userInfo;

    constructor(RNT _rntToken, esRNT _esrntToken, uint256 _rewardRate) {
        rntToken = _rntToken;
        esrntToken = _esrntToken;
        rewardRate = _rewardRate;
    }

    function stake(uint256 amount) external {
        UserInfo storage user = userInfo[msg.sender];

        // 更新用户未提取的收益
        user.unclaimedAmount += (block.timestamp - user.updateTime) * user.stakedAmount / 86400;

        // 更新用户的质押数量和最后操作时间
        user.stakedAmount += amount;
        user.updateTime = block.timestamp;

        // 将RNT转移到质押合约中
        rntToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    function unstake(uint256 amount) external {
        UserInfo storage user = userInfo[msg.sender];

        require(user.stakedAmount >= amount, "Insufficient staked amount");

        // 更新用户未提取的收益
        user.unclaimedAmount += (block.timestamp - user.updateTime) * user.stakedAmount * rewardRate / 1e18;

        // 更新用户的质押数量和最后操作时间
        user.stakedAmount -= amount;
        user.updateTime = block.timestamp;

        // 将RNT从质押合约转移回用户
        rntToken.safeTransfer(msg.sender, amount);
    }

    function claim() external {
        UserInfo storage user = userInfo[msg.sender];

        // 计算用户当前周期的收益
        uint256 reward = user.unclaimedAmount + (block.timestamp - user.updateTime) * user.stakedAmount * rewardRate / 1e18;

        // 重置用户的未提取收益和最后操作时间
        user.unclaimedAmount = 0;
        user.updateTime = block.timestamp;

        // 将等值的RNT从质押池转移到esRNT合约
        rntToken.safeTransfer(address(esrntToken), reward);

        // mint esRNT给用户
        esrntToken.mint(msg.sender, reward);
    }
}
```

### 3. 锁仓Token合约 (esRNT)
```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract esRNT is ERC20 {
    struct LockInfo {
        address user;
        uint256 amount;
        uint256 lockTime;
    }

    IERC20 public rntToken;
    LockInfo[] public lockArr;
    uint256 public lockPeriod = 30 days;

    constructor(IERC20 _rntToken) ERC20("Escrowed RNT", "esRNT") {
        rntToken = _rntToken;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);

        // 记录锁仓信息
        lockArr.push(LockInfo({
            user: to,
            amount: amount,
            lockTime: block.timestamp
        }));
    }

    function burn(uint256 id) external {
        require(id < lockArr.length, "Invalid lock ID");

        LockInfo storage lockInfo = lockArr[id];
        require(lockInfo.user == msg.sender, "Not lock owner");

        uint256 unlockableAmount = (block.timestamp - lockInfo.lockTime) * lockInfo.amount / lockPeriod;

        if (unlockableAmount > lockInfo.amount) {
            unlockableAmount = lockInfo.amount;
        }

        uint256 burnAmount = lockInfo.amount - unlockableAmount;

        // 更新锁仓信息
        lockInfo.amount = 0;

        // 燃烧未解锁部分
        rntToken.transfer(address(0), burnAmount);

        // 转移可解锁部分RNT给用户
        rntToken.transfer(msg.sender, unlockableAmount);
    }
}
```

### 4. 合约交互流程
- 用户通过IDO购买RNT Token。
- 用户授权质押合约使用其RNT Token。
- 用户可以将RNT Token质押到质押合约中以赚取收益。
- 用户可以随时解除质押并提取RNT Token。
- 用户可以随时提取质押收益，收益以esRNT的形式发放。
- esRNT在30天后可以按1:1的比例兑换为RNT，未到期部分可以提前解锁但会按比例燃烧。

这套合约设计旨在提供一个灵活且节省GAS的质押和收益领取机制，同时通过esRNT的锁仓和线性解锁机制激励用户长期持有代币。

## 整体的验证流程：
1、账号1作为项目方的钱包地址，用来部署合约。
2、先部署的合约是 RNTToken, 部署得到的就是一个普通的ERC20 Token ' 0x46838A4cb6436d37F416Fc19FF38305E5c581096 '
3、然后部署 EsRNT合约，这个合约，需要使用 RNTToken 作为入参。' 0xC71f2A7b0B004d26f86fa7d3C780419FaaA6e65D '
4、部署 stakepool 合约： ' 0x6dDd8087792349378A70C2a443874c2d3204322f '
5、账号1给账号2转了一部分的RNT, 这个动作相当于账号2做了IDO。