import { render, screen } from "@testing-library/react";
import App from "./App.jsx";

test("renders app", () => {
  render(<App />);
  // Adjust this to match something your App actually shows
  // Use any stable text in your UI, e.g. "Tiny Tasks" header
  expect(screen.getByText(/tiny tasks/i)).toBeInTheDocument();
});
