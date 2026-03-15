;; @version 2
;; SPDX-License-Identifier: MIT
;; BigView Treasury Contract - Focused on Staking & Rewards

;; ---------------------------------------------------------
;; Traits
;; ---------------------------------------------------------
(use-trait sbtc-token-trait .sip-010-trait.sip-010-trait)
(use-trait pox-trait .pox-trait.pox-trait)

;; ---------------------------------------------------------
;; Constants & Data Variables
;; ---------------------------------------------------------

;; Error Codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-NO-STAKE (err u101))
(define-constant ERR-TRANSFER-FAILED (err u104))
(define-constant ERR-FORBIDDEN (err u403))

;; PoX Contract (Testnet default)
(define-data-var pox-contract principal 'ST000000000000000000002AMW42H.pox-4)

;; Admin Wallets
(define-data-var dev-wallet principal tx-sender)
(define-data-var major-pool-address principal tx-sender)

;; Global Stats
(define-data-var total-members-count uint u0)
(define-data-var total-staked-amount uint u0)
(define-data-var total-rewards-amount uint u0)

;; ---------------------------------------------------------
;; Data Maps
;; ---------------------------------------------------------
(define-map members { account: principal } { is-member: bool })
(define-map stakes { account: principal } { amount: uint })

;; ---------------------------------------------------------
;; Read-Only Functions
;; ---------------------------------------------------------

;; Removed proposal-count from here
(define-read-only (dashboard-summary)
  {
    total-members: (var-get total-members-count),
    total-stakes: (var-get total-staked-amount),
    total-rewards: (var-get total-rewards-amount)
  }
)

(define-read-only (get-user-stake (user principal))
  (default-to u0 (get amount (map-get? stakes { account: user })))
)

(define-read-only (get-current-cycle)
  (contract-call? 'ST000000000000000000002AMW42H.pox-4 current-pox-reward-cycle)
)

;; ---------------------------------------------------------
;; Public Functions (Core Logic)
;; ---------------------------------------------------------

(define-public (stake-and-delegate (amount uint) (pox-trait-arg <pox-trait>))
  (let (
    (user tx-sender)
    (current-user-stake (get-user-stake user))
    (contract-address (as-contract tx-sender))
  )
    (begin 
      ;; Step 1: Transfer FROM user TO contract
      (try! (stx-transfer? amount user contract-address))
      
      ;; Step 2: Delegate to Pool
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

(define-public (claim-rewards (sbtc-token <sbtc-token-trait>))
  (let (
    (user tx-sender)
    (user-stake (get-user-stake user))
    (total-pool-stake (var-get total-staked-amount))
    (contract-sbtc-balance (unwrap! (as-contract (contract-call? sbtc-token get-balance tx-sender)) (err u500)))
  )
    (begin
      (asserts! (> user-stake u0) ERR-NO-STAKE)
      (let (
        (total-user-reward (/ (* user-stake contract-sbtc-balance) total-pool-stake))
        (dev-fee (/ (* total-user-reward u5) u100))
        (final-user-reward (- total-user-reward dev-fee))
      )
        (try! (as-contract (contract-call? sbtc-token transfer dev-fee tx-sender (var-get dev-wallet) none)))
        (try! (as-contract (contract-call? sbtc-token transfer final-user-reward tx-sender user none)))
        (ok {reward: final-user-reward, fee: dev-fee})
      )
    )
  )
)

;; ---------------------------------------------------------
;; Admin-Only Functions (No Governance needed)
;; ---------------------------------------------------------

(define-public (set-dev-wallet (new-address principal))
  (begin
    (asserts! (is-eq tx-sender (var-get dev-wallet)) ERR-FORBIDDEN)
    (ok (var-set dev-wallet new-address))
  )
)

(define-public (set-major-pool (new-pool principal))
  (begin
    (asserts! (is-eq tx-sender (var-get dev-wallet)) ERR-FORBIDDEN)
    (var-set major-pool-address new-pool)
    (asserts! (is-ok (as-contract (contract-call? 'ST000000000000000000002AMW42H.pox-4 allow-contract-caller new-pool none))) (err u500))
    (ok true)
  )
)

(define-public (set-pox-contract (new-pox principal))
  (begin
    (asserts! (is-eq tx-sender (var-get dev-wallet)) ERR-FORBIDDEN)
    (ok (var-set pox-contract new-pox))
  )
)