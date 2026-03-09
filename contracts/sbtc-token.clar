;; sbtc-token.clar (The "Stunt Double")
(define-trait sip-010-trait
  (
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
    (get-balance (principal) (response uint uint))
  )
)

(define-fungible-token sbtc)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (if (> amount u0)
      (ok true)
          (err u1) ;; This gives the treasury an 'err' type it can understand
            )
            )

(define-read-only (get-balance (who principal))
  (ok u1000000) ;; Give the mock some fake balance for testing
)