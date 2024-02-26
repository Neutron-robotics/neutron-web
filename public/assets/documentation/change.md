### Change Node

The **Change Node** allows for defining, modifying, removing, or moving properties within the payload. Multiple rules can be specified, and they are applied in the order of definition. Rules are processed sequentially from top to bottom.

#### Modes

The node operates in three modes:

1. **Define:**
   - Defines the given property of the input message in another property, overriding it if it exists.

2. **Remove:**
   - Removes the specified property from the input message.

3. **Move:**
   - Defines the given property of the input message in the specified property, removing the old value.

These modes offer flexibility in manipulating the payload properties based on the defined rules. Rules are processed sequentially, allowing for a step-by-step transformation of the input message.