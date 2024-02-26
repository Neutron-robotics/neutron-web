### Inject Node (Flow Graph)

The **Inject Node** serves to inject data initially and potentially at regular intervals within a flow graph. The payload of the message can take various forms, such as a string, data, or a JavaScript object.

#### Manual Injection

In debug mode, a convenient button allows for the manual triggering of the inject node, facilitating testing and debugging processes.

#### Scheduling Options

The inject node offers three scheduling options:

1. **Interval:**
   - Define an interval, and the node will execute at regular intervals after the initial injection.
   - If configured not to activate immediately, the node triggers after a specified delay.

2. **Cron:**
   - Specify a cron expression to execute the node when the cron is triggered.
   - A preview provides a human-readable indication of when the cron will activate and validates its correctness.

3. **No:**
   - The node runs only when manually triggered in debug mode or if configured to execute after the flow begins.
