### RTC Camera Controller

The **RTC Camera Controller** node implements the RTC Camera controller interface, rendering an image each time the connector is updated with a new image.

#### Functionality

This controller is specifically responsible for rendering the image of the camera and does not handle the controls of the Camera Component. It assumes that the negotiation with the RTC server has already established a connection.

#### Input Requirement

To operate, the controller takes as input the URL of the camera stream.

This node simplifies the integration of real-time communication (RTC) camera functionality into the system, allowing for seamless rendering of camera images when the connector is updated.
