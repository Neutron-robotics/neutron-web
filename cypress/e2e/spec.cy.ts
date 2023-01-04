import axios from "axios";
import { Core } from "neutron-core";

describe("template spec", () => {
  it("passes", () => {
    // cy.visit('https://example.cypress.io')
    expect(true).to.equal(true);
  });

  it('finds the content "type"', () => {
    cy.visit("https://example.cypress.io");

    cy.contains("type");
  });

  it("load main menu", () => {
    cy.stub(axios, "get").returns(
      Promise.resolve({
        robot: {
          battery: -1,
          name: "Macbook Pro",
          type: "OsoyooRobot",
          status: "Connected",
          connection: {
            type: "Rosbridge",
            port: 9090,
          },
          modules: [
            {
              id: "8d09f4df-9951-4dca-99da-e881b13ff23b",
              name: "Osoyoo base",
              type: "base",
              framePackage: null,
              configuration: null,
            },
            {
              id: "98932797-ea76-4ce1-b699-842ce54cedc6",
              name: "Camera",
              type: "camera",
              framePackage: null,
              configuration: null,
            },
            {
              id: "c0b1b0a1-1b1a-4b1a-9b1a-1b1a0b1a1b1a",
              name: "Rosbridge",
              type: "Rosbridge",
              framePackage: null,
              configuration: null,
            },
            {
              id: "c0b1b0a1-1b1a-4b1a-9b1a-1b1a0b1a1b1b",
              name: "test",
              type: "test",
              framePackage: null,
              configuration: null,
            },
          ],
        },
      })
    );

    cy.visit("localhost:3000");
    cy.contains("Connect to a robot");
    cy.contains("Neutron");
  });
});

export {};
