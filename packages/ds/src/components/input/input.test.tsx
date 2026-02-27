import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input aria-label="Name" />);
    expect(screen.getByRole("textbox", { name: "Name" })).toBeTruthy();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Name" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards HTML attributes", () => {
    render(<Input placeholder="Enter name" type="email" aria-label="Email" />);
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("placeholder")).toBe("Enter name");
    expect(input.getAttribute("type")).toBe("email");
  });

  it("merges custom className", () => {
    render(<Input className="custom-class" aria-label="Name" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("custom-class");
  });

  it("sets aria-invalid when error is true", () => {
    render(<Input error aria-label="Name" />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("does not set aria-invalid when error is false", () => {
    render(<Input aria-label="Name" />);
    expect(
      screen.getByRole("textbox").getAttribute("aria-invalid"),
    ).toBeNull();
  });

  it("sets disabled attribute", () => {
    render(<Input disabled aria-label="Name" />);
    expect(
      (screen.getByRole("textbox") as HTMLInputElement).disabled,
    ).toBe(true);
  });
});
