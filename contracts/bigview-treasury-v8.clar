;; @version 2
;; SPDX-License-Identifier: MIT
;; BigView Treasury Contract - Focused on Staking & Rewards

;; ---------------------------------------------------------
;; Traits
;; ---------------------------------------------------------
(use-trait sip-010-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)
(use-trait pox-trait 'SP000000000000000000002Q6VF78.pox-4.pox-trait)
(use-trait bvw-trait .sip-010-trait-v2.sip-010-trait) 

;; ---------------------------------------------------------
;; Constants & Data Variables
;; ---------------------------------------------------------

;; Error Codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-NO-STAKE (err u101))
(define-constant ERR-TRANSFER-FAILED (err u104))
(define-constant ERR-FORBIDDEN (err u403))
(define-constant ERR-INVALID-AMOUNT (err u105))

;; Admin Wallets
(define-data-var dev-wallet principal tx-sender)
(define-data-var major-pool-address principal tx-sender)

;; Global Stats
(define-data-var total-members-count uint u0)
(define-data-var total-staked-amount uint u0)

;; ---------------------------------------------------------
;; Data Maps
;; ---------------------------------------------------------
(define-map members { account: principal } { is-member: bool })
(define-map stakes { account: principal } { amount: uint })

;; ---------------------------------------------------------
;; Read-Only Functions
;; ---------------------------------------------------------

(define-read-only (dashboard-summary)
  {
    total-members: (var-get total-members-count),
    total-stakes: (var-get total-staked-amount)
  }
)

(define-read-only (get-user-stake (user principal))
  (default-to u0 (get amount (map-get? stakes { account: user })))
)

;; ---------------------------------------------------------
;; Public Functions (Core Logic)
;; ---------------------------------------------------------

(define-public (stake-and-delegate (amount uint) (pox-trait-arg <pox-trait>))
  (let (
    (user tx-sender)
    (current-user-stake (get-user-stake user))
  )
    (begin 
      (asserts! (> amount u0) ERR-INVALID-AMOUNT)
      
      ;; Step 1: Transfer FROM user TO contract
      (try! (stx-transfer? amount user (as-contract tx-sender)))
      
      ;; Step 2: Delegate to Pool (Using as-contract to act on behalf of the treasury)
      ;; NOTE: The 'pox-trait-arg' MUST be the official pox-4 contract address
      (try! (as-contract (contract-call? pox-trait-arg delegate-stx amount (var-get major-pool-address) none none)))
      
      ;; Step 3: Updates
      (if (is-none (map-get? members { account: user }))
          (begin 
            (map-set members { account: user } { is-member: true })
            (var-set total-members-count (+ (var-get total-members-count) u1)))
          true
      )
      (map-set stakes { account: user } { amount: (+ current-user-stake amount) })
      (var-set total-staked-amount (+ (var-get total-staked-amount) amount))
      (ok true)
    )
  )
)

(define-public (claim-rewards (sbtc-token <sip-010-trait>))
  (let (
    (user tx-sender)
    (user-stake (get-user-stake user))
    (total-pool-stake (var-get total-staked-amount))
    ;; 1. Get balance of the Treasury Contract
    (contract-sbtc-balance (unwrap! (contract-call? sbtc-token get-balance (as-contract tx-sender)) (err u500)))
  )
    (begin
      (asserts! (> user-stake u0) ERR-NO-STAKE)
      (asserts! (> total-pool-stake u0) (err u501))
      
      (let (
        ;; Calculation: (UserStake / TotalStake) * TotalContractBalance
        (total-user-reward (/ (* user-stake contract-sbtc-balance) total-pool-stake))
        (dev-fee (/ (* total-user-reward u5) u100)) ;; 5% fee
        (final-user-reward (- total-user-reward dev-fee))
      )
        ;; Step 4: Transfer Rewards using 'as-contract' to sign for the Treasury
        (try! (as-contract (contract-call? sbtc-token transfer dev-fee tx-sender (var-get dev-wallet) none)))
        (try! (as-contract (contract-call? sbtc-token transfer final-user-reward tx-sender user none)))
        
        (ok {reward: final-user-reward, fee: dev-fee})
      )
    )
  )
)

(define-public (reward-member (member principal) (reward-amount uint) (token-contract <bvw-trait>))
  (begin
    (asserts! (is-eq tx-sender (var-get dev-wallet)) ERR-FORBIDDEN)
    ;; Contract sends BVW from its own balance to the member
    (as-contract (contract-call? token-contract transfer reward-amount tx-sender member none))
  )
)

;; ---------------------------------------------------------
;; Admin-Only Functions
;; ---------------------------------------------------------

(define-public (set-major-pool (new-pool principal) (pox-contract-addr principal))
  (begin
    (asserts! (is-eq tx-sender (var-get dev-wallet)) ERR-FORBIDDEN)
    (var-set major-pool-address new-pool)
    ;; Crucial: The contract must explicitly allow the pool to lock its funds
    (asserts! 
          ;; Better version of the allow-contract-caller line:
(is-ok (as-contract (contract-call? pox-trait-arg allow-contract-caller new-pool none)))
                (err u500) ;; Error code for 'Failed to lock pool'
                    )
    (ok true)
  )
)