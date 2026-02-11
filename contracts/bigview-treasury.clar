;; SPDX-License-Identifier: MIT
;; BigView Dashboard Contract in Clarity

;; Developer address (replace with actual principal)
(define-constant developer 'ST35D3Y0P9RR8DC750D0X3BWBPSHJSYWY87ZZE9TE)


;; User wallets
(define-map user-wallets
  { user: principal }
    { wallet: principal })

    ;; Members
    (define-map members 
      { account: principal }
        { is-member: bool })

        ;; Stakes
        (define-map stakes 
          { account: principal }
            { amount: uint })

            ;; Rewards
            (define-map rewards 
              { account: principal }
                { amount: uint })

                ;; Governance
                (define-map proposals 
                  { id: uint }
                    { description: (string-ascii 64), votes-for: uint, votes-against: uint })
                    (define-data-var proposal-counter uint u0)

                    ;; Read-only dashboard summary
                    (define-read-only (dashboard-summary)
                      {
                            total-members: (len (map-keys members)),
                                total-stakes: (fold
                                      (lambda (acc stake)
                                              (+ acc (get amount stake)))
                                                    u0
                                                          (map-values stakes)),
                                                              total-rewards: (fold
                                                                    (lambda (acc reward)
                                                                            (+ acc (get amount reward)))
                                                                                  u0
                                                                                        (map-values rewards)),
                                                                                            proposals-count: (var-get proposal-counter)
                      })


                      ;; Wallet Registration
                      (define-public (register-wallet (user principal) (wallet principal))
                        (begin
                            (map-insert user-wallets { user: user } { wallet: wallet })
                                (ok "Wallet Registered")))

                                ;; Membership
                                (define-public (add-member (user principal))
                                  (begin
                                      (map-insert members { account: user } { is-member: true })
                                          (ok "Member added")))

                                          (define-read-only (is-member? (user principal))
                                            (default-to false (get is-member (map-get? members { account: user }))))

                                            (define-public (remove-member (user principal))
                                              (begin
                                                  (map-delete members { account: user })
                                                      (ok "Member removed")))

                                                      ;; Staking
                                                      (define-public (stake (amount uint))
                                                        (let
                                                            (
                                                                      (fee (/ amount u20)) ;; 5% fee
                                                                            (net-amount (- amount fee))
                                                            )
                                                                (begin
                                                                      (stx-transfer? amount tx-sender (as-contract tx-sender))
                                                                            (stx-transfer? fee (as-contract tx-sender) developer)
                                                                                  (map-insert stakes { account: tx-sender } { amount: net-amount })
                                                                                        (ok "Stake recorded with developer fee"))))

                                                                                        (define-public (unstake)
                                                                                          (let ((stake (map-get? stakes { account: tx-sender })))
                                                                                              (if stake
                                                                                                      (begin
                                                                                                                (map-delete stakes { account: tx-sender })
                                                                                                                          (stx-transfer? (get amount stake) (as-contract tx-sender) tx-sender)
                                                                                                                                    (ok "Stake withdrawn"))
                                                                                                                                            (err "No stake found"))))

                                                                                                                                            ;; Rewards
                                                                                                                                            (define-public (credit-reward (user principal) (amount uint))
                                                                                                                                              (begin 
                                                                                                                                                  (map-insert rewards { account: user } { amount: amount })
                                                                                                                                                      (ok "Reward credited")))

                                                                                                                                                      (define-public (claim-reward) 
                                                                                                                                                        (let ((reward (map-get? rewards { account: tx-sender })))
                                                                                                                                                            (if reward
                                                                                                                                                                    (let
                                                                                                                                                                              (
                                                                                                                                                                                            (fee (/ (get amount reward) u20)) ;; 5% fee
                                                                                                                                                                                                        (net-amount (- (get amount reward) fee))
                                                                                                                                                                              )
                                                                                                                                                                                        (begin
                                                                                                                                                                                                    (stx-transfer? fee (as-contract tx-sender) developer)
                                                                                                                                                                                                                (map-delete rewards { account: tx-sender })
                                                                                                                                                                                                                            (stx-transfer? net-amount (as-contract tx-sender) tx-sender)
                                                                                                                                                                                                                                        (ok "Reward claimed with developer fee")))
                                                                                                                                                                                                                                                (err "No reward to claim"))))

                                                                                                                                                                                                                                                ;; Governance
                                                                                                                                                                                                                                                (define-public (create-proposal (desc (string-ascii 64)))
                                                                                                                                                                                                                                                  (let ((id (+ (var-get proposal-counter) u1)))
                                                                                                                                                                                                                                                      (begin
                                                                                                                                                                                                                                                            (map-insert proposals { id: id }
                                                                                                                                                                                                                                                                    { description: desc, votes-for: u0, votes-against: u0 })
                                                                                                                                                                                                                                                                          (var-set proposal-counter id)
                                                                                                                                                                                                                                                                                (ok id))))

                                                                                                                                                                                                                                                                                (define-public (vote (id uint) (support bool))
                                                                                                                                                                                                                                                                                  (let ((proposal (map-get? proposals { id: id })))
                                                                                                                                                                                                                                                                                      (if proposal
                                                                                                                                                                                                                                                                                              (if support
                                                                                                                                                                                                                                                                                                          (begin
                                                                                                                                                                                                                                                                                                                        (map-insert proposals { id: id }
                                                                                                                                                                                                                                                                                                                                        { description: (get description proposal),
                                                                                                                                                                                                                                                                                                                                                          votes-for: (+ (get votes-for proposal) u1),
                                                                                                                                                                                                                                                                                                                                                                            votes-against: (get votes-against proposal) })
                                                                                                                                                                                                                                                                                                                                                                                          (ok "Voted for"))
                                                                                                                                                                                                                                                                                                                                                                                                      (begin
                                                                                                                                                                                                                                                                                                                                                                                                                    (map-insert proposals { id: id }
                                                                                                                                                                                                                                                                                                                                                                                                                                    { description: (get description proposal),
                                                                                                                                                                                                                                                                                                                                                                                                                                                      votes-for: (get votes-for proposal),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        votes-against: (+ (get votes-against proposal) u1) })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      (ok "Voted against"))))
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              (err "Proposal not found")))
                                                                                                                                                                              
                                                            
                      