Farm Seva — Demo Script

Purpose

This is the grader-friendly demonstration script for the Farm Seva frontend assignment. Use two browser tabs and demo accounts only.

Owner Tab — Register and Add Machinery

1. Open Farm Seva.
2. Register as a Machinery Owner.
3. Login.
4. Open Owner Dashboard.
5. Add machinery.
6. Enter machine details.
7. Verify the machinery appears.

Farmer Tab — Register and Request

1. Open Farm Seva in a second tab.
2. Register as a Farmer.
3. Login.
4. Open Farmer Dashboard.
5. Search for machinery.
6. Apply filters.
7. Select the owner's machinery.
8. Send a machinery request.

Owner Tab — Accept and Schedule

1. Open incoming requests.
2. Verify the farmer request.
3. Accept the request.
4. Set scheduled date.
5. Set scheduled time.

Farmer Tab — Booking

1. Verify the acceptance notification.
2. Verify scheduled date/time.
3. Open My Bookings.
4. Verify the booking.

Owner Tab — Complete Job

1. Open My Jobs.
2. Find the accepted job.
3. Mark it completed.
4. Verify the status changes.

Farmer Tab — Completion

1. Verify the completion notification.
2. Open My Bookings.
3. Verify the booking is completed.

Additional Demonstrations

Demonstrate profile editing, multiple machinery, machinery availability, search/filtering, logout, wrong-role dashboard protection, responsive/mobile layout and cross-tab behavior.

Cross-Tab Flow

Farmer sends request → Owner sees request → Owner accepts → Farmer sees notification/booking → Owner completes job → Farmer sees completion notification.

Final Build Check

Run npm run build and verify the build succeeds with zero TypeScript/build errors.

Prototype Limitation

The application uses browser localStorage. Data is local to the browser/device, authentication is a frontend prototype, notifications are in-app prototype notifications, and cross-device synchronization is not provided.