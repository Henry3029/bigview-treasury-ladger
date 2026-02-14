export default function DashboardData({ stake, reward, proposal, votesFor, votesAgainst }) {
      return (
          <div>
                <p>Current Stake: <span>{stake}</span></p>
                      <p>Available Reward: <span>{reward}</span></p>
                            <p>Latest Proposal: <span>{proposal}</span></p>
                                  <p>Vote For: <span>{votesFor}</span></p>
                                        <p>Vote Against: <span>{votesAgainst}</span></p>
                                            </div>
                                              );
                                              }
