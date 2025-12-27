import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import { AuthProvider } from "../context/AuthContext";

// Mock the api module
vi.mock("../services/api", () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderLogin = () => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <Login />
            </AuthProvider>
        </BrowserRouter>
    );
};

describe("Login Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders login form with email and password fields", () => {
        renderLogin();

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    });

    it("renders register link", () => {
        renderLogin();

        expect(screen.getByText(/¿no tienes cuenta\? regístrate/i)).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
        renderLogin();

        const submitButton = screen.getByRole("button", { name: /entrar/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/email obligatorio/i)).toBeInTheDocument();
        });
    });

    it("toggles password visibility", () => {
        renderLogin();

        const passwordInput = screen.getByLabelText(/contraseña/i);
        expect(passwordInput).toHaveAttribute("type", "password");

        const toggleButton = screen.getByLabelText(/toggle password visibility/i);
        fireEvent.click(toggleButton);

        expect(passwordInput).toHaveAttribute("type", "text");
    });
});
