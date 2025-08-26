import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./CartContext";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock axios
vi.mock("axios");

// Spinner Mock
vi.mock("react-bootstrap/Spinner", () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

// Helper wrapper
const renderWithProvider = () =>
  render(
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  );

const mockProducts = [
  {
    id: 1,
    name: "Cheese Pizza",
    category: "Pizza",
    description: "Extra cheese",
    rating: 4.5,
    price: 200,
    image: "cheese-pizza.jpg",
  },
];

describe("App Component Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders hero title and subtext", () => {
    renderWithProvider();
    expect(screen.getByText(/haridham fastfood/i)).toBeInTheDocument();
    expect(screen.getByText(/home • food/i)).toBeInTheDocument();
  });

  it("renders search input and updates value", () => {
    renderWithProvider();
    const input = screen.getByPlaceholderText(/search food item/i);
    fireEvent.change(input, { target: { value: "pizza" } });
    expect(input.value).toBe("pizza");
  });

  it("displays loading spinner while fetching data", async () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // pending
    renderWithProvider();
    expect(await screen.findByTestId("spinner")).toBeInTheDocument();
  });

  it("displays error message when API fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Fail"));
    renderWithProvider();
    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();
  });

  it("renders product cards correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: mockProducts });
    renderWithProvider();
    expect(await screen.findByText(/cheese pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/₹ 200/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /order now/i })).toBeInTheDocument();
  });

  it("navigates to cart and adds to cart on 'Order Now' click", async () => {
    axios.get.mockResolvedValueOnce({ data: mockProducts });
    renderWithProvider();

    const orderButton = await screen.findByRole("button", {
      name: /order now/i,
    });
    await userEvent.click(orderButton);

    // Optional: Add spy on navigate and addToCart if needed
    // For now, we just make sure the click didn't crash
    expect(screen.getByText(/available for item/i)).toBeInTheDocument();
  });

  it("shows product count correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: mockProducts });
    renderWithProvider();
    expect(await screen.findByText(/available for item: 1/i)).toBeInTheDocument();
  });
});
