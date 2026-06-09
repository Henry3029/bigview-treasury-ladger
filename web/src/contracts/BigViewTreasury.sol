/*// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

// Import OpenZeppelin UPGRADEABLE contracts
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BigViewTreasury is Initializable, ReentrancyGuardUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    
    address public majorPoolAddress;
    address public devFeeAddress;
    uint256 public constant DEV_FEE_PERCENT = 5;

    struct UserRecord {
        address userAddress;
        uint256 rewardClaimed;
        uint256 failedClaimsCount;
        uint256 successfulClaimsCount;
    }

    mapping(address => uint256) public userBalances;
    mapping(address => UserRecord) public userRecords;

    event Deposited(address indexed user, uint256 amount);
    event RewardReceived(uint256 totalReward);
    event RewardClaimed(address indexed user, uint256 netReward, uint256 feeCut);
    event Unstaked(address indexed user, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // Replaces the constructor. Can only be called ONCE ever.
    function initialize(address _majorPoolAddress, address _devFeeAddress, address _initialOwner) public initializer {
        __ReentrancyGuard_init();
        __Ownable_init(_initialOwner);
        __UUPSUpgradeable_init();

        require(_majorPoolAddress != address(0), "Invalid pool address");
        require(_devFeeAddress != address(0), "Invalid dev address");
        majorPoolAddress = _majorPoolAddress;
        devFeeAddress = _devFeeAddress;
    }

    // Required by the UUPS module to restrict who can upgrade the contract logic
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function deposit(address _user, uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(_user != address(0), "Invalid user address");

        userBalances[_user] += _amount;

        if (userRecords[_user].userAddress == address(0)) {
            userRecords[_user].userAddress = _user;
        }

        bool success = IERC20(majorPoolAddress).transferFrom(msg.sender, majorPoolAddress, _amount);
        require(success, "Transfer to major pool failed");

        emit Deposited(_user, _amount);
    }

    function receiveReward(uint256 _rewardAmount) external nonReentrant {
        require(_rewardAmount > 0, "No rewards to receive");
        
        bool success = IERC20(majorPoolAddress).transferFrom(majorPoolAddress, address(this), _rewardAmount);
        require(success, "Failed to pull rewards from pool");

        emit RewardReceived(_rewardAmount);
    }

    function claimReward(address _user, uint256 _amount) public nonReentrant {
        require(userBalances[_user] > 0, "Address is not an active depositor");
        require(_amount > 0, "Cannot claim zero");

        uint256 devFeeCut = (_amount * DEV_FEE_PERCENT) / 100;
        uint256 userNetReward = _amount - devFeeCut;

        bool feeSuccess = IERC20(majorPoolAddress).transfer(devFeeAddress, devFeeCut);
        bool userSuccess = IERC20(majorPoolAddress).transfer(_user, userNetReward);

        if (feeSuccess && userSuccess) {
            userRecords[_user].rewardClaimed += _amount;
            userRecords[_user].successfulClaimsCount += 1;
            
            emit RewardClaimed(_user, userNetReward, devFeeCut);
        } else {
            userRecords[_user].failedClaimsCount += 1;
            revert("Reward distribution failed");
        }
    }

    function unstake() external nonReentrant {
        uint256 balanceToWithdraw = userBalances[msg.sender];
        require(balanceToWithdraw > 0, "No staked balance found or not a valid user");

        userBalances[msg.sender] = 0;

        bool success = IERC20(majorPoolAddress).transferFrom(majorPoolAddress, msg.sender, balanceToWithdraw);
        require(success, "Unstake withdrawal transfer failed");

        emit Unstaked(msg.sender, balanceToWithdraw);
    }
}
*/
