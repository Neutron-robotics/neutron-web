### Switch Node

The **Switch Node** forwards messages based on the value of a property or their position in a sequence. Upon receiving a message, the node evaluates defined rules to determine the corresponding output.

- **Rule Evaluation:**
  - Rules can be defined to consider either the value of a property in the received message or an environment variable.
  - Optionally, the node can be configured to stop evaluating rules if one matches the condition.

- **Two Modes:**
  1. **Verify All the Rules:**
     - Evaluates all defined rules and forwards the output to every node that matches the criteria.

  2. **Stops When Match:**
     - Evaluates all the rules until one is true; subsequent rules won't be evaluated.

This flexibility allows the Switch Node to efficiently route messages based on dynamic conditions within a flow.
