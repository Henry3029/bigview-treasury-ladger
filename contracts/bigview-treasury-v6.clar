;; @version 2
;; SPDX-License-Identifier: MIT
;; BigView Dashboard Contract in Clarity (Updated 2026)

;; ---------------------------------------------------------
;; Traits
;; ---------------------------------------------------------
(use-trait sbtc-token-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.sip-010-trait-ft-standard.sip-010-trait)

;; ---------------------------------------------------------
;; Constants & Data Variables
;; --------------------------------------------------------

;; Error Codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-NO-STAKE (err u101))
(define-constant ERR-NO-REWARD (err u102))
(define-constant ERR-INSUFFICIENT-STAKE (err u103))
(define-constant ERR-TRANSFER-FAILED (err u104))
(define-constant ERR-NOT-UNLOCKED (err u105))
(define-constant ERR-NO-REQUEST (err u106))

;; Use 'SP000000000000000000002Q6VF78.pox-4 for Mainnet 
;; or 'ST000000000000000000002AMW42H.pox-4 for Testnet
(define-data-var pox-contract principal 'ST000000000000000000002AMW42H.pox-4 )

;; Use your actual wallet address here
(define-data-var dev-wallet principal ST35D3Y0P9RR8DC750D0X3BWBP5HJSYWY87ZZE9TE)

;; Initial Xverse pool address (replace with the current one from Xverse)
(define-data-var major-pool-address principal ST35D3Y0P9RR8DC750D0X3BWBP5HJSYWY87ZZE9TE)

(define-data-var total-members-count uint u0)
(define-data-var total-staked-amount uint u0)
(define-data-var total-rewards-amount uint u0)
(define-data-var proposal-counter uint u0)

;; ---------------------------------------------------------
;; Data Maps
;; ---------------------------------------------------------
(define-map members { account: principal } { is-member: bool })
(define-map stakes { account: principal } { amount: uint })
(define-map proposals { id: uint } { description: (string-ascii 64), votes-for: uint, votes-against: uint })

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

;; To use it in a contract-call?, you now wrap it in a var-get
(define-read-only (get-current-cycle)
  (contract-call? 'ST000000000000000000002AMW42H.pox-4 current-pox-reward-cycle)
)

;; ---------------------------------------------------------
;; Public Functions
;; ---------------------------------------------------------

(define-public (stake-and-delegate (amount uint))
  (let (
    (user tx-sender)
    (current-user-stake (get-user-stake user))
    (contract-address (as-contract tx-sender))
    ;; Fetch the current addresses from your data-vars
    (target-pox (var-get pox-contract))
    (target-pool (var-get major-pool-address))
  )
    (begin 
      ;; Step 1: Transfer FROM user TO contract
      (try! (stx-transfer? amount user contract-address))
      
      ;; Step 2: Delegate to Pool using our new variables
      ;; Note: We replaced the hardcoded 'ST00...pox-4 and MAJOR-POOL-ADDRESS
      (try! (as-contract (contract-call? target-pox delegate-stx amount target-pool none none)))
      
      ;; Step 3: Updates
      (map-set stakes { account: user } { amount: (+ current-user-stake amount) })
      (var-set total-staked-amount (+ (var-get total-staked-amount) amount))
      (ok true)
    )
  )
)

;; Added 'sbtc-token' as an argument so we don't need the constant anymore
(define-public (claim-rewards (sbtc-token <sbtc-token-trait>))
  (let (
    (user tx-sender)
    (user-stake (get-user-stake user))
    (total-pool-stake (var-get total-staked-amount))
    ;; We replaced SBTC-CONTRACT with the variable name 'sbtc-token'
    (contract-sbtc-balance (unwrap! (as-contract (contract-call? sbtc-token get-balance tx-sender)) (err u500)))
  )
    (begin
      (asserts! (> user-stake u0) ERR-NO-STAKE)
      (let (
        (total-user-reward (/ (* user-stake contract-sbtc-balance) total-pool-stake))
        (dev-fee (/ (* total-user-reward u5) u100))
        (final-user-reward (- total-user-reward dev-fee))
      )
        ;; Again, replacing the old constant with 'sbtc-token'
        (try! (as-contract (contract-call? sbtc-token transfer dev-fee tx-sender (var-get dev-wallet) none)))
        (try! (as-contract (contract-call? sbtc-token transfer final-user-reward tx-sender user none)))
        (ok {reward: final-user-reward, fee: dev-fee})
      )
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


(define-public (set-dev-wallet (new-address principal))
  (begin
    ;; Only the person who deployed the contract (tx-sender) can change this
    (asserts! (is-eq tx-sender ST35D3Y0P9RR8DC750D0X3BWBP5HJSYWY87ZZE9TE) (err u403))
    (ok (var-set dev-wallet new-address))
  )
)

(define-public (set-major-pool (new-pool principal))
  (let ((pox-contract-addr (var-get pox-contract)))
    (begin
      ;; 1. Security Check
      (asserts! (is-eq tx-sender (var-get dev-wallet)) (err u403))
      
      ;; 2. Update the variable
      (var-set major-pool-address new-pool)
      
      ;; 3. Grant the permission to the new pool 
      ;; We use try! here to make sure the contract-call succeeds
      (try! (as-contract (contract-call? pox-contract-addr allow-contract-caller new-pool none)))
      
      ;; 4. Return the final OK at the very end
      (ok true)
    )
  )
)

(define-public (set-pox-contract (new-pox principal))
  (begin
    (asserts! (is-eq tx-sender (var-get dev-wallet)) (err u403))
    (ok (var-set pox-contract new-pox))
  )
)