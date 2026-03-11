;; SPDX-License-Identifier: MIT
;; BigView Dashboard Contract in Clarity (Updated for Nakamoto/Clarity 2+)

(use-trait sbtc-token-trait 'ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token.sip-010-trait)
;; ---------------------------------------------------------
;; Constants & Data Variables set
;; ---------------------------------------------------------

;; Use the actual Nakamoto Testnet sBTC address
(define-constant SBTC-CONTRACT 'ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token)


(define-constant DEV-WALLET 'ST35D3Y0P9RR8DC750D0X3BWBPSHJSYWY87ZZE9TE)
;; FIXED: Official PoX-4 address for Testnet
(define-constant POX-CONTRACT 'ST000000000000000000002AMW42H.pox-4)
(define-constant MAJOR-POOL-ADDRESS 'ST35D3Y0P9RR8DC750D0X3BWBPSHJSYWY87ZZE9TE)

;; Error Codes (Unified as uint)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-NO-STAKE (err u101))
(define-constant ERR-NO-REWARD (err u102))
(define-constant ERR-INSUFFICIENT-STAKE (err u103))
(define-constant ERR-TRANSFER-FAILED (err u104))
(define-constant ERR-NOT-UNLOCKED (err u105))
(define-constant ERR-NO-REQUEST (err u106))
(define-constant REWARD-CYCLE-INDEX u2100)

(define-data-var total-members-count uint u0)
(define-data-var total-staked-amount uint u0)
(define-data-var total-rewards-amount uint u0)
(define-data-var proposal-counter uint u0)

;; ---------------------------------------------------------
;; Data Maps
;; ---------------------------------------------------------
(define-map user-wallets { user: principal } { wallet: principal })
(define-map members { account: principal } { is-member: bool })
(define-map stakes { account: principal } { amount: uint })
(define-map rewards { account: principal } { amount: uint })
(define-map proposals { id: uint } { description: (string-ascii 64), votes-for: uint, votes-against: uint })
(define-map unstake-requests { account: principal } { amount: uint, unlock-at: uint })

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

(define-read-only (get-user-stake (user principal))
  (default-to u0 (get amount (map-get? stakes { account: user })))
)

;; ---------------------------------------------------------
;; Public Functions
;; ---------------------------------------------------------

(define-public (stake-and-delegate (amount uint))
  (let (
    (user tx-sender)
    (current-user-stake (get-user-stake user))
  )
    (begin 
      ;; Step 1: Transfer STX FROM user TO contract
      ;; We use as-contract (no ?) here because it's just an address, not an action.
      (try! (stx-transfer? amount user (as-contract tx-sender)))

      ;; Step 2: Delegate to Pool
      ;; FIXED: Added the '?' to as-contract? so Clarity 4 recognizes it
      (unwrap! (as-contract? (contract-call? 'ST000000000000000000002AMW42H.pox-4 delegate-stx amount MAJOR-POOL-ADDRESS none none)) (err u104))

      ;; Step 3: Updates
      (map-set stakes { account: user } { amount: (+ current-user-stake amount) })
      (var-set total-staked-amount (+ (var-get total-staked-amount) amount))
      (ok true)
    )
  )
)


(define-public (claim-rewards)
  (let (
    (user tx-sender)
    (user-stake (get-user-stake user))
    (total-pool-stake (var-get total-staked-amount))
    
    ;; FIXED: Use SBTC-CONTRACT constant instead of .sbtc-token
    (contract-sbtc-balance (unwrap! (as-contract? (contract-call? SBTC-CONTRACT get-balance tx-sender)) (err u500)))
  )
    (begin
      (asserts! (> user-stake u0) ERR-NO-STAKE)
      (let (
        (total-user-reward (/ (* user-stake contract-sbtc-balance) total-pool-stake))
        (dev-fee (/ (* total-user-reward u5) u100))
        (final-user-reward (- total-user-reward dev-fee))
      )
        ;; FIXED: Changed .sbtc-token to SBTC-CONTRACT and added '?' to as-contract
        (try! (as-contract? (contract-call? SBTC-CONTRACT transfer dev-fee tx-sender DEV-WALLET none)))
        
        ;; FIXED: Changed .sbtc-token to SBTC-CONTRACT
        (try! (as-contract? (contract-call? SBTC-CONTRACT transfer final-user-reward tx-sender user none)))
        
        (ok {reward: final-user-reward, fee: dev-fee})
      )
    )
  )
)

;; (Rest of your Governance functions are fine and can remain as they were)

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
