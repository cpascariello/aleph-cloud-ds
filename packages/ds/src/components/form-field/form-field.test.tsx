import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormField } from "./form-field";

describe("FormField", () => {
  it("renders label linked to child input via htmlFor", () => {
    render(
      <FormField label="Email">
        <input />
      </FormField>,
    );
    const input = screen.getByRole("textbox");
    const label = screen.getByText("Email");
    expect(label.tagName).toBe("LABEL");
    expect(label.getAttribute("for")).toBe(input.getAttribute("id"));
  });

  it("renders helper text linked via aria-describedby", () => {
    render(
      <FormField label="Email" helperText="We'll never share it">
        <input />
      </FormField>,
    );
    const input = screen.getByRole("textbox");
    const helper = screen.getByText("We'll never share it");
    expect(input.getAttribute("aria-describedby")).toBe(helper.id);
  });

  it("renders error message replacing helper text", () => {
    render(
      <FormField label="Email" helperText="Hint" error="Invalid email">
        <input />
      </FormField>,
    );
    expect(screen.queryByText("Hint")).toBeNull();
    expect(screen.getByText("Invalid email")).toBeTruthy();
  });

  it("error message has role=alert", () => {
    render(
      <FormField label="Email" error="Invalid email">
        <input />
      </FormField>,
    );
    expect(screen.getByRole("alert").textContent).toBe("Invalid email");
  });

  it("error message is linked via aria-describedby", () => {
    render(
      <FormField label="Email" error="Invalid email">
        <input />
      </FormField>,
    );
    const input = screen.getByRole("textbox");
    const error = screen.getByRole("alert");
    expect(input.getAttribute("aria-describedby")).toBe(error.id);
  });

  it("renders required asterisk with aria-hidden", () => {
    render(
      <FormField label="Email" required>
        <input />
      </FormField>,
    );
    const asterisk = screen.getByText("*");
    expect(asterisk.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not render asterisk when not required", () => {
    render(
      <FormField label="Email">
        <input />
      </FormField>,
    );
    expect(screen.queryByText("*")).toBeNull();
  });

  it("merges custom className on wrapper", () => {
    const { container } = render(
      <FormField label="Email" className="custom-wrapper">
        <input />
      </FormField>,
    );
    expect(container.firstElementChild?.className).toContain("custom-wrapper");
  });
});
