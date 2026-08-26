// src/i18n/en.ts

export const en = {
  // Header / navigation
  header_title: "Farm Seva",
  nav_home: "Home",
  nav_farmer: "Farmer",
  nav_owner: "Machinery Owner",
  nav_logout: "Logout",
  nav_language_label: "Language",

  // Footer
  footer_prototype:
    "Farm Seva — Prototype shell (Demo authentication only)",

  // Home
  home_hero_title: "Find the right machinery for your farm",
  home_hero_description:
    "Farm Seva helps farmers find nearby agricultural machinery and helps machinery owners connect with farmers who need their services.",
  home_cta_farmer: "I'm a Farmer",
  home_cta_owner: "I'm a Machinery Owner",
  home_farmer_card_aria: "Enter as Farmer",
  home_farmer_card_description:
    "Find nearby machinery, rent equipment, or hire an operator to do the work.",
  home_owner_card_aria: "Enter as Machinery Owner",
  home_owner_card_description:
    "List and manage your machinery and connect with local farmers.",

  // Authentication
  auth_login_title: "Login",
  auth_register_title: "Register",
  auth_role_label: "Role",
  auth_role_farmer: "Farmer",
  auth_role_owner: "Machinery Owner",
  auth_phone_label: "Phone Number",
  auth_password_label: "Password",
  auth_password_confirm_label: "Confirm Password",
  auth_login_button: "Login",
  auth_register_button: "Create Account",
  auth_invalid_phone:
    "Please enter a valid 10-digit Indian mobile number.",
  auth_invalid_password:
    "Password must be at least 6 characters.",
  auth_password_mismatch:
    "Passwords do not match.",
  auth_login_error:
    "Invalid phone, password, or role.",
  auth_demo_note:
    "Demo authentication only — production authentication requires a secure backend.",

  auth_phone_placeholder:
    "10-digit mobile number",
  auth_password_placeholder:
    "Minimum 6 characters",

  auth_error_phone:
    "Enter a valid 10-digit Indian mobile number starting with 6-9.",
  auth_error_password:
    "Password is required and must be at least 6 characters.",
  auth_error_account_not_found:
    "No account found for this phone and role. Please register first.",
  auth_error_incorrect_password:
    "Incorrect password. Please try again.",

  // Farmer registration
  farmer_register_title: "Farmer Registration",
  farmer_full_name_label: "Full Name",
  farmer_village_label: "Village / City",
  farmer_location_label: "Location",
  farmer_register_success:
    "Farmer registration successful.",

  farmer_registration_description:
    "Create your farmer account to find nearby agricultural machinery and connect with machinery owners.",

  farmer_form_instructions:
    "Fill in all required fields to create your farmer account.",

  farmer_full_name_placeholder:
    "Enter your full name",

  farmer_phone_placeholder:
    "10-digit mobile number",

  farmer_village_placeholder:
    "Enter your village or city",

  farmer_location_placeholder:
    "Enter your location",

  farmer_error_full_name_required:
    "Full name is required.",

  farmer_error_full_name_length:
    "Full name must be at least 3 characters.",

  farmer_error_phone_required:
    "Phone number is required.",

  farmer_error_phone_invalid:
    "Please enter a valid 10-digit Indian mobile number starting with 6-9.",

  farmer_error_village_required:
    "Village or city is required.",

  farmer_error_village_length:
    "Village or city must be at least 2 characters.",

  farmer_error_location_required:
    "Location is required.",

  farmer_error_password_required:
    "Password is required.",

  farmer_error_password_length:
    "Password must be at least 6 characters.",

  farmer_error_confirm_password:
    "Please confirm your password.",

  farmer_error_password_mismatch:
    "Passwords do not match.",

  farmer_location_not_supported:
    "Geolocation is not supported by this browser.",

  farmer_location_requesting:
    "Requesting your location...",

  farmer_location_captured:
    "Your current location has been captured.",

  farmer_location_permission_denied:
    "Location permission was denied. Please allow location access and try again.",

  farmer_location_unavailable:
    "Your location is currently unavailable.",

  farmer_location_timeout:
    "Location request timed out. Please try again.",

  farmer_location_error:
    "Unable to determine your location. Please try again.",

  farmer_registration_success_title:
    "Registration Successful",

  farmer_registration_success_message:
    "Your farmer account has been created successfully.",

  farmer_detecting_location:
    "Detecting location...",

  farmer_use_current_location:
    "Use My Current Location",

  farmer_location_detected:
    "Location detected.",

  farmer_no_coordinates:
    "No coordinates captured.",

  farmer_coordinates:
    "Coordinates",

  farmer_register_button:
    "Register",

  farmer_reset_button:
    "Reset",

  farmer_edit_button:
    "Edit",

  farmer_register_another_button:
    "Register Another Farmer",

  farmer_note_title:
    "Note",

  farmer_note_description:
    "This is a frontend-only demo. Account information is stored locally in your browser.",

  // Farmer dashboard
  farmer_dashboard_title: "Farmer Dashboard",
  farmer_search_placeholder:
    "Search machinery or owners...",
  farmer_filter_title: "Filters",
  farmer_filter_available: "Available only",
  farmer_filter_distance: "Distance",
  farmer_machinery_card_request_button:
    "Request Machinery",
  farmer_profile_title: "Farmer Profile",
  farmer_my_bookings_title: "My Bookings",
  farmer_notifications_title: "Notifications",
  farmer_empty_bookings:
    "No bookings yet.",
  farmer_empty_notifications:
    "No notifications yet.",
  farmer_request_status_pending:
    "Pending",
  farmer_request_status_accepted:
    "Accepted",
  farmer_request_status_rejected:
    "Rejected",
  farmer_request_status_completed:
    "Completed",
  farmer_request_sent_success:
    "Request sent to machinery owner.",

  // Owner registration
  owner_register_title:
    "Machinery Owner Registration",
  owner_full_name_label:
    "Full Name",
  owner_village_label:
    "Village / City",
  owner_location_label:
    "Location",
  owner_machinery_type_label:
    "Machinery Type",
  owner_machine_name_label:
    "Machine Name / Model",
  owner_rent_price_label:
    "Rent Price per Hour",
  owner_operator_price_label:
    "Operator Service Price per Hour",
  owner_availability_label:
    "Availability",
  owner_register_success:
    "Machinery owner registration successful.",

  // Owner dashboard
  owner_dashboard_title:
    "Owner Dashboard",
  owner_inventory_title:
    "My Inventory",
  owner_add_machinery_button:
    "Add Machinery",
  owner_edit_machinery_button:
    "Edit",
  owner_delete_machinery_button:
    "Delete",
  owner_requests_title:
    "Incoming Requests",
  owner_accept_button:
    "Accept",
  owner_reject_button:
    "Reject",
  owner_schedule_date_label:
    "Scheduled Date",
  owner_schedule_time_label:
    "Scheduled Time",
  owner_my_jobs_title:
    "My Jobs",
  owner_complete_job_button:
    "Mark Completed",
  owner_profile_title:
    "Owner Profile",
  owner_notifications_title:
    "Notifications",
  owner_empty_inventory:
    "No machinery added yet.",
  owner_empty_requests:
    "No incoming requests.",
  owner_empty_jobs:
    "No jobs yet.",
  owner_request_accepted_success:
    "Request accepted.",
  owner_request_rejected_success:
    "Request rejected.",
  owner_job_completed_success:
    "Job marked as completed.",

  // Shared labels
  shared_full_name:
    "Full Name",
  shared_phone:
    "Phone Number",
  shared_village_city:
    "Village / City",
  shared_location:
    "Location",

  // Shared / modals / buttons
  shared_loading:
    "Loading...",
  shared_error_generic:
    "Something went wrong. Please try again.",
  shared_success_generic:
    "Action completed successfully.",
  shared_modal_confirm:
    "Confirm",
  shared_modal_cancel:
    "Cancel",
  shared_modal_close:
    "Close",
  shared_back:
    "Back",

  // Notifications
  notif_new_request_title:
    "New Machinery Request",
  notif_new_request_message:
    "A farmer has requested your machinery.",
  notif_request_accepted_title:
    "Request Accepted",
  notif_request_accepted_message:
    "Your machinery request has been accepted.",
  notif_request_rejected_title:
    "Request Rejected",
  notif_request_rejected_message:
    "Your machinery request has been rejected.",
  notif_request_completed_title:
    "Job Completed",
  notif_request_completed_message:
    "Your job has been completed.",
  
    // Machinery owner registration - additional UI
  owner_full_name_required: "Full name is required.",
  owner_full_name_min: "Full name must be at least 3 characters.",
  owner_phone_required: "Phone number is required.",
  owner_phone_invalid:
    "Enter a valid 10-digit Indian mobile number starting with 6-9.",
  owner_village_required: "Village or city is required.",
  owner_village_min:
    "Village or city must be at least 2 characters.",
  owner_location_required: "Location is required.",
  owner_machinery_type_required:
    "Select a machinery type.",
  owner_machine_name_required:
    "Machine name or model is required.",
  owner_machine_name_min:
    "Machine name must be at least 2 characters.",
  owner_rent_required:
    "Rent price per hour is required.",
  owner_rent_positive:
    "Enter a positive number for rent price.",
  owner_operator_required:
    "Operator service price per hour is required.",
  owner_operator_positive:
    "Enter a positive number for operator service price.",
  owner_availability_required:
    "Select availability.",
  owner_password_required:
    "Password is required.",
  owner_password_min:
    "Password must be at least 6 characters.",
  owner_confirm_password_required:
    "Please confirm your password.",
  owner_password_mismatch:
    "Passwords do not match.",

  owner_geolocation_unsupported:
    "Geolocation is not supported by your browser.",
  owner_requesting_location:
    "Requesting location permission...",
  owner_location_captured:
    "Location captured successfully.",
  owner_permission_denied:
    "Permission denied. You can continue using text location or try again.",
  owner_location_unavailable:
    "Location unavailable. Please try again later.",
  owner_location_timeout:
    "Location request timed out. Please try again.",
  owner_location_failed:
    "Unable to capture location. Please try again.",

  owner_registration_description:
    "Register as a machinery owner and add a machine you want to offer to farmers.",
  owner_form_instructions:
    "Fill in owner and machinery details. All fields are required. Use the keyboard to navigate.",
  owner_information_title:
    "Owner Information",
  owner_phone_label:
    "Phone Number",
  owner_detecting_location:
    "Detecting location…",
  owner_use_current_location:
    "Use My Current Location",
  owner_location_detected:
    "Location detected",
  owner_no_coordinates:
    "No coordinates captured",

  machinery_information_title:
    "Machinery Information",
  owner_select_machinery_type:
    "Select machinery type",

    owner_rent_machine:
    "Rent Machine",

  owner_farmer_operates:
    "Farmer operates the machine",

  owner_with_operator:
    "With Operator",

  owner_owner_performs:
    "Owner/operator performs the work",

  owner_available:
    "Available",

  owner_currently_unavailable:
    "Currently Unavailable",

  owner_register_machinery:
    "Register Machinery",

  owner_reset:
    "Reset",

  owner_registration_success_title:
    "Registration Successful",

  owner_registration_success_message:
    "Your machinery owner account and machinery details have been registered successfully.",

  owner_summary_owner:
    "Owner",

  owner_summary_phone:
    "Phone",

  owner_summary_village:
    "Village / City",

  owner_summary_location:
    "Location",

  owner_summary_coordinates:
    "Coordinates",

  owner_summary_machinery_type:
    "Machinery Type",

  owner_summary_machine_name:
    "Machine Name / Model",

  owner_per_hour:
    "per hour",

  owner_edit:
    "Edit",

  owner_register_another:
    "Register Another",

  owner_note_title:
    "Note",

  owner_note:
    "This is a frontend-only prototype. Registration data is stored locally in your browser for demonstration purposes.",
    farmer_role_label: "Role",
  farmer_role_value: "Farmer",
  farmer_mark_all_read: "Mark all as read",
  farmer_view_request: "View Request",
  farmer_mark_read: "Mark as read",
  farmer_registered_location: "Registered Location:",
  farmer_current_location: "Current Location:",
  farmer_location_not_detected: "Location not detected.",
  farmer_nearby_machinery_placeholder: "Nearby Machinery",
  farmer_nearby_machinery_title: "Nearby Machinery",
  farmer_your_location: "Your Location:",
  farmer_machinery_type: "Machinery Type",
  farmer_all_types: "All Types",
  farmer_availability: "Availability",
  farmer_available: "Available",
  farmer_all: "All",
  farmer_nearby: "Distance",
  farmer_within_5_km: "Within 5 km",
  farmer_within_10_km: "Within 10 km",
  farmer_within_25_km: "Within 25 km",
  farmer_within_50_km: "Within 50 km",
  farmer_search: "Search",
  farmer_no_machinery_registered: "No machinery has been registered yet.",
  farmer_no_machinery_found: "No machinery found matching your search.",
  farmer_owner: "Owner:",
  farmer_location: "Location:",
  farmer_currently_unavailable: "Currently unavailable",
  farmer_request_machinery_title: "Request Machinery",
  farmer_owner_name: "Owner Name:",
  farmer_select_machine: "Select Machine",
  farmer_no_machines_owner: "This owner has no machines available.",
  farmer_select_service: "Select Service",
  farmer_hours: "Hours",
  farmer_estimated_total_label: "Estimated Total:",
  farmer_select_service_estimate: "Select a service to see the estimated price.",
  farmer_send_request: "Send Request",
  farmer_cancel: "Cancel",
  farmer_owner_machinery_details: "Owner & Machinery Details",
  farmer_phone: "Phone:",
  farmer_inventory: "Machinery:",
  farmer_request_this_machine: "Request This Machine",
  farmer_unavailable: "Unavailable",
  farmer_close: "Close",
  farmer_my_bookings: "My Bookings",
  farmer_service: "Service:",
  farmer_hours_label: "Hours:",
  farmer_requested: "Requested:",
  farmer_machinery_confirmed: "Machinery Request Accepted",
  farmer_arrival_date_time_not_provided: "Arrival date/time not provided.",
  farmer_job_completed: "Job Completed",
  farmer_status: "Status:",
  farmer_my_requests: "My Requests",
  farmer_empty_requests: "No requests yet.",
  farmer_cancel_request: "Cancel Request",
};

export type EnKeys = keyof typeof en;