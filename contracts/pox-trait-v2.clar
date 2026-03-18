;; PoX-4 Trait (The current Stacks Mainnet version)
(define-trait pox-trait
  (
    ;; delegate-stx: Locks STX to a pool operator
    ;; amount: amount to delegate
    ;; delegate-to: the pool operator address
    ;; until-burn-ht: optional lock time
    ;; pox-addr: optional bitcoin address for rewards
    (delegate-stx (uint principal (optional uint) (optional (buff 34))) (response bool uint))
  )
)