# Sprint 1 Retrospective

## Results

### User facing

- A single player Wordle game was created
- Guesses can be made on a unique word per day
- Users can type input or use an on-screen keyboard
- Players are given visual confirmation of the correctness of their guesses
- A win/loss condition has been implemented
- Users can access the game on a publically hosted website

### Developer facing

- The basic web app architecture was created
- A trunk based development workflow was established
- Testing was implemented
- A continuous integration pipeline was created
- The web app was hosted on Azure

## Stories

- 10 user stories were assigned for this sprint

- 8 user stories were completed
- 5 developer stories were completed (going forward developer stories will not be created)
- 1 bug was fixed

- 1 user story was still awaiting approval
- 1 user story was not started

- The 10 planned user stories amounted to 18 points
- The 8 user stories completed amounted to 16 points
- Thus, the **estimated** velocity was **18** points/sprint whereas the **actual** velocity was **16** points/sprint

## Successes

- The team showed good communication and collaboration and everyone was able to assist other team members when they were stuck. This was significant since team members currently lack experience and were given the opportunity to develop their skills.
- Every team member was able to complete a story assigned to them.
- A working prototype was delivered successfully.

## Areas of Concern

- Most user stories were completed on the final day of the sprint. This is due to the fact that team members were waiting on the app architecture to be completed and were thus, unable to begin work earlier.
- There were difficulties implementing testing, while it was ultimately implemented, some elements are not well tested. Further research should be done into mocking in order to improve test coverage.
- Team members spent large amounts of time dealing with merge issues and inconsistencies. This was largely due to the fact that the app architecture was still being developed and as such large changes were being made to all app aspects. This should improve in future sprints now that the architecture is stabilized.
- There were occasions where merging a feature branch caused production to fail. Stricter testing in code review phases before merging should aim to catch this. Integration testing should also be looked into.
