;; @version 2
;; BigView Token (BVW) - SIP-010 Compliant

;; Use the new -v2 name from your TOML
(impl-trait .sip-010-trait-v2.sip-010-trait)

;; ---------------------------------------------------------
;; Constants & Variables
;; ---------------------------------------------------------
(define-fungible-token bigview u1000000000000) ;; 1M tokens * 10^6 decimals

(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant CONTRACT-OWNER tx-sender)

;; ---------------------------------------------------------
;; SIP-010 Read-Only Functions
;; ---------------------------------------------------------

(define-read-only (get-name)
  (ok "BigView"))

(define-read-only (get-symbol)
  (ok "BVW"))

(define-read-only (get-decimals)
  (ok u6))

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance bigview account)))

(define-read-only (get-total-supply)
  (ok (ft-get-supply bigview)))

(define-read-only (get-token-uri)
  (ok none)) ;; Add your IPFS metadata link here later!

;; ---------------------------------------------------------
;; Public Functions
;; ---------------------------------------------------------

;; Transfer tokens
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (try! (ft-transfer? bigview amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

;; Minting function - ONLY the owner can call this to start
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (ft-mint? bigview amount recipient)
  )
)