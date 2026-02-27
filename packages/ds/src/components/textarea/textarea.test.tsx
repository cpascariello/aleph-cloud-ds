import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea aria-label="Message" />);
    expect(screen.getByRole("textbox", { name: "Message" })).toBeTruthy();
    expect(screen.getByRole("textbox").tagName).toBe("TEXTAREA");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Message" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("defaults to 4 rows", () => {
    render(<Textarea aria-label="Message" />);
    expect(screen.getByRole("textbox").getAttribute("rows")).toBe("4");
  });

  it("allows overriding rows", () => {
    render(<Textarea rows={8} aria-label="Message" />);
    expect(screen.getByRole("textbox").getAttribute("rows")).toBe("8");
  });

  it("forwards HTML attributes", () => {
    render(<Textarea placeholder="Type here" aria-label="Message" />);
    expect(
      screen.getByRole("textbox").getAttribute("placeholder"),
    ).toBe("Type here");
  });

  it("merges custom className", () => {
    render(<Textarea className="custom-class" aria-label="Message" />);
    expect(screen.getByRole("textbox").className).toContain("custom-class");
  });

  it("sets aria-invalid when error is true", () => {
    render(<Textarea error aria-label="Message" />);
    expect(
      screen.getByRole("textbox").getAttribute("aria-invalid"),
    ).toBe("true");
  });

  it("sets disabled attribute", () => {
    render(<Textarea disabled aria-label="Message" />);
    expect(
      (screen.getByRole("textbox") as HTMLTextAreaElement).disabled,
    ).toBe(true);
  });
});
