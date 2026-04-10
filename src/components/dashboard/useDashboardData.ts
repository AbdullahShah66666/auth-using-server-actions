import { logout } from "@/actions/authActions.js";
import type {
  DashboardUser,
  UserActivity,
  UserProfile,
  UserSectionKey,
  UserSession,
} from "@/components/dashboard/types";
import axios from "axios";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { toast } from "react-toastify";

type State = {
  message: string;
  username: string | null;
  role: "user" | "admin" | null;
  users: DashboardUser[];
  usersLoading: boolean;
  usersError: string | null;
};

type Action =
  | { type: "message/set"; payload: string }
  | { type: "session/set"; payload: { username: string; role: string | null } }
  | { type: "users/loading" }
  | { type: "users/set"; payload: DashboardUser[] }
  | { type: "users/error"; payload: string | null };

const initialState: State = {
  message: "",
  username: null,
  role: null,
  users: [],
  usersLoading: false,
  usersError: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "message/set":
      return { ...state, message: action.payload };
    case "session/set":
      return {
        ...state,
        username: action.payload.username,
        role: action.payload.role as State["role"],
      };
    case "users/loading":
      return { ...state, usersLoading: true, usersError: null };
    case "users/set":
      return { ...state, usersLoading: false, users: action.payload };
    case "users/error":
      return { ...state, usersLoading: false, usersError: action.payload };
    default: {
      const _exhaustiveCheck: never = action;
      return state;
    }
  }
}

export default function useDashboardData() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { message, username, role, users, usersLoading, usersError } = state;

  const welcomeShownRef = useRef(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [activity, setActivity] = useState<UserActivity[]>([]);
  const [profileForm, setProfileForm] = useState({ username: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [endingSessions, setEndingSessions] = useState(false);
  const [activeUserSection, setActiveUserSection] =
    useState<UserSectionKey>("overview");
  const [sectionMenuOpen, setSectionMenuOpen] = useState(false);

  const formatDate = useCallback((dateValue: string | null | undefined) => {
    if (!dateValue) return "Not available";
    return new Date(dateValue).toLocaleString();
  }, []);

  const loadAdminUsers = useCallback(async () => {
    dispatch({ type: "users/loading" });

    try {
      const usersRes = await axios.get("/api/admin/users");

      if (usersRes.data?.success) {
        dispatch({
          type: "users/set",
          payload: usersRes.data.users ?? [],
        });
        return;
      }

      dispatch({
        type: "users/error",
        payload: usersRes.data?.message ?? "Failed to load users",
      });
    } catch (error) {
      dispatch({
        type: "users/error",
        payload: "Failed to load users",
      });
      console.error(error);
    }
  }, []);

  const loadUserProfile = useCallback(async () => {
    try {
      const profileRes = await axios.get("/api/user/profile");

      if (!profileRes.data?.success) {
        return;
      }

      const nextProfile = profileRes.data.profile as UserProfile;
      setProfile(nextProfile);
      setProfileForm({
        username: nextProfile.username ?? "",
        email: nextProfile.email ?? "",
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadUserSessions = useCallback(async () => {
    try {
      const sessionsRes = await axios.get("/api/user/sessions");

      if (!sessionsRes.data?.success) return;
      setSessions(sessionsRes.data.sessions ?? []);
      console.log("sessionsRes: ", sessionsRes);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadUserActivity = useCallback(async () => {
    try {
      const activityRes = await axios.get("/api/user/activity");

      if (!activityRes.data?.success) return;
      setActivity(activityRes.data.activity ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleProfileUpdate = useCallback(async () => {
    setSavingProfile(true);

    try {
      const res = await axios.patch("/api/user/profile", profileForm);

      if (!res.data?.success) {
        toast.error(res.data?.message ?? "Profile update failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
        return;
      }

      toast.success("Profile updated", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });

      await loadUserProfile();
    } catch (error) {
      console.error(error);
      toast.error("Profile update failed", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setSavingProfile(false);
    }
  }, [loadUserProfile, profileForm]);

  const handlePasswordUpdate = useCallback(async () => {
    setSavingPassword(true);

    try {
      const res = await axios.patch("/api/user/password", passwordForm);

      if (!res.data?.success) {
        toast.error(res.data?.message ?? "Password update failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
        return;
      }

      setPasswordForm({ currentPassword: "", newPassword: "" });
      toast.success("Password updated", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    } catch (error) {
      console.error(error);
      toast.error("Password update failed", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setSavingPassword(false);
    }
  }, [passwordForm]);

  const handleLogoutAllDevices = useCallback(async () => {
    setEndingSessions(true);

    try {
      const res = await axios.delete("/api/user/sessions");

      if (!res.data?.success) {
        toast.error(res.data?.message ?? "Failed to end sessions", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
        return;
      }

      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      toast.error("Failed to end sessions", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setEndingSessions(false);
    }
  }, []);

  const handleCreateUser = useCallback(async () => {
    if (role !== "admin") return;

    const username = window.prompt("New user's username");
    if (!username) return;

    const email = window.prompt("New user's email");
    if (!email) return;

    const password = window.prompt("New user's password");
    if (!password) return;

    const nextRole = window.prompt("Role for this user (user/admin)", "user");

    try {
      const res = await axios.post("/api/admin/users", {
        username,
        email,
        password,
        role: nextRole,
      });

      if (res.data?.success) {
        toast.success("User created", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
        await loadAdminUsers();
        return;
      }

      toast.error(res.data?.message ?? "User creation failed", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } catch (error) {
      console.error(error);
      toast.error("User creation failed", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    }
  }, [loadAdminUsers, role]);

  const handleViewUser = useCallback((user: DashboardUser) => {
    window.alert(
      [
        `ID: ${user._id}`,
        `Username: ${user.username}`,
        `Email: ${user.email}`,
        `Role: ${user.role}`,
      ].join("\n")
    );
  }, []);

  const handleEditUser = useCallback(
    async (user: DashboardUser) => {
      if (role !== "admin") return;

      const username = window.prompt("Update username", user.username)?.trim();
      const email = window.prompt("Update email", user.email)?.trim();
      const nextRole = window.prompt("Update role (user/admin)", user.role);
      const password = window.prompt(
        "Update password (leave empty to keep current password)",
        ""
      );

      const payload: Record<string, string> = {};

      if (username) payload.username = username;
      if (email) payload.email = email;
      if (typeof nextRole === "string" && nextRole.trim()) {
        payload.role = nextRole.trim();
      }
      if (password && password.trim()) payload.password = password.trim();

      if (Object.keys(payload).length === 0) return;

      try {
        const res = await axios.patch(`/api/admin/users/${user._id}`, payload);

        if (res.data?.success) {
          toast.success("User updated", {
            position: "top-center",
            autoClose: 2000,
            theme: "dark",
          });
          await loadAdminUsers();
          return;
        }

        toast.error(res.data?.message ?? "User update failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      } catch (error) {
        console.error(error);
        toast.error("User update failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      }
    },
    [loadAdminUsers, role]
  );

  const handleDeleteUser = useCallback(
    async (user: DashboardUser) => {
      if (role !== "admin") return;

      const shouldDelete = window.confirm(
        `Delete ${user.username} (${user.email})? This action cannot be undone.`
      );

      if (!shouldDelete) return;

      try {
        const res = await axios.delete(`/api/admin/users/${user._id}`);

        if (res.data?.success) {
          toast.success("User deleted", {
            position: "top-center",
            autoClose: 2000,
            theme: "dark",
          });
          await loadAdminUsers();
          return;
        }

        toast.error(res.data?.message ?? "User delete failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      } catch (error) {
        console.error(error);
        toast.error("User delete failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      }
    },
    [loadAdminUsers, role]
  );

  const handleLogout = useCallback(async () => {
    const res = await logout();
    console.log(res);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userRes = await axios.get("/api/auth/me");

        if (userRes.data?.success) {
          dispatch({
            type: "session/set",
            payload: {
              username: userRes.data.username ?? "User",
              role: userRes.data.role ?? null,
            },
          });

          if (!welcomeShownRef.current) {
            welcomeShownRef.current = true;
            toast.success(`Welcome ${userRes.data.username} !`, {
              position: "top-center",
              autoClose: 3000,
              theme: "dark",
            });
          }

          await Promise.all([
            loadUserProfile(),
            loadUserSessions(),
            loadUserActivity(),
          ]);
          if (userRes.data.role === "admin") {
            await loadAdminUsers();
          }
        } else {
          dispatch({
            type: "message/set",
            payload: userRes.data?.message ?? "Session expired",
          });
          await new Promise((resolve) => setTimeout(resolve, 2500));
          return logout();
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadUser();
  }, [loadAdminUsers, loadUserActivity, loadUserProfile, loadUserSessions]);

  useEffect(() => {
    if (!message) return;

    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      theme: "dark",
      className: "cursor-pointer",
    });
  }, [message]);

  const activeSessionsCount = sessions.filter(
    (session) => session.isActive
  ).length;
  console.log(sessions);

  const notifications = [
    `You currently have ${activeSessionsCount} active session${
      activeSessionsCount === 1 ? "" : "s"
    }.`,
    activity.length
      ? `${activity.length} recent account activities are recorded.`
      : "No recent activity yet. New sign-ins will appear automatically.",
  ];

  const userMenuSections: Array<{ key: UserSectionKey; label: string }> = [
    { key: "overview", label: "Overview" },
    { key: "profile", label: "Edit Profile" },
    { key: "security", label: "Password & Security" },
    { key: "notifications", label: "Recent Activity" },
  ];
  const currentSectionLabel =
    userMenuSections.find((section) => section.key === activeUserSection)
      ?.label ?? "Overview";

  return {
    username,
    role,
    users,
    usersLoading,
    usersError,
    profile,
    sessions,
    profileForm,
    setProfileForm,
    passwordForm,
    setPasswordForm,
    savingProfile,
    savingPassword,
    endingSessions,
    activeUserSection,
    setActiveUserSection,
    sectionMenuOpen,
    setSectionMenuOpen,
    loadAdminUsers,
    handleCreateUser,
    handleViewUser,
    handleEditUser,
    handleDeleteUser,
    handleProfileUpdate,
    handlePasswordUpdate,
    handleLogoutAllDevices,
    handleLogout,
    formatDate,
    activeSessionsCount,
    notifications,
    userMenuSections,
    currentSectionLabel,
  };
}
