// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { BROWSER_STORAGE_KEY } from "../../utils/session";

let localStorageInMemory: string;

// @ts-ignore
Cypress.Commands.add("saveSession", () => {
    const session = localStorage[BROWSER_STORAGE_KEY];
    if (session) {
        localStorageInMemory = session;
    }
});

// @ts-ignore
Cypress.Commands.add("restoreSession", () => {
    if (localStorageInMemory) {
        localStorage.setItem(BROWSER_STORAGE_KEY, localStorageInMemory);
    }
});

export {};
