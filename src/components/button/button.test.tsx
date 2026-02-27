import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders a button element with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeTruthy();
  });

  describe("icons", () => {
    it("renders iconLeft before children", () => {
      render(
        <Button iconLeft={<svg data-testid="left-icon" />}>
          Label
        </Button>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("left-icon");
      expect(button.contains(icon)).toBe(true);
      const children = Array.from(button.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex(
        (c) => c.textContent === "Label",
      );
      expect(iconIndex).toBeLessThan(labelIndex);
    });

    it("renders iconRight after children", () => {
      render(
        <Button iconRight={<svg data-testid="right-icon" />}>
          Label
        </Button>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("right-icon");
      expect(button.contains(icon)).toBe(true);
      const children = Array.from(button.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex(
        (c) => c.textContent === "Label",
      );
      expect(iconIndex).toBeGreaterThan(labelIndex);
    });
  });

  describe("loading", () => {
    it("shows spinner when loading", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      const spinner = button.querySelector("svg.animate-spin");
      expect(spinner).toBeTruthy();
    });

    it("has aria-busy when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button").getAttribute("aria-busy")).toBe(
        "true",
      );
    });

    it("hides icons when loading", () => {
      render(
        <Button
          loading
          iconLeft={<svg data-testid="left-icon" />}
          iconRight={<svg data-testid="right-icon" />}
        >
          Loading
        </Button>,
      );
      expect(screen.queryByTestId("left-icon")).toBeNull();
      expect(screen.queryByTestId("right-icon")).toBeNull();
    });
  });

  describe("disabled", () => {
    it("sets disabled attribute", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect((button as HTMLButtonElement).disabled).toBe(true);
    });
  });

  describe("asChild", () => {
    it("renders child element instead of button", () => {
      render(
        <Button asChild variant="primary">
          <a href="/test">Link</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Link" });
      expect(link).toBeTruthy();
      expect(link.tagName).toBe("A");
      expect(link.getAttribute("href")).toBe("/test");
    });
  });

  describe("className merging", () => {
    it("merges custom className with variant classes", () => {
      render(<Button className="custom-class">Merge</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-class");
    });
  });

  describe("accessibility", () => {
    it("forwards aria-label", () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(
        screen.getByRole("button", { name: "Close dialog" }),
      ).toBeTruthy();
    });
  });
});
