import React from "react";
import App from "../../src/App";

describe("<Stepper />", () => {

  beforeEach(() => {
    cy.intercept("http://192.168.1.128:8000/robot/configuration", {
      statusCode: 200,
      body: {
        "robot": {
          "battery": -1,
          "name": "sarcophagus mock",
          "type": "OsoyooRobot",
          "status": "Connected",
          "connection": {
            "type": "Rosbridge",
            "port": 9090
          },
          "modules": [
            {
              "id": "8d09f4df-9951-4dca-99da-e881b13ff23b",
              "name": "Base",
              "type": "base",
              "framePackage": null,
              "configuration": null
            },
            {
              "id": "98932797-ea76-4ce1-b699-842ce54cedc6",
              "name": "Camera",
              "type": "camera",
              "framePackage": null,
              "configuration": null
            },
            {
              "id": "c0b1b0a1-1b1a-4b1a-9b1a-1b1a0b1a1b1a",
              "name": "Rosbridge",
              "type": "Rosbridge",
              "framePackage": null,
              "configuration": null
            },
            {
              "id": "c0b1b0a1-1b1a-4b1a-9b1a-1b1a0b1a1b1b",
              "name": "test-mock",
              "type": "test",
              "framePackage": null,
              "configuration": null
            }
          ]
        }
      }
    })
  })

  it("renders", () => {
    cy.mount(<App />);
  });
});
