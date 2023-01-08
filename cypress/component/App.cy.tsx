import React from "react";
import App from "../../src/App";
import * as neutron from "neutron-core"
import robotListMockData from "../fixtures/robot_list_mock.json"

describe("Neutron web", () => {
  let startCount = 0
  let statusCount = 0

  beforeEach(() => {
    startCount = 0
    statusCount = 0
    cy.intercept("http://192.168.3.3:8000/robot/configuration", {
      statusCode: 200,
      body: robotListMockData
    })
    cy.intercept("http://192.168.3.3:8000/robot/status", req => {
      statusCount++
      req.reply({
        statusCode: 200,
        body: []
      })
    }).as("statusRequest")
    cy.intercept("http://192.168.3.3:8000/start", req => {
      startCount++
      req.reply({
        statusCode: 200,
        body: { processId: req.body.processId }
      })
    }).as("startRequest")
    cy.stub(neutron.RosContext.prototype, 'connect').resolves(true)
  })

  it("Connect successfully", () => {
    cy.mount(<App />);

    // Connect to the mocked connection
    const connectButton = cy.get('.MuiButtonBase-root').contains("Connect")
    connectButton.click()

    const modalConnectButton = cy.get(`[aria-label="connection-connect-btn"]`).contains("Connect")
    modalConnectButton.click()

    cy.get(".MuiTypography-root").contains("sarcophagus mock")

    cy.wait("@startRequest").then(() => {
      expect(startCount).to.equal(3)
    })

    cy.wait("@statusRequest").then(() => {
      expect(statusCount).to.equal(1)
    })

    // Assert page is correctly loaded after connection has been made

    cy.get(`[class^='makeStyles-tabheader']`).contains('sarcophagus mock')
    cy.get('[title="Robot Base"] > .MuiButtonBase-root').click().then(() => {
      cy.get('.MuiList-root > .MuiButtonBase-root')
      cy.get('body').click(0, 0)
    })
    cy.get('[title="Camera"] > .MuiButtonBase-root').click().then(() => {
      cy.get('.MuiList-root > .MuiButtonBase-root')
      cy.get('body').click(0, 0)
    })
    cy.get('[title="Utils"] > .MuiButtonBase-root').click().then(() => {
      cy.get('.MuiList-root > .MuiButtonBase-root')
      cy.get('body').click(0, 0)
    })

    // Go to home then back in tab, nothing should have changed

    cy.get('.MuiToolbar-root > .MuiIconButton-edgeStart').click()
    cy.get('[title="Robot Base"] > .MuiButtonBase-root').should("not.exist")
    cy.get(`[class^='makeStyles-tabheader']`).contains('sarcophagus mock').click()
    cy.get('[title="Robot Base"] > .MuiButtonBase-root').click().then(() => {
      cy.get('.MuiList-root > .MuiButtonBase-root')
      cy.get('body').click(0, 0)
    })
    cy.get('[title="Camera"] > .MuiButtonBase-root').click().then(() => {
      cy.get('.MuiList-root > .MuiButtonBase-root')
      cy.get('body').click(0, 0)
    })
    cy.get('[title="Utils"] > .MuiButtonBase-root').click().then(() => {
      cy.get('.MuiList-root > .MuiButtonBase-root')
      cy.get('body').click(0, 0)
    })

    // Mount components 

    cy.get('[title="Camera"] > .MuiButtonBase-root').click().then(() => {
      cy.get('.MuiList-root > .MuiButtonBase-root').click().then(() => {
        const draggable = cy.get('.handle').contains('Camera Viewer')
        draggable.then($el => {
          const initialPosition = $el[0].getBoundingClientRect()
          // Simulate a mousedown event before moving the element
          draggable.click().trigger('mousedown', {
            which: 1
          });

          // Simulate a mousemove event to move the element
          cy.get('body').trigger('mousemove', {
            clientX: 800, // move 400px to the right
            clientY: 300 // move 300px down
          });

          // Simulate a mouseup event to release the element
          cy.get('body').trigger('mouseup');

          cy.get('.handle').contains('Camera Viewer').then($el => {
            // Verify the component position has changed
            const updatedPosition = $el[0].getBoundingClientRect()
            expect(initialPosition.x).to.not.equal(updatedPosition.x)
            expect(initialPosition.y).to.not.equal(updatedPosition.y)

            // Get back into home menu and comeback to tab
            cy.get('.MuiToolbar-root > .MuiIconButton-edgeStart').click()
            cy.get(`[class^='makeStyles-tabheader']`).contains('sarcophagus mock').click()

            cy.get('.handle').contains('Camera Viewer').then($el => {
              // Verify the component position has not changed
              const cameraViewerPosition = $el[0].getBoundingClientRect()
              expect(cameraViewerPosition.x).to.equal(updatedPosition.x)
              expect(cameraViewerPosition.y).to.equal(updatedPosition.y)
            })
          })
        })
      })
    })
    cy.get(`[class^='makeStyles-closeButtonContainer'] > .MuiButtonBase-root > [data-testid="CloseIcon"]`).click()
    cy.get(`[class^='makeStyles-tabheader'] > .MuiButtonBase-root`).click()
  });
});
