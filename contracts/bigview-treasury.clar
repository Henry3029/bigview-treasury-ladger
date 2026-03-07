;; SPDX-License-Identifier: MIT
;; BigView Dashboard Contract in Clarity (Updated for Nakamoto/Clarity 2+)

;; ---------------------------------------------------------
;; Constants & Data Variables
;; ---------------------------------------------------------

;; 1. Add your developer wallet address as a constant
(define-constant DEV-WALLET 'ST35D3Y0P9RR8DC750D0X3BWBPSHJSYWY87ZZE9TE) ;; Replace with your actual wallet
(define-constant POX-CONTRACT 'ST000000000000000000002AMW42H.pox-4)
;; Replace this with a real pool address (e.g., FastPool or Xverse)
(define-constant MAJOR-POOL-ADDRESS 'ST35D3Y0P9RR8DC750D0X3BWBPSHJSYWY87ZZE9TE)

;; Error Codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-NO-STAKE (err u101))
(define-constant ERR-NO-REWARD (err u102))
(define-constant ERR-INSUFFICIENT-STAKE (err u103)) ;; Added
(define-constant ERR-TRANSFER-FAILED (err u104))   ;; Added
(define-constant REWARD-CYCLE-INDEX u2100) ;; One cycle is 2100 blocks

(define-constant ERR-NOT-UNLOCKED (err u105)) ;; NEW: Error for "Too early to withdraw"
(define-constant ERR-NO-REQUEST (err u106))   ;; NEW: Error for "No unstake request found"

;; Tracking totals for the dashboard
(define-data-var total-members-count uint u0)
(define-data-var total-staked-amount uint u0)
(define-data-var total-rewards-amount uint u0)
(define-data-var proposal-counter uint u0)

;; ---------------------------------------------------------
;; Data Maps
;; ---------------------------------------------------------

(define-map user-wallets { user: principal } { wallet: principal })
(define-map members { account: principal } { is-member: bool })
(define-map stakes { account: principal } { amount: uint }) ;; Tracks STX staked per user
(define-map rewards { account: principal } { amount: uint })
(define-map proposals { id: uint } { description: (string-ascii 64), votes-for: uint, votes-against: uint })
;; This tracks "I want to take out X amount at Y block height"
(define-map unstake-requests 
  { account: principal } 
  { amount: uint, unlock-at: uint }
)

;; ---------------------------------------------------------
;; Read-Only Functions
;; ---------------------------------------------------------

(define-read-only (dashboard-summary)
  {
    total-members: (var-get total-members-count),
    total-stakes: (var-get total-staked-amount),
    total-rewards: (var-get total-rewards-amount),
    proposals-count: (var-get proposal-counter)
  }
)

(define-read-only (is-member? (user principal))
  (default-to false (get is-member (map-get? members { account: user })))
)

;; Added: Read a specific user's stake
(define-read-only (get-user-stake (user principal))
  (default-to u0 (get amount (map-get? stakes { account: user })))
)

;; ---------------------------------------------------------
;; Public Functions
;; ---------------------------------------------------------

;; Wallet Registration
(define-public (register-wallet (user principal) (wallet principal))
  (begin
    (map-insert user-wallets { user: user } { wallet: wallet })
    (ok "Wallet Registered")
  )
)

;; Membership Management
(define-public (add-member (user principal))
  (begin
    (asserts! (map-insert members { account: user } { is-member: true }) ERR-NOT-AUTHORIZED)
    (var-set total-members-count (+ (var-get total-members-count) u1))
    (ok "Member added")
  )
)

(define-public (remove-member (user principal))
  (begin
    (asserts! (map-delete members { account: user }) ERR-NOT-AUTHORIZED)
    (var-set total-members-count (- (var-get total-members-count) u1))
    (ok "Member removed")
  )
)

;; ---------------------------------------------------------
;; New Staking Logic
;; ---------------------------------------------------------

;; 1. Use PoX-4 for the Nakamoto era
(define-public (stake-and-delegate (amount uint))
  (let (
    (user tx-sender)
    (current-user-stake (default-to u0 (get amount (map-get? stakes { account: user }))))
  )
    (begin 
      ;; 1. The Transfer (The first "Gate")
      (try! (stx-transfer? amount user (as-contract tx-sender)))

      ;; 2. The Delegation (The second "Gate")
(try! (as-contract (contract-call? 'SP000000000000000000002Q6VF78.pox-4 delegate-stx (to-uint amount) MAJOR-POOL-ADDRESS none none)))
      ;; 3. The Record Keeping (Only happens if 1 and 2 pass)
      (map-set stakes { account: user } { amount: (+ current-user-stake amount) })
      (var-set total-staked-amount (+ (var-get total-staked-amount) amount))

      (ok true)
    )
  )
)


;; 3. THE NEW FUNCTIONS

;; STEP 1: Tell the contract you want to leave
(define-public (request-unstake (amount uint))
  (let ((user tx-sender))
    ;; Check if they actually have enough staked
    (asserts! (>= (get-user-stake user) amount) ERR-INSUFFICIENT-STAKE)
    
    ;; Set the "Unlock Date" to current block + 2100 blocks (1 cycle)
    (map-set unstake-requests { account: user } 
      { 
        amount: amount, 
        unlock-at: (+ block-height REWARD-CYCLE-INDEX) 
      }
)
    (ok true)
  )
)

;; STEP 2: Actually withdraw the money (only works after the wait)
(define-public (finalize-unstake)
  (let (
    (user tx-sender)
    (request (unwrap! (map-get? unstake-requests { account: user }) ERR-NO-REQUEST))
  )
    ;; Check: Is the current block-height greater than the unlock-at height?
    (asserts! (>= block-height (get unlock-at request)) ERR-NOT-UNLOCKED)
    
    ;; If yes, transfer the STX back to the user
    (try! (as-contract (stx-transfer? (get amount request) (as-contract tx-sender) user)))

;; Update your internal maps
    (map-delete unstake-requests { account: user })
    (map-set stakes { account: user } { amount: (- (get-user-stake user) (get amount request)) })
    
    (ok true)
  )
)

;; Rewards Logic
(define-public (claim-rewards)
  (let (
    (user tx-sender)
    (user-stake (default-to u0 (get amount (map-get? stakes { account: user }))))
    (total-pool-stake (var-get total-staked-amount))
    ;; Get the sBTC balance currently held by the contract
    (contract-sbtc-balance (unwrap! (as-contract (contract-call? SBTC-CONTRACT get-balance (as-contract tx-sender))) (err u500)))
  )
    ;; 1. Check if user has anything staked
    (asserts! (> user-stake u0) (err u403))

    (let (
      ;; 2. Calculate total reward for this user
      (total-user-reward (/ (* user-stake contract-sbtc-balance) total-pool-stake))
      
      ;; 3. Calculate 5% Fee: (Reward * 5) / 100
      (dev-fee (/ (* total-user-reward u5) u100))
      
      ;; 4. Remaining reward for the user
      (final-user-reward (- total-user-reward dev-fee))
    )
      ;; 5. Transfer 5% to Developer
      (try! (as-contract (contract-call? SBTC-CONTRACT transfer dev-fee (as-contract tx-sender) DEV-WALLET none)))
      
      ;; 6. Transfer 95% to the User
      (try! (as-contract (contract-call? SBTC-CONTRACT transfer final-user-reward (as-contract tx-sender) user none)))
      
      (ok {reward: final-user-reward, fee: dev-fee})
    )
  )
)

;; ---------------------------------------------------------
;; Governance Logic
;; ---------------------------------------------------------

(define-public (create-proposal (desc (string-ascii 64)))
  (let ((id (+ (var-get proposal-counter) u1)))
    (begin
      (map-insert proposals { id: id }
        { description: desc, votes-for: u0, votes-against: u0 })
      (var-set proposal-counter id)
      (ok id)
    )
  )
)

(define-public (vote (id uint) (support bool))
  (let ((proposal (unwrap! (map-get? proposals { id: id }) (err "Proposal not found"))))
    (begin
      (map-set proposals { id: id }
        { 
          description: (get description proposal),
          votes-for: (if support 
                       (+ (get votes-for proposal) u1) 
                       (get votes-for proposal)),
          votes-against: (if support 
                          (get votes-against proposal) 
                          (+ (get votes-against proposal) u1))
        }
      )
      (ok "Vote recorded")
    )
  )
)
