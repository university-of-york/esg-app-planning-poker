// This import is here purely so that IntelliJ can figure out what definition of expect() we're using in this file - it's unneeded otherwise.
import { cli } from "cypress";

describe("Poker room", () => {
    beforeEach(() => {
        // @ts-ignore
        cy.restoreSession();
    });

    afterEach(() => {
        cy.screenshot();

        // @ts-ignore
        cy.saveSession();
    });

    it("New room can be created from the home screen", () => {
        cy.visit("/");

        cy.contains("button", "Create a new room").click();

        cy.contains("label", "Room name")
            .invoke("attr", "for")
            .then((id?: string) => {
                cy.get(`#${id}`).type("Backlog Refinement");
            });
        cy.contains("label", "Your name")
            .invoke("attr", "for")
            .then((id?: string) => {
                cy.get(`#${id}`).type("John");
            });
        cy.contains("button", "Confirm").click();

        cy.url().should("include", "/table/");
        cy.contains("h1", "Backlog Refinement").should("be.visible");
        cy.contains("John").should("be.visible").invoke("attr", "class").should("include", "Players_display");
    });

    it("Invite link can be copied", () => {
        cy.contains("button", "Copy invite link").should("be.visible").click();

        cy.contains("button", "Link copied!").should("be.visible");

        cy.window().then(async (window) => {
            const clipboardText = await window.navigator.clipboard.readText();

            cy.url().should("equal", clipboardText);
        });
    });

    it("Player can submit their choice", () => {
        // Player is shown as deciding
        cy.contains("John").should("be.visible").siblings("svg.fa-hourglass").should("be.visible");

        // Option is no longer submitting, and marked as selected
        cy.contains("M")
            .should("be.visible")
            .parent()
            .click()
            .should((card) => {
                expect(card.attr("class")).to.include("Cards_card");
                expect(card.attr("class")).not.to.include("Cards_submitting");
                expect(card.attr("class")).to.include("Cards_selected");
            });

        // Player is shown as having made decision
        cy.contains("John").should("be.visible").siblings("svg.fa-check").should("be.visible");
    });

    it("Host can reveal table result", () => {
        // Press reveal
        cy.contains("button", "Reveal result").should("be.visible").click();

        // Results are shown
        cy.contains("We have a winner").should("be.visible");
        cy.contains("span[class*=Results_result]", "M").should("be.visible");
        cy.contains("with 100% of the vote").should("be.visible");

        // Player choice is shown
        cy.contains("John")
            .should("be.visible")
            .siblings("span[class*=Players_choice]")
            .should("be.visible")
            .and("have.text", "M");

        // Option cards are disabled
        cy.get("div[class*=Cards_container]").invoke("attr", "class").should("include", "Cards_disabled");
    });

    it("Host can reset the table", () => {
        // Press reset
        cy.contains("button", "Reset table").should("be.visible").click();

        // Results are not shown
        cy.get("div[class*=Results_container]").should("not.exist");

        // Player choice is reset, shown as deciding
        cy.contains("John").should("be.visible").siblings("svg.fa-hourglass").should("be.visible");

        // Option cards are enabled
        cy.get("div[class*=Cards_container]").invoke("attr", "class").should("not.include", "Cards_disabled");
    });
});

export {};
