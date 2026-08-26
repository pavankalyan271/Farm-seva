import React from "react";

/**
 * Owner dashboard: incoming requests, accept/reject, mark completed, notifications, and inventory management.
 *
 * - Requests: farmseva_requests
 * - Notifications: farmseva_notifications
 * - Machinery: farmseva_machinery (new)
 *
 * Migration: if farmseva_machinery missing, create items from owner account fields.
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

/** Machinery helpers */
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
    saveMachinery([]);
  }
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

export default function OwnerDashboard(): React.ReactElement {
  const session = getSession();
  const [owner, setOwner] = React.useState<Account | null>(null);
  const [incoming, setIncoming] = React.useState<RequestItem[]>([]);

  // Notifications
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = React.useState<boolean>(false);

  // Accept modal
  const [acceptingRequest, setAcceptingRequest] = React.useState<RequestItem | null>(null);
  const [acceptDate, setAcceptDate] = React.useState<string>("");
  const [acceptTime, setAcceptTime] = React.useState<string>("");
  const [acceptError, setAcceptError] = React.useState<string | null>(null);
  const [acceptBusy, setAcceptBusy] = React.useState<boolean>(false);

  // Mark completed busy state
  const [completeBusyId, setCompleteBusyId] = React.useState<string | null>(null);

  // Inventory state
  const [myInventory, setMyInventory] = React.useState<MachineryItem[]>([]);
  const [showInventoryModal, setShowInventoryModal] = React.useState<boolean>(false);
  const [editingMachine, setEditingMachine] = React.useState<MachineryItem | null>(null);
  const [inventoryBusy, setInventoryBusy] = React.useState<boolean>(false);
  const [inventoryError, setInventoryError] = React.useState<string | null>(null);

  React.useEffect(() => {
    migrateLegacyMachineryIfNeeded();
    const mach = loadMachinery();
    setMyInventory(mach);

    if (!session) {
      window.location.hash = "#/login";
      return;
    }
    const accounts = loadAccounts();
    const ownerAcc = accounts.find((a) => a.role === "owner" && a.phone.replace(/\s+/g, "") === session.phone.replace(/\s+/g, ""));
    setOwner(ownerAcc || null);

    const reqs = loadRequests();
    const mine = reqs.filter((r) => r.ownerPhone.replace(/\s+/g, "") === session.phone.replace(/\s+/g, ""));
    setIncoming(mine);

    const allNotifs = loadNotifications();
    const mineNotifs = allNotifs.filter((n) => n.recipientPhone.replace(/\s+/g, "") === session.phone.replace(/\s+/g, "") && n.recipientRole === "owner");
    setNotifications(mineNotifs);
  }, []);

  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "farmseva_requests") {
        const reqs = loadRequests();
        const mine = reqs.filter((r) => r.ownerPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, ""));
        setIncoming(mine);
      }
      if (e.key === "farmseva_notifications") {
        const allNotifs = loadNotifications();
        const mineNotifs = allNotifs.filter((n) => n.recipientPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, "") && n.recipientRole === "owner");
        setNotifications(mineNotifs);
      }
      if (e.key === "farmseva_machinery") {
        const mach = loadMachinery();
        setMyInventory(mach);
      }
      if (e.key === "farmseva_accounts") {
        const accounts = loadAccounts();
        const ownerAcc = accounts.find((a) => a.role === "owner" && a.phone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, ""));
        setOwner(ownerAcc || null);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleLogout() {
    localStorage.removeItem("farmseva_session");
    window.location.hash = "#/login";
  }

  function unreadCount() {
    return notifications.filter((n) => !n.read).length;
  }

  function refreshNotificationsForOwner() {
    const allNotifs = loadNotifications();
    const mineNotifs = allNotifs.filter((n) => n.recipientPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, "") && n.recipientRole === "owner");
    setNotifications(mineNotifs);
  }

  function markNotificationRead(id: string) {
    const all = loadNotifications();
    const updated = all.map((n) => {
      if (n.id === id) return { ...n, read: true };
      return n;
    });
    saveNotifications(updated);
    refreshNotificationsForOwner();
  }

  function markAllAsRead() {
    const all = loadNotifications();
    const updated = all.map((n) => {
      if (n.recipientPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, "") && n.recipientRole === "owner") {
        return { ...n, read: true };
      }
      return n;
    });
    saveNotifications(updated);
    refreshNotificationsForOwner();
  }

  function viewRequestFromNotification(n: NotificationItem) {
    markNotificationRead(n.id);
    setShowNotifications(false);
    setTimeout(() => {
      const el = document.querySelector(`[data-request-id="${n.requestId}"]`);
      if (el && typeof (el as HTMLElement).scrollIntoView === "function") {
        (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
        (el as HTMLElement).classList.add("highlight-request");
        setTimeout(() => (el as HTMLElement).classList.remove("highlight-request"), 2200);
      }
    }, 120);
  }

  function onAcceptClick(req: RequestItem) {
    setAcceptingRequest(req);
    setAcceptDate("");
    setAcceptTime("");
    setAcceptError(null);
    setAcceptBusy(false);
  }

  function onRejectClick(id: string) {
    const allReqs = loadRequests();
    const updated = allReqs.map((r) => {
      if (r.id === id) {
        if (r.ownerPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, "") && r.status === "pending") {
          return { ...r, status: "rejected" as const };
        }
      }
      return r;
    });
    saveRequests(updated);
    const mine = updated.filter((r) => r.ownerPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, ""));
    setIncoming(mine);

    const rejectedReq = allReqs.find((r) => r.id === id);
    if (rejectedReq) {
      try {
        createNotification({
          recipientPhone: rejectedReq.farmerPhone,
          recipientRole: "farmer",
          type: "request_rejected",
          title: "Request Rejected",
          message: `Your request for ${rejectedReq.machineName} was rejected by the machinery owner.`,
          requestId: rejectedReq.id,
        });
      } catch {
        // ignore
      }
    }
  }

  function confirmAcceptance() {
    setAcceptError(null);
    if (!acceptingRequest) {
      setAcceptError("No request selected.");
      return;
    }
    if (!acceptDate) {
      setAcceptError("Please select an arrival/service date.");
      return;
    }
    if (!acceptTime) {
      setAcceptError("Please select an arrival/start time.");
      return;
    }
    const now = new Date();
    const [hh, mm] = acceptTime.split(":").map((s) => Number(s));
    const [y, m, d] = acceptDate.split("-").map((s) => Number(s));
    const selected = new Date(y, m - 1, d, hh, mm, 0);
    if (isNaN(selected.getTime())) {
      setAcceptError("Invalid date or time.");
      return;
    }
    if (selected.getTime() < now.getTime()) {
      setAcceptError("Selected date/time is in the past. Please choose a future date and time.");
      return;
    }
    setAcceptBusy(true);
    const allReqs = loadRequests();
    const updated = allReqs.map((r) => {
      if (r.id === acceptingRequest.id) {
        if (r.ownerPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, "") && r.status === "pending") {
          return {
            ...r,
            status: "accepted" as const,
            acceptedDate: acceptDate,
            acceptedTime: acceptTime,
          };
        }
      }
      return r;
    });
    saveRequests(updated);
    const mine = updated.filter((r) => r.ownerPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, ""));
    setIncoming(mine);

    const acceptedReq = updated.find((r) => r.id === acceptingRequest.id);
    if (acceptedReq) {
      try {
        const dateStr = formatDateReadable(acceptedReq.acceptedDate || null) || acceptedReq.acceptedDate || "";
        const timeStr = formatTimeReadable(acceptedReq.acceptedTime || null) || acceptedReq.acceptedTime || "";
        const message = acceptedReq.serviceType === "operator"
          ? `Your ${acceptedReq.machineName} operator will arrive on ${dateStr} at ${timeStr}.`
          : `Your ${acceptedReq.machineName} will be available on ${dateStr} at ${timeStr}.`;

        createNotification({
          recipientPhone: acceptedReq.farmerPhone,
          recipientRole: "farmer",
          type: "request_accepted",
          title: "Request Accepted",
          message: `Your ${acceptedReq.machineName} request was accepted. ${message}`,
          requestId: acceptedReq.id,
        });
      } catch {
        // ignore
      }
    }

    setAcceptingRequest(null);
    setAcceptDate("");
    setAcceptTime("");
    setAcceptError(null);
    setAcceptBusy(false);
  }

  function cancelAcceptance() {
    setAcceptingRequest(null);
    setAcceptDate("");
    setAcceptTime("");
    setAcceptError(null);
    setAcceptBusy(false);
  }

  // Mark a request as completed (owner action)
  function markRequestCompleted(reqId: string) {
    if (!session) return;
    setCompleteBusyId(reqId);
    const allReqs = loadRequests();
    const updated = allReqs.map((r) => {
      if (r.id === reqId) {
        // only allow owner to mark their own accepted job as completed
        if (r.ownerPhone.replace(/\s+/g, "") === session.phone.replace(/\s+/g, "") && r.status === "accepted") {
          return { ...r, status: "completed" as const };
        }
      }
      return r;
    });
    saveRequests(updated);
    const mine = updated.filter((r) => r.ownerPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, ""));
    setIncoming(mine);

    const completedReq = updated.find((r) => r.id === reqId);
    if (completedReq) {
      try {
        createNotification({
          recipientPhone: completedReq.farmerPhone,
          recipientRole: "farmer",
          type: "request_completed",
          title: "Job Completed",
          message: `${completedReq.ownerName} marked your ${completedReq.machineName} job as completed.`,
          requestId: completedReq.id,
        });
      } catch {
        // ignore
      }
    }
    setCompleteBusyId(null);
  }

  // My Jobs (owner) - accepted and completed
  const myJobs = React.useMemo(() => {
    return incoming.filter((r) => r.status === "accepted" || r.status === "completed");
  }, [incoming]);

  // Inventory management functions
  function refreshInventoryForOwner() {
    const all = loadMachinery();
    const mine = all.filter((m) => m.ownerPhone.replace(/\s+/g, "") === (session?.phone || "").replace(/\s+/g, ""));
    setMyInventory(mine);
  }

  function openAddMachine() {
    setEditingMachine({
      id: "",
      ownerPhone: session?.phone || "",
      machineName: "",
      machineryType: "",
      description: "",
      rentPrice: 0,
      operatorPrice: 0,
      availability: "available",
      createdAt: new Date().toISOString(),
    });
    setInventoryError(null);
    setShowInventoryModal(true);
  }

  function openEditMachine(m: MachineryItem) {
    setEditingMachine({ ...m });
    setInventoryError(null);
    setShowInventoryModal(true);
  }

  function saveMachine() {
    if (!editingMachine) return;
    setInventoryError(null);
    const m = editingMachine;
    if (!m.machineName || !m.machineryType) {
      setInventoryError("Machine name and type are required.");
      return;
    }
    if (m.rentPrice != null && (Number.isNaN(Number(m.rentPrice)) || Number(m.rentPrice) < 0)) {
      setInventoryError("Rent price must be a valid non-negative number.");
      return;
    }
    if (m.operatorPrice != null && (Number.isNaN(Number(m.operatorPrice)) || Number(m.operatorPrice) < 0)) {
      setInventoryError("Operator price must be a valid non-negative number.");
      return;
    }
    setInventoryBusy(true);
    const all = loadMachinery();
    if (!m.id) {
      // create
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
      const item: MachineryItem = {
        ...m,
        id,
        ownerPhone: session?.phone || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      all.push(item);
      saveMachinery(all);
    } else {
      // update
      const updated = all.map((it) => {
        if (it.id === m.id) {
          return { ...m, updatedAt: new Date().toISOString() };
        }
        return it;
      });
      saveMachinery(updated);
    }
    refreshInventoryForOwner();
    setInventoryBusy(false);
    setShowInventoryModal(false);
    setEditingMachine(null);
  }

  function toggleAvailability(machineId: string) {
    const all = loadMachinery();
    const updated = all.map((m) => {
      if (m.id === machineId) {
        const next = (m.availability || "").toLowerCase() === "available" ? "unavailable" : "available";
        return { ...m, availability: next, updatedAt: new Date().toISOString() };
      }
      return m;
    });
    saveMachinery(updated);
    refreshInventoryForOwner();
  }

  function deleteMachine(machineId: string) {
    // Prevent deletion if there are pending requests for this machine
    const reqs = loadRequests();
    const pending = reqs.find((r) => r.machineId === machineId && r.status === "pending");
    if (pending) {
      alert("Cannot delete machine with pending requests. Please resolve or cancel pending requests first.");
      return;
    }
    const all = loadMachinery();
    const updated = all.filter((m) => m.id !== machineId);
    saveMachinery(updated);
    refreshInventoryForOwner();
  }

  // UI
  return (
    <section className="page page-dashboard">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h1>Welcome{owner && owner.fullName ? `, ${owner.fullName}` : ""}</h1>
            <p><strong>Role:</strong> Machinery Owner</p>
            <p><strong>Registered location:</strong> {owner ? owner.location : "—"}</p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button className="btn-ghost" onClick={() => { setShowNotifications((s) => !s); if (!showNotifications) refreshNotificationsForOwner(); }} aria-expanded={showNotifications} aria-controls="notifications-panel">
                🔔 Notifications {unreadCount() > 0 && <span className="notif-badge" aria-hidden>{unreadCount()}</span>}
              </button>
            </div>

            {showNotifications && (
              <div id="notifications-panel" className="entry-card" style={{ marginTop: 8, minWidth: 320 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>Notifications</strong>
                  <button className="btn-link" onClick={markAllAsRead}>Mark all as read</button>
                </div>

                <div style={{ marginTop: 8 }}>
                  {notifications.length === 0 ? (
                    <div className="placeholder-box">No new notifications.</div>
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
                              <button className="btn-link" onClick={() => { markNotificationRead(n.id); viewRequestFromNotification(n); }}>View Request</button>
                              <button className="btn-link" onClick={() => markNotificationRead(n.id)}>Mark read</button>
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

        <div style={{ marginTop: 12 }}>
          <button className="btn-primary" onClick={handleLogout}>Logout</button>
        </div>

        <hr style={{ margin: "20px 0" }} />

        <section aria-labelledby="incoming-requests-heading">
          <h2 id="incoming-requests-heading">Incoming Machinery Requests</h2>

          {incoming.length === 0 ? (
            <div className="placeholder-box" style={{ marginTop: 12 }}>No requests yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              {incoming.map((r) => (
                <div key={r.id} className="entry-card" style={{ padding: 12 }} data-request-id={r.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{r.machineryType} — {r.machineName}</div>
                      <div style={{ marginTop: 6 }}><strong>Farmer:</strong> {r.farmerName}</div>
                      <div style={{ marginTop: 6 }}><strong>Location:</strong> {r.farmerLocation}</div>
                      <div style={{ marginTop: 6 }}><strong>Service:</strong> {r.serviceType === "rent" ? "Rent Machine" : "With Operator"}</div>
                      <div style={{ marginTop: 6 }}><strong>Hourly price:</strong> ₹{r.hourlyPrice.toFixed(2)}</div>
                      <div style={{ marginTop: 6 }}><strong>Hours:</strong> {r.hours}</div>
                      <div style={{ marginTop: 6 }}><strong>Estimated total:</strong> ₹{r.totalPrice.toFixed(2)}</div>
                      <div style={{ marginTop: 6 }}><strong>Requested:</strong> {new Date(r.createdAt).toLocaleString()}</div>

                      {r.status === "accepted" && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ fontWeight: 700 }}>Arrival</div>
                          {r.acceptedDate && r.acceptedTime ? (
                            <>
                              <div style={{ marginTop: 6 }}><strong>Arrival date:</strong> {formatDateReadable(r.acceptedDate)}</div>
                              <div style={{ marginTop: 6 }}><strong>Arrival time:</strong> {formatTimeReadable(r.acceptedTime)}</div>
                            </>
                          ) : (
                            <div style={{ marginTop: 6, color: "var(--muted)" }}>Arrival date and time not yet provided.</div>
                          )}
                        </div>
                      )}

                      {r.status === "completed" && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ fontWeight: 700 }}>Completed</div>
                          <div style={{ marginTop: 6, color: "var(--muted)" }}>
                            {r.acceptedDate && r.acceptedTime ? `Completed on ${formatDateReadable(r.acceptedDate)} at ${formatTimeReadable(r.acceptedTime)}` : "Completed"}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>Status</div>
                      <div style={{ marginBottom: 12 }}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</div>

                      {r.status === "pending" ? (
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <button className="btn-primary" onClick={() => onAcceptClick(r)}>Accept</button>
                          <button className="btn-secondary" onClick={() => onRejectClick(r.id)}>Reject</button>
                        </div>
                      ) : r.status === "accepted" ? (
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <button className="btn-secondary" onClick={() => onAcceptClick(r)}>Update / View</button>
                          <button
                            className="btn-primary"
                            onClick={() => markRequestCompleted(r.id)}
                            disabled={completeBusyId === r.id}
                          >
                            {completeBusyId === r.id ? "Completing…" : "Mark Completed"}
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, color: "var(--muted)" }}>No actions available</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <hr style={{ margin: "20px 0" }} />

        {/* Inventory management */}
        <section aria-labelledby="inventory-heading" style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 id="inventory-heading">My Inventory</h2>
            <div>
              <button className="btn-primary" onClick={openAddMachine}>Add New Machine</button>
            </div>
          </div>

          {myInventory.length === 0 ? (
            <div className="placeholder-box" style={{ marginTop: 12 }}>You have no machines listed yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              {myInventory.map((m) => (
                <div key={m.id} className="entry-card" style={{ padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{m.machineName} <span style={{ fontSize: 12, color: "var(--muted)" }}>({m.machineryType})</span></div>
                      <div style={{ marginTop: 6 }}>{m.description}</div>
                      <div style={{ marginTop: 6, fontSize: 13 }}>
                        {m.rentPrice != null ? `Rent: ₹${m.rentPrice.toFixed(2)}` : "Rent: —"} • {m.operatorPrice != null ? `Operator: ₹${m.operatorPrice.toFixed(2)}` : "Operator: —"}
                      </div>
                      <div style={{ marginTop: 6, color: (m.availability || "").toLowerCase() === "available" ? "var(--brand)" : "var(--muted)" }}>
                        {m.availability || "—"}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button className="btn-secondary" onClick={() => openEditMachine(m)}>Edit</button>
                      <button className="btn-secondary" onClick={() => toggleAvailability(m.id)}>{(m.availability || "").toLowerCase() === "available" ? "Mark Unavailable" : "Mark Available"}</button>
                      <button className="btn-danger" onClick={() => deleteMachine(m.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <hr style={{ margin: "20px 0" }} />

        {/* My Jobs */}
        <section aria-labelledby="my-jobs-heading" style={{ marginTop: 12 }}>
          <h2 id="my-jobs-heading">My Jobs</h2>

          {myJobs.length === 0 ? (
            <div className="placeholder-box">No active jobs yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              {myJobs.map((r) => (
                <div key={r.id} className="entry-card" style={{ padding: 12 }} data-request-id={r.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{r.machineryType} — {r.machineName}</div>
                      <div style={{ marginTop: 6 }}><strong>Farmer:</strong> {r.farmerName}</div>
                      <div style={{ marginTop: 6 }}><strong>Service:</strong> {r.serviceType === "rent" ? "Rent Machine" : "With Operator"}</div>
                      <div style={{ marginTop: 6 }}><strong>Hours:</strong> {r.hours}</div>
                      <div style={{ marginTop: 6 }}><strong>Estimated total:</strong> ₹{r.totalPrice.toFixed(2)}</div>

                      {r.status === "accepted" && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ fontWeight: 700 }}>Scheduled</div>
                          {r.acceptedDate && r.acceptedTime ? (
                            <>
                              <div style={{ marginTop: 6 }}><strong>Date:</strong> {formatDateReadable(r.acceptedDate)}</div>
                              <div style={{ marginTop: 6 }}><strong>Time:</strong> {formatTimeReadable(r.acceptedTime)}</div>
                            </>
                          ) : (
                            <div style={{ marginTop: 6, color: "var(--muted)" }}>Date/time not provided</div>
                          )}
                        </div>
                      )}

                      {r.status === "completed" && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ fontWeight: 700 }}>Completed</div>
                          <div style={{ marginTop: 6, color: "var(--muted)" }}>
                            {r.acceptedDate && r.acceptedTime ? `Completed on ${formatDateReadable(r.acceptedDate)} at ${formatTimeReadable(r.acceptedTime)}` : "Completed"}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>Status</div>
                      <div style={{ marginBottom: 12 }}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</div>

                      {r.status === "accepted" && (
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <button
                            className="btn-primary"
                            onClick={() => markRequestCompleted(r.id)}
                            disabled={completeBusyId === r.id}
                          >
                            {completeBusyId === r.id ? "Completing…" : "Mark Completed"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Acceptance modal */}
        {acceptingRequest && (
          <aside className="success-card" role="dialog" aria-modal="true" aria-labelledby="accept-modal-title" style={{ marginTop: 18 }}>
            <h3 id="accept-modal-title">Confirm Acceptance</h3>

            <div style={{ marginTop: 8 }}>
              <div><strong>Request from</strong><div>{acceptingRequest.farmerName} — {acceptingRequest.farmerLocation}</div></div>
              <div style={{ marginTop: 8 }}><strong>Machine</strong><div>{acceptingRequest.machineName} ({acceptingRequest.machineryType})</div></div>
              <div style={{ marginTop: 8 }}><strong>Service</strong><div>{acceptingRequest.serviceType === "rent" ? "Rent Machine" : "With Operator"}</div></div>

              <div style={{ marginTop: 12 }}>
                <label htmlFor="accept-date">Arrival / Service Date</label>
                <input id="accept-date" type="date" value={acceptDate} onChange={(e) => setAcceptDate(e.target.value)} />
              </div>

              <div style={{ marginTop: 12 }}>
                <label htmlFor="accept-time">Arrival / Start Time</label>
                <input id="accept-time" type="time" value={acceptTime} onChange={(e) => setAcceptTime(e.target.value)} />
              </div>

              {acceptError && <div className="field-error" role="alert" aria-live="assertive" style={{ marginTop: 8 }}>{acceptError}</div>}

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button className="btn-primary" onClick={confirmAcceptance} disabled={acceptBusy}>Confirm Acceptance</button>
                <button className="btn-secondary" onClick={cancelAcceptance} disabled={acceptBusy}>Cancel</button>
              </div>
            </div>
          </aside>
        )}

        {/* Inventory modal (Add / Edit) */}
        {showInventoryModal && editingMachine && (
          <aside className="success-card" role="dialog" aria-modal="true" aria-labelledby="inventory-modal-title" style={{ marginTop: 18 }}>
            <h3 id="inventory-modal-title">{editingMachine.id ? "Edit Machine" : "Add Machine"}</h3>

            <div style={{ marginTop: 8 }}>
              <div>
                <label htmlFor="machine-name">Machine name</label>
                <input id="machine-name" type="text" value={editingMachine.machineName} onChange={(e) => setEditingMachine({ ...editingMachine, machineName: e.target.value })} />
              </div>

              <div style={{ marginTop: 8 }}>
                <label htmlFor="machine-type">Type</label>
                <input id="machine-type" type="text" value={editingMachine.machineryType} onChange={(e) => setEditingMachine({ ...editingMachine, machineryType: e.target.value })} />
              </div>

              <div style={{ marginTop: 8 }}>
                <label htmlFor="machine-desc">Description</label>
                <textarea id="machine-desc" value={editingMachine.description} onChange={(e) => setEditingMachine({ ...editingMachine, description: e.target.value })} />
              </div>

              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="rent-price">Rent price (₹/hour)</label>
                  <input id="rent-price" type="number" min="0" value={editingMachine.rentPrice as any} onChange={(e) => setEditingMachine({ ...editingMachine, rentPrice: e.target.value === "" ? undefined : Number(e.target.value) })} />
                </div>

                <div style={{ flex: 1 }}>
                  <label htmlFor="operator-price">Operator price (₹/hour)</label>
                  <input id="operator-price" type="number" min="0" value={editingMachine.operatorPrice as any} onChange={(e) => setEditingMachine({ ...editingMachine, operatorPrice: e.target.value === "" ? undefined : Number(e.target.value) })} />
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <label htmlFor="availability">Availability</label>
                <select id="availability" value={editingMachine.availability} onChange={(e) => setEditingMachine({ ...editingMachine, availability: e.target.value })}>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              {inventoryError && <div className="field-error" role="alert" aria-live="assertive" style={{ marginTop: 8 }}>{inventoryError}</div>}

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button className="btn-primary" onClick={saveMachine} disabled={inventoryBusy}>{inventoryBusy ? "Saving…" : "Save"}</button>
                <button className="btn-secondary" onClick={() => { setShowInventoryModal(false); setEditingMachine(null); }}>Cancel</button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
