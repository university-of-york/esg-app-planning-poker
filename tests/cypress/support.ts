// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import "./commands.ts";

// Delay all web requests to backend by 500ms
// This is helpful as the real backend can respond quite quickly once the lambda's have warmed up
// The backend can sometimes respond quickly enough for assertions to fail
beforeEach(() => {
    cy.intercept(`https://**`, (req) => {
        req.on("response", (res) => {
            res.setDelay(500);
        });
    });
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
