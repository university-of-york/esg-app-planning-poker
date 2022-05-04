import React from "react";
import { render, screen, within } from "@testing-library/react";
import { expect } from "@jest/globals";
import { Button } from "../../.build/components";
// import { Button } from "../../.build/components/Button/Button";

describe("Button", () => {
    it("Renders a button with provided children", () => {
        const button = render(<Button />);

        console.log(button);
    });

    it("Applies className styling if provided", () => {});

    it("onClick callback is called when button is clicked", () => {});

    it("Can be marked as submitting", () => {});

    it("Can be marked as disabled", () => {});

    it("onClick callback is not triggered when marked as submitting", () => {});

    it("onClick callback is not triggered when marked as disabled", () => {});
});
