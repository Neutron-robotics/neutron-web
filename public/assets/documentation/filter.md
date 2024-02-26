### Filter Node

The **Filter Node** caches received data and emits to the next node only if one value of the payload has changed since the previously received message. When triggered, it forwards the input from the previous node.

#### Three Modes

1. **Block Unless Value Change (Default):**
   - Emits to the next node only if one value of the payload has changed since the previously received message.

2. **Block Unless Value is Greater (Number Only):**
   - Emits to the next node only if one value of the payload has changed and is greater than the previously received message.
   - Configuration required: Set the value to compare, and choose whether to compare with the previous value received or the latest valid value.

3. **Block Unless Value is Lower (Number Only):**
   - Emits to the next node only if one value of the payload has changed and is lower than the previously received message.
   - Configuration required: Set the value to compare, and choose whether to compare with the previous value received or the latest valid value.

This node provides flexibility in filtering data based on different criteria, enhancing control over the flow of information.
