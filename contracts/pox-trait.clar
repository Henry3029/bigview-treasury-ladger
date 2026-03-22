;; ---------------------------------------------------------
;; BigView Treasury - Production Trait Definition
;; ---------------------------------------------------------

(define-trait pox-trait
  (
    ;; The official PoX-4 delegate signature
    (delegate-stx 
        (uint principal (optional (buff 20)) (optional uint) (optional uint)) 
        (response bool int)
    )
    
    ;; Required to stop delegating to a pool
    (revoke-delegate-stx () (response bool int))
  )
)