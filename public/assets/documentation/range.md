### Range Node

The **Range Node** linearly scales the provided value based on the defined scale. The input number must be a numerical value. Users are required to specify an input range and an output range. The node operates in three different modes:

1. **Scale the Property of the Message:**
   - Scales the provided number with the defined scale without applying limits.

2. **Scale the Property of the Message and Limit within the Range:**
   - Scales the provided number with the defined scale and applies limits to keep it within the specified range.

3. **Scale the Property of the Message or Remove It if Not within the Range:**
   - Scales the property of the message, or removes it if the result is not within the specified range.

#### Rounding Option

An additional option allows rounding to the nearest integer.

#### Examples

Here are some examples to illustrate the functionality:

- Example 1 (Scale Only):
  ```plaintext
  Input Range: 0 to 10
  Output Range: 0 to 100
  Mode: Scale the Property of the Message
  Value: 5
  Result: 50
    ```

- Example 2 (Scale and Limit):
    ```plaintext
    Input Range: 0 to 10
    Output Range: 0 to 100
    Mode: Scale the Property of the Message and Limit within the Range
    Value: 12
    Result: 100
    ```

- Example 3 (Scale or Remove):
    ```plaintext
    Input Range: 0 to 10
    Output Range: 0 to 100
    Mode: Scale the Property of the Message and Limit within the Range
    Value: 12
    Result: [Property removed]
    ```