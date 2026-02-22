export default function DashboardButtons({ onStake, onUnstake, onClaim, onProposal, onVote }) {
      return (
          <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={onStake}>Stake STX</button>
                      <button onClick={onUnstake}>Unstake</button>
                            <button onClick={onClaim}>Claim Rewards</button>
                                  <button onClick={onProposal}>Create Proposal</button>
                                        <button onClick={onVote}>Vote</button>
                                            </div>
                                              );
                                              }
