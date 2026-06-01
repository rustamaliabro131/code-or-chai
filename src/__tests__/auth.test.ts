import { useAuthStore } from "@/store/auth";
import { User } from "@/lib/types";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Auth Store", () => {
  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    isAdmin: false,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isLoading: false });
    mockFetch.mockReset();
  });

  describe("initial state", () => {
    it("should have null user by default", () => {
      expect(useAuthStore.getState().user).toBeNull();
    });

    it("should have null token by default", () => {
      expect(useAuthStore.getState().token).toBeNull();
    });

    it("should not be loading by default", () => {
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe("login", () => {
    it("should set user and token on successful login", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser, token: "test-token" }),
      });

      const login = useAuthStore.getState().login;
      await login("test@example.com", "password123");

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe("test-token");
    });

    it("should throw error on failed login", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Invalid credentials" }),
      });

      const login = useAuthStore.getState().login;
      await expect(login("test@example.com", "wrongpassword")).rejects.toThrow("Invalid credentials");
    });

    it("should set isLoading during login", async () => {
      let resolvePromise: (value: any) => void;
      mockFetch.mockImplementationOnce(() => new Promise(resolve => { resolvePromise = resolve; }));

      const login = useAuthStore.getState().login;
      const loginPromise = login("test@example.com", "password123");
      
      expect(useAuthStore.getState().isLoading).toBe(true);
      
      resolvePromise!({ ok: true, json: () => Promise.resolve({ user: mockUser, token: "test-token" }) });
      await loginPromise;

      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe("register", () => {
    it("should set user and token on successful registration", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser, token: "new-token" }),
      });

      const register = useAuthStore.getState().register;
      await register("test@example.com", "password123", "Test User");

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe("new-token");
    });

    it("should throw error on failed registration", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Email already exists" }),
      });

      const register = useAuthStore.getState().register;
      await expect(register("test@example.com", "password123", "Test User")).rejects.toThrow("Email already exists");
    });
  });

  describe("logout", () => {
    it("should clear user and token on logout", () => {
      useAuthStore.setState({ user: mockUser, token: "test-token" });

      const logout = useAuthStore.getState().logout;
      logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });
  });

  describe("checkAuth", () => {
    it("should do nothing if no token exists", async () => {
      const checkAuth = useAuthStore.getState().checkAuth;
      await checkAuth();

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should update user state when token is valid", async () => {
      useAuthStore.setState({ token: "valid-token" });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      });

      const checkAuth = useAuthStore.getState().checkAuth;
      await checkAuth();

      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it("should clear state when token is invalid", async () => {
      useAuthStore.setState({ token: "invalid-token", user: mockUser });

      mockFetch.mockResolvedValueOnce({ ok: false });

      const checkAuth = useAuthStore.getState().checkAuth;
      await checkAuth();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });
  });
});