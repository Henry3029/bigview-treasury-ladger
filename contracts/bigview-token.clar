;; @version 2
;; BigView Token (BVW) - SIP-010 Compliant

;; 1. Use a relative path to the local trait file
(use-trait sip-010-trait .sip-010-trait.sip-010-trait)
(impl-trait .sip-010-trait.sip-010-trait)

;; ---------------------------------------------------------
;; Constants & Variables
;; ---------------------------------------------------------
(define-fungible-token bigview u1000000000000) ;; 1M tokens * 10^6 decimals

(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant CONTRACT-OWNER tx-sender)

;; Change this link once you upload your logo to IPFS!
(define-constant TOKEN-METADATA-URL (some u"ipfs://Qme7ss3ARVgxv6rXqVPiURzNFo5S/bigview.json"))

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
  (ok TOKEN-METADATA-URL))

;; ---------------------------------------------------------
;; Public Functions
;; ---------------------------------------------------------

;; Transfer tokens (Standard SIP-010)
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    ;; SECURITY: Only the person who owns the tokens (or a contract they authorized) can move them
    (asserts! (is-eq contract-caller sender) ERR-NOT-AUTHORIZED)
    
    ;; Execute the transfer logic
    (try! (ft-transfer? bigview amount sender recipient))
    
    ;; LOGGING: Print the memo so wallets and indexers can see the transaction
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