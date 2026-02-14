export default function DashboardButtons({ onStake, onUnstake, onClaim, onProposal, onVote }) {
      return (
          <div>
                <button onClick={onStake}>Stake STX</button>
                      <button onClick={onUnstake}>Unstake</button>
                            <button onClick={onClaim}>Claim Rewards</button>
                                  <button onClick={onProposal}>Create Proposal</button>
                                        <button onClick={onVote}>Vote</button>
                                            </div>
                                              );
                                              }
