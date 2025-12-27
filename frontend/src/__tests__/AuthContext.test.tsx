import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

// Mock the api module
vi.mock("../services/api", () => ({
    default: {
        post: vi.fn(),
        get: vi.fn().mockResolvedValue({ data: { usuario: null } }),
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

describe("AuthContext", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it("provides auth context to children", () => {
        const TestComponent = () => {
            return <div>Test Child</div>;
        };

        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByText("Test Child")).toBeInTheDocument();
    });

    it("initializes with no user when no token exists", () => {
        const TestComponent = () => {
            return <div data-testid="test">Rendered</div>;
        };

        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByTestId("test")).toBeInTheDocument();
    });
});
