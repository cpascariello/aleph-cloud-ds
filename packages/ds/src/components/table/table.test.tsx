import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Table } from "./table";

type Row = { id: string; name: string; value: number };

const columns = [
  { header: "Name", accessor: (r: Row) => r.name },
  { header: "Value", accessor: (r: Row) => r.value },
];

const sortableColumns = [
  {
    header: "Name",
    accessor: (r: Row) => r.name,
    sortable: true,
    sortValue: (r: Row) => r.name,
  },
  {
    header: "Value",
    accessor: (r: Row) => r.value,
    sortable: true,
    sortValue: (r: Row) => r.value,
  },
];

const data: Row[] = [
  { id: "1", name: "Alpha", value: 10 },
  { id: "2", name: "Beta", value: 20 },
  { id: "3", name: "Gamma", value: 30 },
];

describe("Table", () => {
  it("renders correct number of rows", () => {
    render(
      <Table columns={columns} data={data} keyExtractor={(r) => r.id} />,
    );
    const rows = screen.getAllByRole("row");
    // 1 header + 3 data rows
    expect(rows.length).toBe(4);
  });

  it("renders column headers", () => {
    render(
      <Table columns={columns} data={data} keyExtractor={(r) => r.id} />,
    );
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Value")).toBeTruthy();
  });

  it("renders cell content", () => {
    render(
      <Table columns={columns} data={data} keyExtractor={(r) => r.id} />,
    );
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("20")).toBeTruthy();
  });

  it("calls onRowClick when a row is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        onRowClick={onClick}
      />,
    );
    await user.click(screen.getByText("Beta"));
    expect(onClick).toHaveBeenCalledWith(data[1]);
  });

  it("merges custom className", () => {
    const { container } = render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        className="custom"
      />,
    );
    expect(container.firstElementChild?.className).toContain("custom");
  });

  it("sortable headers have aria-sort=none by default", () => {
    render(
      <Table
        columns={sortableColumns}
        data={data}
        keyExtractor={(r) => r.id}
      />,
    );
    const nameHeader = screen.getByText("Name").closest("th");
    expect(nameHeader?.getAttribute("aria-sort")).toBe("none");
  });

  it("aria-sort updates to ascending after click", async () => {
    const user = userEvent.setup();
    render(
      <Table
        columns={sortableColumns}
        data={data}
        keyExtractor={(r) => r.id}
      />,
    );
    const nameHeader = screen.getByText("Name").closest("th")!;
    await user.click(nameHeader);
    expect(nameHeader.getAttribute("aria-sort")).toBe("ascending");
  });

  it("aria-sort toggles to descending on second click", async () => {
    const user = userEvent.setup();
    render(
      <Table
        columns={sortableColumns}
        data={data}
        keyExtractor={(r) => r.id}
      />,
    );
    const nameHeader = screen.getByText("Name").closest("th")!;
    await user.click(nameHeader);
    await user.click(nameHeader);
    expect(nameHeader.getAttribute("aria-sort")).toBe("descending");
  });

  it("sortable headers are keyboard-focusable", () => {
    render(
      <Table
        columns={sortableColumns}
        data={data}
        keyExtractor={(r) => r.id}
      />,
    );
    const nameHeader = screen.getByText("Name").closest("th");
    expect(nameHeader?.getAttribute("tabindex")).toBe("0");
  });

  it("non-sortable headers lack tabindex", () => {
    render(
      <Table columns={columns} data={data} keyExtractor={(r) => r.id} />,
    );
    const nameHeader = screen.getByText("Name").closest("th");
    expect(nameHeader?.hasAttribute("tabindex")).toBe(false);
  });

  it("sortable header responds to Enter key", async () => {
    const user = userEvent.setup();
    render(
      <Table
        columns={sortableColumns}
        data={data}
        keyExtractor={(r) => r.id}
      />,
    );
    const nameHeader = screen.getByText("Name").closest("th")!;
    nameHeader.focus();
    await user.keyboard("{Enter}");
    expect(nameHeader.getAttribute("aria-sort")).toBe("ascending");
  });

  it("sortable header responds to Space key", async () => {
    const user = userEvent.setup();
    render(
      <Table
        columns={sortableColumns}
        data={data}
        keyExtractor={(r) => r.id}
      />,
    );
    const nameHeader = screen.getByText("Name").closest("th")!;
    nameHeader.focus();
    await user.keyboard(" ");
    expect(nameHeader.getAttribute("aria-sort")).toBe("ascending");
  });

  it("clickable rows are keyboard-focusable", () => {
    render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        onRowClick={vi.fn()}
      />,
    );
    const rows = screen.getAllByRole("row");
    // Data rows (skip header)
    expect(rows[1]?.getAttribute("tabindex")).toBe("0");
  });

  it("clickable row responds to Enter key", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        onRowClick={onClick}
      />,
    );
    const rows = screen.getAllByRole("row");
    rows[1]!.focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledWith(data[0]);
  });

  it("renders emptyState when data is empty", () => {
    render(
      <Table
        columns={columns}
        data={[]}
        keyExtractor={(r) => r.id}
        emptyState="No data available"
      />,
    );
    expect(screen.getByText("No data available")).toBeTruthy();
  });

  it("empty state cell spans all columns", () => {
    render(
      <Table
        columns={columns}
        data={[]}
        keyExtractor={(r) => r.id}
        emptyState="Empty"
      />,
    );
    const cell = screen.getByText("Empty").closest("td");
    expect(cell?.getAttribute("colspan")).toBe("2");
  });

  it("renders data rows when data exists even with emptyState prop", () => {
    render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        emptyState="No data"
      />,
    );
    expect(screen.queryByText("No data")).toBeNull();
    expect(screen.getByText("Alpha")).toBeTruthy();
  });

  it("active row has aria-current", () => {
    render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        activeKey="2"
      />,
    );
    const rows = screen.getAllByRole("row");
    expect(rows[2]?.getAttribute("aria-current")).toBe("true");
  });

  it("non-active rows lack aria-current", () => {
    render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        activeKey="2"
      />,
    );
    const rows = screen.getAllByRole("row");
    expect(rows[1]?.hasAttribute("aria-current")).toBe(false);
    expect(rows[3]?.hasAttribute("aria-current")).toBe(false);
  });

  it("no rows have aria-current when activeKey is undefined", () => {
    render(
      <Table columns={columns} data={data} keyExtractor={(r) => r.id} />,
    );
    const rows = screen.getAllByRole("row");
    for (const row of rows) {
      expect(row.hasAttribute("aria-current")).toBe(false);
    }
  });
});
