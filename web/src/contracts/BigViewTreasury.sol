// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

// Import OpenZeppelin's ReentrancyGuard for security
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20";

contract BigViewTreasury is ReentrancyGuard {
    
    // --- State Variables ---
    address public majorPoolAddress;
    address public devFeeAddress;
    uint256 public constant DEV_FEE_PERCENT = 5; // 5% fee

    // --- Data Structures ---
    struct UserRecord {
        address userAddress;
        uint256 rewardClaimed;
        uint256 failedClaimsCount;
        uint256 successfulClaimsCount;
    }

    // --- Mappings (The Global Maps) ---
    // Tracks the raw underlying principal amount deposited by each user
    mapping(address => uint256) public userBalances;
    
    // Tracks the structural metrics and history for each user
    mapping(address => UserRecord) public userRecords;

    // --- Events (Good for frontend tracking) ---
    event Deposited(address indexed user, uint256 amount);
    event RewardReceived(uint256 totalReward);
    event RewardClaimed(address indexed user, uint256 netReward, uint256 feeCut);
    event Unstaked(address indexed user, uint256 amount);

    // --- Constructor ---
    constructor(address _majorPoolAddress, address _devFeeAddress) {
        require(_majorPoolAddress != address(0), "Invalid pool address");
        require(_devFeeAddress != address(0), "Invalid dev address");
        majorPoolAddress = _majorPoolAddress;
        devFeeAddress = _devFeeAddress;
    }

    // --- Core Functions ---

    /**
     * @notice Collects user deposit and instantly forwards it to the major pool.
     */
    function deposit(address _user, uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(_user != address(0), "Invalid user address");

        // 1. Update the global user balance map
        userBalances[_user] += _amount;

        // 2. Initialize the user struct if it's their first time
        if (userRecords[_user].userAddress == address(0)) {
            userRecords[_user].userAddress = _user;
        }

        // 3. Collect the deposit from the caller (Assumes native/wrapped token transfer)
        // For simplicity, using a token pattern here. If using raw native ETH, you would use msg.value instead.
        bool success = IERC20(majorPoolAddress).transferFrom(msg.sender, majorPoolAddress, _amount);
        require(success, "Transfer to major pool failed");

        emit Deposited(_user, _amount);
    }

    /**
     * @notice Receives rewards back from the major pool.
     * @dev In production, this would be restricted or automatically triggered by the pool.
     */
    function receiveReward(uint256 _rewardAmount) external nonReentrant {
        require(_rewardAmount > 0, "No rewards to receive");
        
        // Simulating receiving the reward from the major pool into this treasury contract
        bool success = IERC20(majorPoolAddress).transferFrom(majorPoolAddress, address(this), _rewardAmount);
        require(success, "Failed to pull rewards from pool");

        emit RewardReceived(_rewardAmount);
    }

    /**
     * @notice Allows a user to claim a specific amount of rewards.
     */
    function claimReward(address _user, uint256 _amount) public nonReentrant {
        // 1. Security Check: Look up global user map to verify they have a balance history
        require(userBalances[_user] > 0, "Address is not an active depositor");
        require(_amount > 0, "Cannot claim zero");

        // 2. Calculate the 5% Developer Fee
        uint256 devFeeCut = (_amount * DEV_FEE_PERCENT) / 100;
        uint256 userNetReward = _amount - devFeeCut;

        // 3. Attempt to send out the assets
        // Transfer the 5% to your developer wallet
        bool feeSuccess = IERC20(majorPoolAddress).transfer(devFeeAddress, devFeeCut);
        // Transfer the remaining 95% to the user
        bool userSuccess = IERC20(majorPoolAddress).transfer(_user, userNetReward);

        // 4. Update the global user struct metrics based on result
        if (feeSuccess && userSuccess) {
            userRecords[_user].rewardClaimed += _amount;
            userRecords[_user].successfulClaimsCount += 1;
            
            emit RewardClaimed(_user, userNetReward, devFeeCut);
        } else {
            // If the code hits a soft failure state instead of reverting
            userRecords[_user].failedClaimsCount += 1;
            revert("Reward distribution failed");
        }
    }

    /**
     * @notice Unstakes the user's main principal deposit and returns it directly to them.
     */
    function unstake() external nonReentrant {
        // 1. Check if they are a valid user with funds in the map
        uint256 balanceToWithdraw = userBalances[msg.sender];
        require(balanceToWithdraw > 0, "No staked balance found or not a valid user");

        // 2. Zero out their balance state FIRST to prevent reentrancy attacks
        userBalances[msg.sender] = 0;

        // 3. Send the principal amount from the pool back to the user address
        bool success = IERC20(majorPoolAddress).transferFrom(majorPoolAddress, msg.sender, balanceToWithdraw);
        require(success, "Unstake withdrawal transfer failed");

        emit Unstaked(msg.sender, balanceToWithdraw);
    }
}
