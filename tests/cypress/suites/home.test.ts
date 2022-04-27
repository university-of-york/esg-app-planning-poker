// This import is here purely so that IntelliJ can figure out what definition of expect() we're using in this file - it's unneeded otherwise.
import { cli } from "cypress";

describe("Home screen", () => {
    beforeEach(() => {
        // @ts-ignore
        cy.restoreSession();
    });

    afterEach(() => {
        // @ts-ignore
        cy.saveSession();
    });

    it("Contains the app title", () => {
        cy.visit("/");

        cy.contains("Planning Poker").should("have.attr", "href", "/");
    });

    it("Contains the link to Github", () => {
        cy.get("svg.fa-github-square").should(
            "have.attr",
            "href",
            "https://github.com/university-of-york/esg-app-planning-poker"
        );
    });

    it("Contains the intro text", () => {
        cy.contains("Welcome to planning poker!").should("be.visible");
        cy.contains("Click the button below to create a new room").should("be.visible");
        cy.contains("Creating the room automatically makes you the host").should("be.visible");
        cy.contains("Only the host has the ability to reveal & reset the table").should("be.visible");
    });

    it("Contains the create new room button", () => {
        cy.contains("button", "Create a new room").should("be.visible");
    });

    it("Clicking the create new room button triggers the popup modal", () => {
        cy.contains("button", "Create a new room").click();

        cy.contains("label", "Room name").should("be.visible");
        cy.contains("label", "Your name").should("be.visible");
        cy.contains("button", "Confirm").should("be.visible");
        cy.contains("button", "Cancel").should("be.visible");
    });

    it("Filling in the modal form and confirming takes the user to their new room", () => {
        cy.contains("label", "Room name")
            .invoke("attr", "for")
            .then((id?: string) => {
                cy.get(`#${id}`).type("My new test room");
            });

        cy.contains("label", "Your name")
            .invoke("attr", "for")
            .then((id?: string) => {
                cy.get(`#${id}`).type("Jim");
            });

        cy.contains("button", "Confirm").click();

        cy.url().should("include", "/table/");
        cy.contains("h1", "My new test room").should("be.visible");
        cy.contains("Jim").should("be.visible").invoke("attr", "class").should("include", "Players_display");
    });

    it("Shows recently visited rooms", () => {
        cy.visit("/");

        cy.contains("h2", "Recent rooms:").should("be.visible");
        cy.contains("My new test room").should("be.visible").invoke("attr", "class").should("include", "Home_name");
    });

    it("Clicking a recently visited room takes the user back to that table", () => {
        cy.contains("My new test room").click();

        cy.url().should("include", "/table/");
        cy.contains("h1", "My new test room").should("be.visible");
    });
});

export {};
