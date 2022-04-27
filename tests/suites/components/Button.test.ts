import React from "react";
import { expect } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import { Button } from "../../../components";
// import { Button } from "../../.build/components/Button/Button";

describe("Button", () => {
    it("Renders a button with provided children", () => {
        render(Button);
    });

    it("Applies className styling if provided", () => {

    });

    it("onClick callback is called when button is clicked", () => {

    });

    it("Can be marked as submitting", () => {

    });

    it("Can be marked as disabled", () => {

    });

    it("onClick callback is not triggered when marked as submitting", () => {

    });

    it("onClick callback is not triggered when marked as disabled", () => {

    });

});
