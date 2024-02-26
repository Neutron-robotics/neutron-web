### Function Node

The **Function Node** executes a JavaScript method on messages received by the node. The function should return an object containing the payload to be sent to the next node in the flow. This node allows for dynamic processing of data.

#### JavaScript Function Example

Here's an example of a JavaScript function that manipulates the payload format:

```javascript
    // Example function in the Function Node
    // Perform custom processing on the input payload
    let processedPayload = {
        data: msg.payload.toUpperCase(),
        timestamp: new Date().toISOString(),
    };

    // Accessing and storing environment variables
    let myEnvVar = env.get('MY_VAR_ENV');
    env.store('MY_VAR_ENV', processedPayload);

    return processedPayload;
