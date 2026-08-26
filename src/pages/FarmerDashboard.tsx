import React from "react";
import { useLanguage } from "../LanguageProvider";

/**
 * Farmer dashboard with Nearby Machinery, Request flow, Bookings, Inventory view, and Notifications.
 *
 * - Requests: farmseva_requests
 * - Notifications: farmseva_notifications
 * - Machinery: farmseva_machinery (new)
 *
 * Backward compatibility:
 * - Existing requests without machineId continue to work (use machineName).
 * - Migration: if farmseva_machinery missing, create items from owner account fields.
 */

type Account = {
  role: string;
  fullName: string;
  phone: string;
  village?: string;
  location?: string;
  machineryType?: string;
  machineName?: string;
  rentPrice?: number | string;
  operatorPrice?: number | string;
  availability?: string;
  latitude?: number | null;
  longitude?: number | null;
  password?: string;
};

type MachineryItem = {
  id: string;
  ownerPhone: string;
  machineName: string;
  machineryType: string;
  description?: string;
  rentPrice?: number;
  operatorPrice?: number;
  availability?: string;
  createdAt: string;
  updatedAt?: string;
  latitude?: number | null;
  longitude?: number | null;
};

type RequestItem = {
  id: string;
  farmerPhone: string;
  farmerName: string;
  farmerLocation: string;

  ownerPhone: string;
  ownerName: string;
  ownerLocation: string;

  machineryType: string;
  machineName: string;
  machineId?: string;

  serviceType: "rent" | "operator";

  hourlyPrice: number;
  hours: number;
  totalPrice: number;

  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed";

  createdAt: string;

  acceptedDate?: string | null;
  acceptedTime?: string | null;
};

type NotificationItem = {
  id: string;
  recipientPhone: string;
  recipientRole: "farmer" | "owner";
  type: string;
  title: string;
  message: string;
  requestId: string;
  createdAt: string;
  read: boolean;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getSession(): { role: string; phone: string } | null {
  try {
    const raw = localStorage.getItem("farmseva_session");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadAccounts(): Account[] {
  return safeParse<Account[]>(localStorage.getItem("farmseva_accounts"), []);
}

function loadRequests(): RequestItem[] {
  return safeParse<RequestItem[]>(localStorage.getItem("farmseva_requests"), []);
}

function saveRequests(reqs: RequestItem[]) {
  localStorage.setItem("farmseva_requests", JSON.stringify(reqs));
  window.dispatchEvent(new StorageEvent("storage", { key: "farmseva_requests", newValue: JSON.stringify(reqs) }));
}

function loadNotifications(): NotificationItem[] {
  return safeParse<NotificationItem[]>(localStorage.getItem("farmseva_notifications"), []);
}

function saveNotifications(n: NotificationItem[]) {
  localStorage.setItem("farmseva_notifications", JSON.stringify(n));
  window.dispatchEvent(new StorageEvent("storage", { key: "farmseva_notifications", newValue: JSON.stringify(n) }));
}

function createNotification(n: Omit<NotificationItem, "id" | "createdAt" | "read">) {
  const all = loadNotifications();
  const item: NotificationItem = {
    ...n,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  all.push(item);
  saveNotifications(all);
  return item;
}

/** New machinery storage helpers */
function loadMachinery(): MachineryItem[] {
  return safeParse<MachineryItem[]>(localStorage.getItem("farmseva_machinery"), []);
}

function saveMachinery(items: MachineryItem[]) {
  localStorage.setItem("farmseva_machinery", JSON.stringify(items));
  window.dispatchEvent(new StorageEvent("storage", { key: "farmseva_machinery", newValue: JSON.stringify(items) }));
}

/** Migrate legacy owner machine fields into farmseva_machinery if missing */
function migrateLegacyMachineryIfNeeded() {
  const existing = localStorage.getItem("farmseva_machinery");
  if (existing) return; // already present
  const accounts = loadAccounts();
  const items: MachineryItem[] = [];
  accounts.forEach((a) => {
    if (a.role === "owner" && (a.machineName || a.machineryType)) {
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
      items.push({
        id,
        ownerPhone: a.phone || "",
        machineName: a.machineName || "Machine",
        machineryType: a.machineryType || "General",
        description: "",
        rentPrice: typeof a.rentPrice === "number" ? a.rentPrice : (a.rentPrice ? Number(a.rentPrice) : undefined),
        operatorPrice: typeof a.operatorPrice === "number" ? a.operatorPrice : (a.operatorPrice ? Number(a.operatorPrice) : undefined),
        availability: a.availability || "available",
        createdAt: new Date().toISOString(),
      });
    }
  });
  if (items.length > 0) {
    saveMachinery(items);
  } else {
    // ensure key exists as empty array
    saveMachinery([]);
  }
}

/** Haversine formula: returns distance in kilometers */
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDateReadable(isoDate?: string | null) {
  if (!isoDate) return null;
  try {
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return null;
  }
}

function formatTimeReadable(hhmm?: string | null) {
  if (!hhmm) return null;
  try {
    const today = new Date();
    const [hh, mm] = hhmm.split(":").map((s) => Number(s));
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hh, mm);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  } catch {
    return null;
  }
}

export default function FarmerDashboard(): React.ReactElement {
  const session = getSession();
  const { t } = useLanguage();
  const [farmer, setFarmer] = React.useState<Account | null>(null);
  const [owners, setOwners] = React.useState<Account[]>([]);
  const [machineryTypes, setMachineryTypes] = React.useState<string[]>([]);

  // Filters / search state
  const [selectedType, setSelectedType] = React.useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = React.useState<"available" | "all">("available");
  const [query, setQuery] = React.useState<string>("");
  const [distanceFilterKm, setDistanceFilterKm] = React.useState<number | "all">("all");

  // Selected owner for details view
  const [selectedOwner, setSelectedOwner] = React.useState<Account | null>(null);

  // Request modal state
  const [requestOwner, setRequestOwner] = React.useState<Account | null>(null);
  const [requestMachineId, setRequestMachineId] = React.useState<string | null>(null);
  const [requestService, setRequestService] = React.useState<"rent" | "operator" | "">("");
  const [requestHours, setRequestHours] = React.useState<number | "">("");
  const [requestError, setRequestError] = React.useState<string | null>(null);
  const [requestBusy, setRequestBusy] = React.useState<boolean>(false);

  // Requests state for farmer
  const [myRequests, setMyRequests] = React.useState<RequestItem[]>([]);

  // Notifications state
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = React.useState<boolean>(false);

  // Machinery list (global)
  const [machinery, setMachinery] = React.useState<MachineryItem[]>([]);

  // Location capture state
  const [locStatus, setLocStatus] = React.useState<string | null>(null);
  const [locBusy, setLocBusy] = React.useState<boolean>(false);

  // On mount: migrate legacy machinery if needed, load accounts, requests, notifications, machinery
  React.useEffect(() => {
    migrateLegacyMachineryIfNeeded();
    const mach = loadMachinery();
    setMachinery(mach);

    if (!session) {
      window.location.hash = "#/login";
      return;
    }
    const accounts = loadAccounts();
    const farmerAcc = accounts.find((a) => a.role === "farmer" && a.phone.replace(/\s+/g, "") === session.phone.replace(/\s+/g, ""));
    setFarmer(farmerAcc || null);

    const ownerAccounts = accounts.filter((a) => a.role === "owner");
    setOwners(ownerAccounts);

    const types = Array.from(new Set(ownerAccounts.map((o) => (o.machineryType || "").trim()).filter(Boolean)));
    setMachineryTypes(types);

    const reqs = loadRequests();
    const mine = reqs.filter((r) => r.farmerPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, ""));
    setMyRequests(mine);

    const allNotifs = loadNotifications();
    const mineNotifs = allNotifs.filter((n) => n.recipientPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, "") && n.recipientRole === "farmer");
    setNotifications(mineNotifs);
  }, []);

  // Listen for storage events to refresh machinery, requests, notifications
  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "farmseva_requests") {
        const reqs = loadRequests();
        const mine = reqs.filter((r) => r.farmerPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, ""));
        setMyRequests(mine);
      }
      if (e.key === "farmseva_notifications") {
        const allNotifs = loadNotifications();
        const mineNotifs = allNotifs.filter((n) => n.recipientPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, "") && n.recipientRole === "farmer");
        setNotifications(mineNotifs);
      }
      if (e.key === "farmseva_machinery") {
        const mach = loadMachinery();
        setMachinery(mach);
      }
      if (e.key === "farmseva_accounts") {
        const accounts = loadAccounts();
        const ownerAccounts = accounts.filter((a) => a.role === "owner");
        setOwners(ownerAccounts);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function updateFarmerCoordinates(lat: number, lon: number) {
    const accounts = loadAccounts();
    const updated = accounts.map((a) => {
      if (a.role === "farmer" && a.phone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, "")) {
        return { ...a, latitude: lat, longitude: lon };
      }
      return a;
    });
    localStorage.setItem("farmseva_accounts", JSON.stringify(updated));
    const farmerAcc = updated.find((a) => a.role === "farmer" && a.phone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, ""));
    setFarmer(farmerAcc || null);
  }

  function captureFarmerLocation() {
    setLocStatus(null);
    if (!("geolocation" in navigator)) {
      setLocStatus("Geolocation is not supported by your browser.");
      return;
    }
    setLocBusy(true);
    setLocStatus("Requesting location permission...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        updateFarmerCoordinates(lat, lon);
        setLocStatus("Location captured successfully.");
        setLocBusy(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setLocStatus("Permission denied. You can continue using text location or try again.");
        else if (err.code === err.POSITION_UNAVAILABLE) setLocStatus("Location unavailable. Please try again later.");
        else if (err.code === err.TIMEOUT) setLocStatus("Location request timed out. Please try again.");
        else setLocStatus("Unable to capture location. Please try again.");
        setLocBusy(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 0 }
    );
  }

  // Build owners with distance (unchanged)
  const ownersWithDistance = React.useMemo(() => {
    const farmerHasCoords = farmer && typeof farmer.latitude === "number" && typeof farmer.longitude === "number";
    const mapped = owners.map((o) => {
      const ownerHasCoords = typeof o.latitude === "number" && typeof o.longitude === "number";
      let distanceKm: number | null = null;
      if (farmerHasCoords && ownerHasCoords) {
        distanceKm = haversineDistanceKm(farmer!.latitude as number, farmer!.longitude as number, o.latitude as number, o.longitude as number);
      }
      return { owner: o, distanceKm };
    });
    mapped.sort((a, b) => {
      const aHas = a.distanceKm !== null;
      const bHas = b.distanceKm !== null;
      if (aHas && bHas) return (a.distanceKm as number) - (b.distanceKm as number);
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0;
    });
    return mapped;
  }, [owners, farmer]);

  const filteredOwners = React.useMemo(() => {
    const list = ownersWithDistance.filter(({ owner, distanceKm }) => {
      if (availabilityFilter === "available" && (owner.availability || "").toLowerCase() !== "available") return false;
      if (selectedType && (owner.machineryType || "").toLowerCase() !== selectedType.toLowerCase()) return false;
      if (query && query.trim()) {
        const q = query.trim().toLowerCase();
        const fields = [
          (owner.machineName || "").toLowerCase(),
          (owner.machineryType || "").toLowerCase(),
          (owner.fullName || "").toLowerCase(),
          (owner.location || "").toLowerCase(),
        ];
        const matches = fields.some((f) => f.includes(q));
        if (!matches) return false;
      }
      if (distanceFilterKm !== "all") {
        if (distanceKm === null) return false;
        if ((distanceKm as number) > (distanceFilterKm as number)) return false;
      }
      return true;
    });
    return list;
  }, [ownersWithDistance, availabilityFilter, selectedType, query, distanceFilterKm]);

  function formatPrice(p?: number | string) {
    if (p === undefined || p === null || p === "") return "—";
    const n = typeof p === "string" ? parseFloat(p) : p;
    if (Number.isNaN(n)) return "—";
    return `₹${n.toFixed(2)} / hour`;
  }

  function formatDistance(d?: number | null) {
    if (d == null) return null;
    const rounded = Math.round(d * 10) / 10;
    return `${rounded.toFixed(1)} km away`;
  }

  function handleLogout() {
    localStorage.removeItem("farmseva_session");
    window.location.hash = "#/login";
  }

  // Notifications helpers
  function refreshNotificationsForFarmer() {
    const allNotifs = loadNotifications();
    const mineNotifs = allNotifs.filter((n) => n.recipientPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, "") && n.recipientRole === "farmer");
    setNotifications(mineNotifs);
  }

  function unreadCount() {
    return notifications.filter((n) => !n.read).length;
  }

  function markNotificationRead(id: string) {
    const all = loadNotifications();
    const updated = all.map((n) => {
      if (n.id === id) return { ...n, read: true };
      return n;
    });
    saveNotifications(updated);
    refreshNotificationsForFarmer();
  }

  function markAllAsRead() {
    const all = loadNotifications();
    const updated = all.map((n) => {
      if (n.recipientPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, "") && n.recipientRole === "farmer") {
        return { ...n, read: true };
      }
      return n;
    });
    saveNotifications(updated);
    refreshNotificationsForFarmer();
  }

  function viewRequestFromNotification(n: NotificationItem) {
    markNotificationRead(n.id);
    setShowNotifications(false);
    setTimeout(() => {
      // scroll into view and highlight the request element
      const el = document.querySelector(`[data-request-id="${n.requestId}"]`);
      if (el && typeof (el as HTMLElement).scrollIntoView === "function") {
        (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
        (el as HTMLElement).classList.add("highlight-request");
        setTimeout(() => (el as HTMLElement).classList.remove("highlight-request"), 2200);
      }
    }, 120);
  }

  // Request flow
  function openRequestModal(owner: Account, machineId?: string | null) {
    setRequestOwner(owner);
    setRequestMachineId(machineId || null);
    setRequestService("");
    setRequestHours("");
    setRequestError(null);
  }

  function closeRequestModal() {
    setRequestOwner(null);
    setRequestMachineId(null);
    setRequestService("");
    setRequestHours("");
    setRequestError(null);
    setRequestBusy(false);
  }

  function createRequest() {
    setRequestError(null);
    if (!session || !requestOwner || !farmer) {
      setRequestError("Unable to create request. Missing session or data.");
      return;
    }
    if (!requestService) {
      setRequestError("Please select a service.");
      return;
    }
    const hours = Number(requestHours);
    if (!hours || Number.isNaN(hours) || hours <= 0) {
      setRequestError("Please enter a valid number of hours greater than 0.");
      return;
    }

    // Find machine item if machineId provided
    const mach = requestMachineId ? loadMachinery().find((m) => m.id === requestMachineId) : null;
    const availability = mach ? (mach.availability || "available") : (requestOwner.availability || "available");
    if ((availability || "").toLowerCase() !== "available") {
      setRequestError("This machinery is currently unavailable.");
      return;
    }

    setRequestBusy(true);
    const allReqs = loadRequests();

    // Duplicate protection: prefer machineId, fallback to machineName
    const duplicate = allReqs.find((r) => {
      if (r.farmerPhone.replace(/\s+/g, "") !== session.phone.replace(/\s+/g, "")) return false;
      if (requestMachineId && r.machineId) {
        return r.machineId === requestMachineId && r.status === "pending";
      }
      // fallback: match owner + machineName
      return r.ownerPhone.replace(/\s+/g, "") === requestOwner.phone.replace(/\s+/g, "") &&
        r.machineName === (mach ? mach.machineName : (requestOwner.machineName || "")) &&
        r.status === "pending";
    });

    if (duplicate) {
      setRequestError("You already have a pending request for this machinery.");
      setRequestBusy(false);
      return;
    }

    const hourlyPrice = requestService === "rent"
      ? Number(mach?.rentPrice ?? requestOwner.rentPrice ?? 0)
      : Number(mach?.operatorPrice ?? requestOwner.operatorPrice ?? 0);
    const totalPrice = hourlyPrice * hours;
    const newReq: RequestItem = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
      farmerPhone: session.phone,
      farmerName: farmer.fullName || "",
      farmerLocation: farmer.location || "",
      ownerPhone: requestOwner.phone || "",
      ownerName: requestOwner.fullName || "",
      ownerLocation: requestOwner.location || requestOwner.village || "",
      machineryType: mach ? mach.machineryType : (requestOwner.machineryType || ""),
      machineName: mach ? mach.machineName : (requestOwner.machineName || ""),
      machineId: mach ? mach.id : undefined,
      serviceType: requestService as "rent" | "operator",
      hourlyPrice: hourlyPrice,
      hours: hours,
      totalPrice: totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const updated = [...allReqs, newReq];
    saveRequests(updated);

    // Create owner notification for new request
    try {
      createNotification({
        recipientPhone: (requestOwner.phone || "").toString(),
        recipientRole: "owner",
        type: "new_request",
        title: "New Machinery Request",
        message: `${farmer.fullName} requested your ${newReq.machineName}. Service: ${requestService === "rent" ? t("owner_rent_machine") : t("owner_with_operator")}; Hours: ${hours}; Estimated: ₹${totalPrice.toFixed(2)}`,
        requestId: newReq.id,
      });
    } catch {
      // ignore
    }

    const mine = updated.filter((r) => r.farmerPhone.replace(/\s+/g, "") === session.phone.replace(/\s+/g, ""));
    setMyRequests(mine);
    setRequestBusy(false);
    closeRequestModal();
  }

  function cancelRequest(reqId: string) {
    const allReqs = loadRequests();
    const updated = allReqs.map((r) => {
      if (r.id === reqId && r.status === "pending") {
        return { ...r, status: "cancelled" as const };
      }
      return r;
    });
    saveRequests(updated);

    const cancelledReq = allReqs.find((r) => r.id === reqId);
    if (cancelledReq) {
      try {
        createNotification({
          recipientPhone: cancelledReq.ownerPhone,
          recipientRole: "owner",
          type: "request_cancelled",
          title: "Request Cancelled",
          message: `${cancelledReq.farmerName} cancelled the request for ${cancelledReq.machineName}.`,
          requestId: cancelledReq.id,
        });
      } catch {
        // ignore
      }
    }

    const mine = updated.filter((r) => r.farmerPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, ""));
    setMyRequests(mine);
  }

  // My Bookings (farmer) - accepted and completed
  const myBookings = React.useMemo(() => {
    return myRequests.filter((r) => r.status === "accepted" || r.status === "completed");
  }, [myRequests]);

  // Helper: get machinery items for an owner
  function machineryForOwner(ownerPhone: string) {
    return machinery.filter((m) => (m.ownerPhone || "").replace(/\s+/g, "") === (ownerPhone || "").replace(/\s+/g, ""));
  }

  // UI rendering
  return (
    <section className="page page-dashboard">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h1>Welcome{farmer && farmer.fullName ? `, ${farmer.fullName}` : ""}</h1>
            <p><strong>{t("farmer_role_label")}:</strong> {t("farmer_role_value")}</p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button className="btn-ghost" onClick={() => { setShowNotifications((s) => !s); if (!showNotifications) refreshNotificationsForFarmer(); }} aria-expanded={showNotifications} aria-controls="notifications-panel">
                🔔 Notifications {unreadCount() > 0 && <span className="notif-badge" aria-hidden>{unreadCount()}</span>}
              </button>
            </div>

            {showNotifications && (
              <div id="notifications-panel" className="entry-card" style={{ marginTop: 8, minWidth: 320 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{t("farmer_notifications_title")}</strong>
                  <button className="btn-link" onClick={markAllAsRead}>{t("farmer_mark_all_read")}</button>
                </div>

                <div style={{ marginTop: 8 }}>
                  {notifications.length === 0 ? (
                    <div className="placeholder-box">{t("farmer_empty_notifications")}</div>
                  ) : (
                    <div style={{ display: "grid", gap: 8 }}>
                      {notifications.slice().reverse().map((n) => (
                        <div key={n.id} className={`entry-card ${n.read ? "notif-read" : "notif-unread"}`} style={{ padding: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700 }}>{n.title}</div>
                              <div style={{ marginTop: 6 }}>{n.message}</div>
                              <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted)" }}>{new Date(n.createdAt).toLocaleString()}</div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              <button className="btn-link" onClick={() => { markNotificationRead(n.id); viewRequestFromNotification(n); }}>{t("farmer_view_request")}</button>
                              <button className="btn-link" onClick={() => markNotificationRead(n.id)}>{t("farmer_mark_read")}</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <strong>{t("farmer_registered_location")}</strong> {farmer ? farmer.location || "—" : "—"}
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>{t("farmer_current_location")}</strong>
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn-secondary" onClick={captureFarmerLocation} disabled={locBusy}>
              {locBusy ? "Detecting location…" : "Use My Current Location"}
            </button>

            <div style={{ fontSize: 13, color: "var(--muted)" }}>
              {farmer && typeof farmer.latitude === "number" && typeof farmer.longitude === "number" ? (
                <span aria-live="polite">{t("farmer_location_detected")}</span>
              ) : (
                <span aria-live="polite">{t("farmer_location_not_detected")}</span>
              )}
            </div>
          </div>

          {locStatus && (
            <div className="field-note" role="status" aria-live="polite" style={{ marginTop: 8 }}>
              {locStatus}
            </div>
          )}
        </div>

        <div className="placeholder-box" style={{ marginTop: 12 }}>
          <strong>{t("farmer_nearby_machinery_placeholder")}</strong>
        </div>

        <div style={{ marginTop: 18 }}>
          <button className="btn-primary" onClick={handleLogout}>{t("nav_logout")}</button>
        </div>

        <hr style={{ margin: "20px 0" }} />

        {/* Nearby Machinery + Filters */}
        <section aria-labelledby="nearby-machinery-heading">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h2 id="nearby-machinery-heading">{t("farmer_nearby_machinery_title")}</h2>

            <div style={{ fontSize: 13, color: "var(--muted)", marginLeft: "auto" }}>
              <div><strong>{t("farmer_your_location")}</strong> {farmer ? farmer.location || "—" : "—"}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                Nearby matching will use exact location/distance in a later step.
              </div>
            </div>
          </div>

          <div className="filters" style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
            <div className="form-row" style={{ minWidth: 160 }}>
              <label htmlFor="filter-type">{t("farmer_machinery_type")}</label>
              <select id="filter-type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">{t("farmer_all_types")}</option>
                {machineryTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-row" style={{ minWidth: 140 }}>
              <label htmlFor="filter-availability">{t("farmer_availability")}</label>
              <select id="filter-availability" value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value as any)}>
                <option value="available">{t("farmer_available")}</option>
                <option value="all">{t("farmer_all")}</option>
              </select>
            </div>

            <div className="form-row" style={{ minWidth: 160 }}>
              <label htmlFor="filter-distance">{t("farmer_nearby")}</label>
              <select
                id="filter-distance"
                value={distanceFilterKm}
                onChange={(e) => {
                  const v = e.target.value;
                  setDistanceFilterKm(v === "all" ? "all" : parseInt(v, 10));
                }}
                disabled={!(farmer && typeof farmer.latitude === "number" && typeof farmer.longitude === "number")}
              >
                <option value="all">{t("farmer_all")}</option>
                <option value="5">{t("farmer_within_5_km")}</option>
                <option value="10">{t("farmer_within_10_km")}</option>
                <option value="25">{t("farmer_within_25_km")}</option>
                <option value="50">{t("farmer_within_50_km")}</option>
              </select>
            </div>

            <div style={{ flex: "1 1 240px", minWidth: 180 }}>
              <label htmlFor="search-q">{t("farmer_search")}</label>
              <input
                id="search-q"
                type="search"
                placeholder="Search machine, type, owner, location"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search machinery"
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => {
                  setSelectedType("");
                  setAvailabilityFilter("available");
                  setQuery("");
                  setDistanceFilterKm("all");
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Results */}
          <div style={{ marginTop: 18 }}>
            {owners.length === 0 ? (
              <div className="placeholder-box">{t("farmer_no_machinery_registered")}</div>
            ) : filteredOwners.length === 0 ? (
              <div className="placeholder-box">{t("farmer_no_machinery_found")}</div>
            ) : (
              <div className="card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                {filteredOwners.map(({ owner: o, distanceKm }, idx) => {
                  // Show owner's primary machine if exists (legacy), otherwise first machinery item
                  const ownerMachines = machineryForOwner(o.phone);
                  const primary = ownerMachines.length > 0 ? ownerMachines[0] : undefined;
                  return (
                    <article key={`${o.phone}-${idx}`} className="entry-card machinery-card" aria-labelledby={`mach-${idx}-title`} style={{ padding: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontSize: 22 }} aria-hidden>🚜</div>
                        <div>
                          <div id={`mach-${idx}-title`} style={{ fontWeight: 700 }}>{primary ? primary.machineryType : (o.machineryType || "Machine")}</div>
                          <div style={{ marginTop: 6, fontSize: 15 }}>{primary ? primary.machineName : (o.machineName || "—")}</div>
                        </div>
                      </div>

                      <div style={{ marginTop: 10, fontSize: 14 }}>
                        <div><strong>{t("farmer_owner")}</strong> {o.fullName || "—"}</div>
                        <div><strong>{t("farmer_location")}</strong> {o.location || o.village || "—"}</div>
                        {distanceKm != null ? (
                          <div style={{ marginTop: 6, color: "var(--muted)" }} aria-label={`Distance ${formatDistance(distanceKm)}`}>
                            📍 {formatDistance(distanceKm)}
                          </div>
                        ) : (
                          <div style={{ marginTop: 6, color: "var(--muted)" }}>
                            📍 Distance not available
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ border: "1px solid rgba(0,0,0,0.04)", padding: 8, borderRadius: 8 }}>
                          <div style={{ fontWeight: 700 }}>{t("owner_rent_machine")}</div>
                          <div style={{ marginTop: 6 }}>{formatPrice(primary?.rentPrice ?? o.rentPrice)}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{t("owner_farmer_operates")}</div>
                        </div>

                        <div style={{ border: "1px solid rgba(0,0,0,0.04)", padding: 8, borderRadius: 8 }}>
                          <div style={{ fontWeight: 700 }}>{t("owner_with_operator")}</div>
                          <div style={{ marginTop: 6 }}>{formatPrice(primary?.operatorPrice ?? o.operatorPrice)}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{t("owner_owner_performs")}</div>
                        </div>
                      </div>

                      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 13, color: (primary?.availability || o.availability || "").toLowerCase() === "available" ? "var(--brand)" : "var(--muted)" }}>
                          {primary ? (primary.availability || "—") : (o.availability ? (o.availability === "available" ? "Available" : o.availability) : "—")}
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="btn-primary"
                            onClick={() => setSelectedOwner(o)}
                            aria-controls="owner-details"
                          >
                            View Details
                          </button>

                          { (primary ? (primary.availability || "").toLowerCase() : (o.availability || "").toLowerCase()) === "available" ? (
                            <button
                              className="btn-secondary"
                              onClick={() => openRequestModal(o, primary?.id)}
                            >
                              Request Machinery
                            </button>
                          ) : (
                            <div style={{ fontSize: 13, color: "var(--muted)", alignSelf: "center" }}>{t("farmer_currently_unavailable")}</div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Request modal */}
        {requestOwner && (
          <aside id="request-modal" className="success-card" role="dialog" aria-modal="true" aria-labelledby="request-modal-title" style={{ marginTop: 18 }}>
            <h3 id="request-modal-title">{t("farmer_request_machinery_title")}</h3>

            <div style={{ marginTop: 8 }}>
              <div><strong>{t("farmer_owner_name")}</strong><div>{requestOwner.fullName}</div></div>

              <div style={{ marginTop: 8 }}>
                <strong>{t("farmer_select_machine")}</strong>
                <div style={{ marginTop: 8 }}>
                  {/* Show owner's machinery list */}
                  {machineryForOwner(requestOwner.phone).length === 0 ? (
                    <div className="placeholder-box">{t("farmer_no_machines_owner")}</div>
                  ) : (
                    <div style={{ display: "grid", gap: 8 }}>
                      {machineryForOwner(requestOwner.phone).map((m) => (
                        <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(0,0,0,0.04)", padding: 8, borderRadius: 6 }}>
                          <input type="radio" name="machine" value={m.id} checked={requestMachineId === m.id} onChange={() => setRequestMachineId(m.id)} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700 }}>{m.machineName} <span style={{ fontSize: 12, color: "var(--muted)" }}>({m.machineryType})</span></div>
                            <div style={{ marginTop: 4 }}>{m.description || ""}</div>
                            <div style={{ marginTop: 6, fontSize: 13 }}>
                              <span>{formatPrice(m.rentPrice)}</span> • <span>{formatPrice(m.operatorPrice)}</span> • <span style={{ color: (m.availability || "").toLowerCase() === "available" ? "var(--brand)" : "var(--muted)" }}>{m.availability || "—"}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <fieldset>
                  <legend style={{ fontWeight: 700 }}>{t("farmer_select_service")}</legend>
                  <label style={{ display: "block", marginTop: 6 }}>
                    <input type="radio" name="service" value="rent" checked={requestService === "rent"} onChange={() => setRequestService("rent")} />{" "}
                    Rent Machine — Farmer operates the machine
                  </label>

                  <label style={{ display: "block", marginTop: 6 }}>
                    <input type="radio" name="service" value="operator" checked={requestService === "operator"} onChange={() => setRequestService("operator")} />{" "}
                    With Operator — Owner/operator performs the work
                  </label>
                </fieldset>
              </div>

              <div style={{ marginTop: 12 }}>
                <label htmlFor="hours"><strong>{t("farmer_hours")}</strong></label>
                <input id="hours" type="number" min="1" value={requestHours as any} onChange={(e) => setRequestHours(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Number of hours" />
              </div>

              <div style={{ marginTop: 12 }}>
                <strong>{t("farmer_estimated_total_label")}</strong>{" "}
                {requestService ? (
                  (() => {
                    const mach = requestMachineId ? loadMachinery().find((m) => m.id === requestMachineId) : null;
                    const hourly = requestService === "rent" ? Number(mach?.rentPrice ?? requestOwner.rentPrice ?? 0) : Number(mach?.operatorPrice ?? requestOwner.operatorPrice ?? 0);
                    const hours = Number(requestHours) || 0;
                    const total = hourly * hours;
                    return <span>{formatPrice(hourly)} × {hours} = <strong>₹{total.toFixed(2)}</strong></span>;
                  })()
                ) : (
                  <span className="field-note">{t("farmer_select_service_estimate")}</span>
                )}
              </div>

              {requestError && <div className="field-error" role="alert" aria-live="assertive" style={{ marginTop: 8 }}>{requestError}</div>}

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button className="btn-primary" onClick={createRequest} disabled={requestBusy}>{t("farmer_send_request")}</button>
                <button className="btn-secondary" onClick={closeRequestModal} disabled={requestBusy}>{t("farmer_cancel")}</button>
              </div>
            </div>
          </aside>
        )}

        {/* Details panel */}
        {selectedOwner && (
          <aside id="owner-details" className="success-card" role="dialog" aria-modal="true" aria-labelledby="owner-details-title" style={{ marginTop: 18 }}>
            <h3 id="owner-details-title">{t("farmer_owner_machinery_details")}</h3>
            <div style={{ marginTop: 8 }}>
              <div><strong>{t("farmer_owner_name")}</strong><div>{selectedOwner.fullName}</div></div>
              <div style={{ marginTop: 8 }}><strong>{t("farmer_phone")}</strong><div>{selectedOwner.phone}</div></div>
              <div style={{ marginTop: 8 }}><strong>{t("farmer_location")}</strong><div>{selectedOwner.location || selectedOwner.village || "—"}</div></div>

              <div style={{ marginTop: 12 }}>
                <strong>{t("farmer_inventory")}</strong>
                <div style={{ marginTop: 8 }}>
                  {machineryForOwner(selectedOwner.phone).length === 0 ? (
                    <div className="placeholder-box">{t("farmer_no_machines_owner")}</div>
                  ) : (
                    <div style={{ display: "grid", gap: 8 }}>
                      {machineryForOwner(selectedOwner.phone).map((m) => (
                        <div key={m.id} className="entry-card" style={{ padding: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                            <div>
                              <div style={{ fontWeight: 700 }}>{m.machineName} <span style={{ fontSize: 12, color: "var(--muted)" }}>({m.machineryType})</span></div>
                              <div style={{ marginTop: 6 }}>{m.description}</div>
                              <div style={{ marginTop: 6, fontSize: 13 }}>
                                {formatPrice(m.rentPrice)} • {formatPrice(m.operatorPrice)} • <span style={{ color: (m.availability || "").toLowerCase() === "available" ? "var(--brand)" : "var(--muted)" }}>{m.availability || "—"}</span>
                              </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              { (m.availability || "").toLowerCase() === "available" ? (
                                <button className="btn-secondary" onClick={() => openRequestModal(selectedOwner, m.id)}>{t("farmer_request_this_machine")}</button>
                              ) : (
                                <div style={{ fontSize: 13, color: "var(--muted)" }}>{t("farmer_unavailable")}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button className="btn-secondary" onClick={() => setSelectedOwner(null)}>{t("farmer_close")}</button>
              </div>
            </div>
          </aside>
        )}

        <hr style={{ margin: "20px 0" }} />

        {/* My Bookings */}
        <section aria-labelledby="my-bookings-heading" style={{ marginTop: 12 }}>
          <h2 id="my-bookings-heading">{t("farmer_my_bookings")}</h2>

          {myBookings.length === 0 ? (
            <div className="placeholder-box">{t("farmer_empty_bookings")}</div>
          ) : (
            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              {myBookings.map((r) => (
                <div key={r.id} className="entry-card" style={{ padding: 12 }} data-request-id={r.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{r.machineName}</div>
                      <div style={{ marginTop: 6 }}>{r.machineryType}</div>
                      <div style={{ marginTop: 6 }}><strong>{t("farmer_owner")}</strong> {r.ownerName}</div>
                      <div style={{ marginTop: 6 }}><strong>{t("farmer_service")} </strong> {r.serviceType === "rent" ? t("owner_rent_machine") : t("owner_with_operator")}</div>
                      <div style={{ marginTop: 6 }}><strong>{t("farmer_hours_label")} </strong> {r.hours}</div>
                      <div style={{ marginTop: 6 }}><strong>{t("farmer_estimated_total_label")}</strong> ₹{r.totalPrice.toFixed(2)}</div>
                      <div style={{ marginTop: 6 }}><strong>{t("farmer_requested")} </strong> {new Date(r.createdAt).toLocaleString()}</div>

                      {r.status === "accepted" && (
                        <div style={{ marginTop: 12 }} aria-live="polite">
                          {r.acceptedDate && r.acceptedTime ? (
                            <div className="confirmation-message" style={{ borderLeft: "4px solid var(--brand)", paddingLeft: 10 }}>
                              <div style={{ fontWeight: 700 }}>🔔 {t("farmer_machinery_confirmed")}</div>
                              <div style={{ marginTop: 6 }}>
                                {r.serviceType === "operator"
                                  ? `Your ${r.machineName} operator will arrive on ${formatDateReadable(r.acceptedDate)} at ${formatTimeReadable(r.acceptedTime)}.`
                                  : `Your ${r.machineName} will be available for pickup/delivery on ${formatDateReadable(r.acceptedDate)} at ${formatTimeReadable(r.acceptedTime)}.`}
                              </div>
                              <div style={{ marginTop: 8 }}><strong>{t("farmer_owner")}</strong> {r.ownerName}</div>
                              <div style={{ marginTop: 4 }}><strong>{t("farmer_location")}</strong> {r.ownerLocation}</div>
                            </div>
                          ) : (
                            <div style={{ marginTop: 8, color: "var(--muted)" }}>{t("farmer_arrival_date_time_not_provided")}</div>
                          )}
                        </div>
                      )}

                      {r.status === "completed" && (
                        <div style={{ marginTop: 12 }} aria-live="polite">
                          <div className="confirmation-message" style={{ borderLeft: "4px solid #28a745", paddingLeft: 10 }}>
                            <div style={{ fontWeight: 700 }}>✅ {t("farmer_job_completed")}</div>
                            <div style={{ marginTop: 6 }}>
                              {r.acceptedDate && r.acceptedTime ? (
                                r.serviceType === "operator"
                                  ? `Your ${r.machineName} operator completed the job on ${formatDateReadable(r.acceptedDate)} at ${formatTimeReadable(r.acceptedTime)}.`
                                  : `Your ${r.machineName} job was completed on ${formatDateReadable(r.acceptedDate)} at ${formatTimeReadable(r.acceptedTime)}.`
                              ) : (
                                "Job completed."
                              )}
                            </div>
                            <div style={{ marginTop: 8 }}><strong>{t("farmer_owner")}</strong> {r.ownerName}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>{t("farmer_status")}</div>
                      <div style={{ marginBottom: 12 }}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <hr style={{ margin: "20px 0" }} />

        {/* My Requests (existing) */}
        <section aria-labelledby="my-requests-heading" style={{ marginTop: 12 }}>
          <h2 id="my-requests-heading">{t("farmer_my_requests")}</h2>

          {myRequests.length === 0 ? (
            <div className="placeholder-box">{t("farmer_empty_requests")}</div>
          ) : (
            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              {myRequests.map((r) => (
                <div key={r.id} className="entry-card" style={{ padding: 12 }} data-request-id={r.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{r.machineName}</div>
                      <div style={{ marginTop: 6 }}>{r.machineryType}</div>
                      <div style={{ marginTop: 6 }}><strong>{t("farmer_owner")}</strong> {r.ownerName}</div>
                      <div style={{ marginTop: 6 }}><strong>{t("farmer_service")} </strong> {r.serviceType === "rent" ? t("owner_rent_machine") : t("owner_with_operator")}</div>
                      <div style={{ marginTop: 6 }}><strong>{t("farmer_hours_label")} </strong> {r.hours}</div>
                      <div style={{ marginTop: 6 }}><strong>{t("farmer_estimated_total_label")}</strong> ₹{r.totalPrice.toFixed(2)}</div>
                      <div style={{ marginTop: 6 }}><strong>{t("farmer_requested")} </strong> {new Date(r.createdAt).toLocaleString()}</div>

                      {r.status === "accepted" && (
                        <div style={{ marginTop: 12 }} aria-live="polite">
                          {r.acceptedDate && r.acceptedTime ? (
                            <div className="confirmation-message" style={{ borderLeft: "4px solid var(--brand)", paddingLeft: 10 }}>
                              <div style={{ fontWeight: 700 }}>🔔 {t("farmer_machinery_confirmed")}</div>
                              <div style={{ marginTop: 6 }}>
                                {r.serviceType === "operator"
                                  ? `Your ${r.machineName} operator will arrive on ${formatDateReadable(r.acceptedDate)} at ${formatTimeReadable(r.acceptedTime)}.`
                                  : `Your ${r.machineName} will be available for pickup/delivery on ${formatDateReadable(r.acceptedDate)} at ${formatTimeReadable(r.acceptedTime)}.`}
                              </div>
                              <div style={{ marginTop: 8 }}><strong>{t("farmer_owner")}</strong> {r.ownerName}</div>
                              <div style={{ marginTop: 4 }}><strong>{t("farmer_location")}</strong> {r.ownerLocation}</div>
                            </div>
                          ) : (
                            <div style={{ marginTop: 8, color: "var(--muted)" }}>{t("farmer_arrival_date_time_not_provided")}</div>
                          )}
                        </div>
                      )}

                      {r.status === "completed" && (
                        <div style={{ marginTop: 12 }} aria-live="polite">
                          <div className="confirmation-message" style={{ borderLeft: "4px solid #28a745", paddingLeft: 10 }}>
                            <div style={{ fontWeight: 700 }}>✅ {t("farmer_job_completed")}</div>
                            <div style={{ marginTop: 6 }}>
                              {r.acceptedDate && r.acceptedTime ? (
                                r.serviceType === "operator"
                                  ? `Your ${r.machineName} operator completed the job on ${formatDateReadable(r.acceptedDate)} at ${formatTimeReadable(r.acceptedTime)}.`
                                  : `Your ${r.machineName} job was completed on ${formatDateReadable(r.acceptedDate)} at ${formatTimeReadable(r.acceptedTime)}.`
                              ) : (
                                "Job completed."
                              )}
                            </div>
                            <div style={{ marginTop: 8 }}><strong>{t("farmer_owner")}</strong> {r.ownerName}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>{t("farmer_status")}</div>
                      <div style={{ marginBottom: 12 }}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</div>

                      {r.status === "pending" && (
                        <button className="btn-secondary" onClick={() => cancelRequest(r.id)}>{t("farmer_cancel_request")}</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}