Farm Seva — Future API Contracts

Important

These API contracts describe possible future production backend architecture. They are NOT implemented in the current Farm Seva assignment, which is frontend-only.

Authentication — POST /api/register

Registers a Farmer or Machinery Owner.

Example request:
{ role, fullName, phone, password, location }

Example response:
{ id, role, fullName, phone }

Authentication — POST /api/login

Authenticates a user.

Example request:
{ phone, password }

Example response:
{ token, user: { id, role, fullName, phone } }

Machinery — GET /api/machinery

Retrieve machinery with optional ownerPhone, q, type and available query parameters.

Machinery — POST /api/machinery

Create a machinery listing. Owner authentication is required.

Machinery — PUT /api/machinery/:id

Update an existing machinery listing. Owner authentication and ownership validation are required.

Machinery — DELETE /api/machinery/:id

Delete a machinery listing. Owner authentication and ownership validation are required.

Requests — POST /api/requests

Create a new machinery request with farmer, owner, machine, service, hours and price information.

Requests — PUT /api/requests/:id/accept

Owner accepts a request. Request body includes acceptedDate and acceptedTime.

Requests — PUT /api/requests/:id/reject

Owner rejects a request. Backend validates ownership and request state.

Requests — PUT /api/requests/:id/complete

Owner marks an accepted job completed and records completedAt.

Notifications — GET /api/notifications

Retrieve notifications for the authenticated user, optionally filtered by recipientPhone.

Notifications — POST /api/notifications

Create a notification for a recipient.

Production Security Requirements

A production backend should provide secure password hashing, server-side authentication and authorization, ownership validation, input validation, request-state validation, audit logging, secure file/image storage and appropriate rate limiting.

Current Frontend Implementation

The current assignment uses farmseva_accounts, farmseva_session, farmseva_machinery, farmseva_requests and farmseva_notifications through browser localStorage.

Future Migration

Current: React → localStorage. Future: React → REST API → Backend → Database. The UI can retain the same concepts while replacing the data layer with API calls.