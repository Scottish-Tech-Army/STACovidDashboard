import React, { ReactNode } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export function renderWithUser(component: ReactNode) {
  return { user: userEvent.setup(), ...render(<>{component}</>) };
}
