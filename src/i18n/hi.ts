// src/i18n/hi.ts

export const hi: typeof import("./en").en = {
  // Header / navigation
  header_title: "Farm Seva",
  nav_home: "होम",
  nav_farmer: "किसान",
  nav_owner: "मशीनरी मालिक",
  nav_logout: "लॉगआउट",
  nav_language_label: "भाषा",

  // Footer
  footer_prototype:
    "Farm Seva — प्रोटोटाइप (केवल डेमो ऑथेंटिकेशन)",

  // Home
  home_hero_title:
    "अपने खेत के लिए सही मशीनरी खोजें",

  home_hero_description:
    "Farm Seva किसानों को पास की कृषि मशीनरी खोजने में मदद करता है और मशीनरी मालिकों को अपनी सेवाओं की आवश्यकता वाले किसानों से जोड़ता है।",

  home_cta_farmer:
    "मैं किसान हूँ",

  home_cta_owner:
    "मैं मशीनरी मालिक हूँ",

  home_farmer_card_aria:
    "किसान के रूप में प्रवेश करें",

  home_farmer_card_description:
    "पास की मशीनरी खोजें, उपकरण किराए पर लें या काम करने के लिए ऑपरेटर बुलाएँ।",

  home_owner_card_aria:
    "मशीनरी मालिक के रूप में प्रवेश करें",

  home_owner_card_description:
    "अपनी मशीनरी सूचीबद्ध और प्रबंधित करें तथा स्थानीय किसानों से जुड़ें।",

  // Authentication
  auth_login_title:
    "लॉगिन",

  auth_register_title:
    "रजिस्टर",

  auth_role_label:
    "भूमिका",

  auth_role_farmer:
    "किसान",

  auth_role_owner:
    "मशीनरी मालिक",

  auth_phone_label:
    "फ़ोन नंबर",

  auth_password_label:
    "पासवर्ड",

  auth_password_confirm_label:
    "पासवर्ड की पुष्टि करें",

  auth_login_button:
    "लॉगिन",

  auth_register_button:
    "खाता बनाएँ",

  auth_invalid_phone:
    "कृपया मान्य 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।",

  auth_invalid_password:
    "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",

  auth_password_mismatch:
    "पासवर्ड मेल नहीं खाते हैं।",

  auth_login_error:
    "फ़ोन, पासवर्ड या भूमिका गलत है।",

  auth_demo_note:
    "यह केवल डेमो ऑथेंटिकेशन है — प्रोडक्शन में सुरक्षित बैकएंड आवश्यक है।",

  auth_phone_placeholder:
    "10 अंकों का मोबाइल नंबर",

  auth_password_placeholder:
    "कम से कम 6 अक्षर",

  auth_error_phone:
    "6-9 से शुरू होने वाला मान्य 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।",

  auth_error_password:
    "पासवर्ड आवश्यक है और कम से कम 6 अक्षरों का होना चाहिए।",

  auth_error_account_not_found:
    "इस फ़ोन नंबर और भूमिका के लिए कोई खाता नहीं मिला। कृपया पहले रजिस्टर करें।",

  auth_error_incorrect_password:
    "पासवर्ड गलत है। कृपया फिर से प्रयास करें।",

  // Farmer registration
  farmer_register_title:
    "किसान पंजीकरण",

  farmer_full_name_label:
    "पूरा नाम",

  farmer_village_label:
    "गाँव / शहर",

  farmer_location_label:
    "लोकेशन",

  farmer_register_success:
    "किसान पंजीकरण सफल हुआ।",

  farmer_registration_description:
    "पास की कृषि मशीनरी खोजने और मशीनरी मालिकों से जुड़ने के लिए अपना किसान खाता बनाएँ।",

  farmer_form_instructions:
    "अपना किसान खाता बनाने के लिए सभी आवश्यक जानकारी भरें।",

  farmer_full_name_placeholder:
    "अपना पूरा नाम दर्ज करें",

  farmer_phone_placeholder:
    "10 अंकों का मोबाइल नंबर",

  farmer_village_placeholder:
    "अपना गाँव या शहर दर्ज करें",

  farmer_location_placeholder:
    "अपनी लोकेशन दर्ज करें",

  farmer_error_full_name_required:
    "पूरा नाम आवश्यक है।",

  farmer_error_full_name_length:
    "पूरा नाम कम से कम 3 अक्षरों का होना चाहिए।",

  farmer_error_phone_required:
    "फ़ोन नंबर आवश्यक है।",

  farmer_error_phone_invalid:
    "6-9 से शुरू होने वाला मान्य 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।",

  farmer_error_village_required:
    "गाँव या शहर आवश्यक है।",

  farmer_error_village_length:
    "गाँव या शहर कम से कम 2 अक्षरों का होना चाहिए।",

  farmer_error_location_required:
    "लोकेशन आवश्यक है।",

  farmer_error_password_required:
    "पासवर्ड आवश्यक है।",

  farmer_error_password_length:
    "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",

  farmer_error_confirm_password:
    "कृपया अपने पासवर्ड की पुष्टि करें।",

  farmer_error_password_mismatch:
    "पासवर्ड मेल नहीं खाते हैं।",

  farmer_location_not_supported:
    "इस ब्राउज़र में जियोलोकेशन उपलब्ध नहीं है।",

  farmer_location_requesting:
    "आपकी लोकेशन की अनुमति माँगी जा रही है...",

  farmer_location_captured:
    "आपकी वर्तमान लोकेशन सफलतापूर्वक दर्ज हो गई है।",

  farmer_location_permission_denied:
    "लोकेशन की अनुमति नहीं मिली। अनुमति देकर फिर से प्रयास करें।",

  farmer_location_unavailable:
    "अभी आपकी लोकेशन उपलब्ध नहीं है।",

  farmer_location_timeout:
    "लोकेशन अनुरोध का समय समाप्त हो गया। कृपया फिर से प्रयास करें।",

  farmer_location_error:
    "आपकी लोकेशन निर्धारित नहीं हो सकी। कृपया फिर से प्रयास करें।",

  farmer_registration_success_title:
    "पंजीकरण सफल हुआ",

  farmer_registration_success_message:
    "आपका किसान खाता सफलतापूर्वक बनाया गया है।",

  farmer_detecting_location:
    "लोकेशन खोजी जा रही है...",

  farmer_use_current_location:
    "मेरी वर्तमान लोकेशन का उपयोग करें",

  farmer_location_detected:
    "लोकेशन मिल गई।",

  farmer_no_coordinates:
    "कोई निर्देशांक दर्ज नहीं है।",

  farmer_coordinates:
    "निर्देशांक",

  farmer_register_button:
    "रजिस्टर करें",

  farmer_reset_button:
    "रीसेट करें",

  farmer_edit_button:
    "संपादित करें",

  farmer_register_another_button:
    "एक और किसान को रजिस्टर करें",

  farmer_note_title:
    "नोट",

  farmer_note_description:
    "यह केवल फ्रंटएंड डेमो है। खाते की जानकारी आपके ब्राउज़र में स्थानीय रूप से संग्रहीत होती है।",

  // Farmer dashboard
  farmer_dashboard_title:
    "किसान डैशबोर्ड",

  farmer_search_placeholder:
    "मशीनरी या मालिक खोजें...",

  farmer_filter_title:
    "फ़िल्टर",

  farmer_filter_available:
    "केवल उपलब्ध",

  farmer_filter_distance:
    "दूरी",

  farmer_machinery_card_request_button:
    "मशीनरी का अनुरोध करें",

  farmer_profile_title:
    "किसान प्रोफ़ाइल",

  farmer_my_bookings_title:
    "मेरी बुकिंग्स",

  farmer_notifications_title:
    "सूचनाएँ",

  farmer_empty_bookings:
    "अभी तक कोई बुकिंग नहीं है।",

  farmer_empty_notifications:
    "अभी तक कोई सूचना नहीं है।",

  farmer_request_status_pending:
    "पेंडिंग",

  farmer_request_status_accepted:
    "स्वीकृत",

  farmer_request_status_rejected:
    "अस्वीकृत",

  farmer_request_status_completed:
    "पूर्ण",

  farmer_request_sent_success:
    "मशीनरी अनुरोध मालिक को भेजा गया।",

  // Owner registration
  owner_register_title:
    "मशीनरी मालिक पंजीकरण",

  owner_full_name_label:
    "पूरा नाम",

  owner_village_label:
    "गाँव / शहर",

  owner_location_label:
    "लोकेशन",

  owner_machinery_type_label:
    "मशीनरी का प्रकार",

  owner_machine_name_label:
    "मशीन का नाम / मॉडल",

  owner_rent_price_label:
    "प्रति घंटे किराया",

  owner_operator_price_label:
    "प्रति घंटे ऑपरेटर सेवा शुल्क",

  owner_availability_label:
    "उपलब्धता",

  owner_register_success:
    "मशीनरी मालिक का पंजीकरण सफल हुआ।",

  // Owner dashboard
  owner_dashboard_title:
    "मशीनरी मालिक डैशबोर्ड",

  owner_inventory_title:
    "मेरी मशीनरी",

  owner_add_machinery_button:
    "मशीनरी जोड़ें",

  owner_edit_machinery_button:
    "संपादित करें",

  owner_delete_machinery_button:
    "हटाएँ",

  owner_requests_title:
    "आने वाले अनुरोध",

  owner_accept_button:
    "स्वीकार करें",

  owner_reject_button:
    "अस्वीकार करें",

  owner_schedule_date_label:
    "निर्धारित तारीख",

  owner_schedule_time_label:
    "निर्धारित समय",

  owner_my_jobs_title:
    "मेरे कार्य",

  owner_complete_job_button:
    "कार्य पूर्ण के रूप में चिह्नित करें",

  owner_profile_title:
    "मशीनरी मालिक प्रोफ़ाइल",

  owner_notifications_title:
    "सूचनाएँ",

  owner_empty_inventory:
    "अभी तक कोई मशीनरी नहीं जोड़ी गई है।",

  owner_empty_requests:
    "अभी तक कोई अनुरोध नहीं है।",

  owner_empty_jobs:
    "अभी तक कोई कार्य नहीं है।",

  owner_request_accepted_success:
    "अनुरोध स्वीकार किया गया।",

  owner_request_rejected_success:
    "अनुरोध अस्वीकार किया गया।",

  owner_job_completed_success:
    "कार्य पूर्ण के रूप में चिह्नित किया गया।",

  // Shared labels
  shared_full_name:
    "पूरा नाम",

  shared_phone:
    "फ़ोन नंबर",

  shared_village_city:
    "गाँव / शहर",

  shared_location:
    "लोकेशन",

  // Shared / modals / buttons
  shared_loading:
    "लोड हो रहा है...",

  shared_error_generic:
    "कुछ गलत हो गया। कृपया फिर से प्रयास करें।",

  shared_success_generic:
    "कार्रवाई सफलतापूर्वक पूरी हुई।",

  shared_modal_confirm:
    "पुष्टि करें",

  shared_modal_cancel:
    "रद्द करें",

  shared_modal_close:
    "बंद करें",

  shared_back:
    "वापस",

  // Notifications
  notif_new_request_title:
    "नई मशीनरी का अनुरोध",

  notif_new_request_message:
    "एक किसान ने आपकी मशीनरी का अनुरोध किया है।",

  notif_request_accepted_title:
    "अनुरोध स्वीकार किया गया",

  notif_request_accepted_message:
    "आपका मशीनरी अनुरोध स्वीकार कर लिया गया है।",

  notif_request_rejected_title:
    "अनुरोध अस्वीकार किया गया",

  notif_request_rejected_message:
    "आपका मशीनरी अनुरोध अस्वीकार कर दिया गया है।",

  notif_request_completed_title:
    "कार्य पूरा हुआ",

  notif_request_completed_message:
    "आपका कार्य पूरा हो गया है।",

    // Additional Machinery Owner Registration UI
  owner_full_name_required: "पूरा नाम आवश्यक है।",
  owner_full_name_min: "पूरा नाम कम से कम 3 अक्षरों का होना चाहिए।",
  owner_phone_required: "फ़ोन नंबर आवश्यक है।",
  owner_phone_invalid:
    "6-9 से शुरू होने वाला मान्य 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।",
  owner_village_required: "गाँव या शहर आवश्यक है।",
  owner_village_min:
    "गाँव या शहर कम से कम 2 अक्षरों का होना चाहिए।",
  owner_location_required: "लोकेशन आवश्यक है।",
  owner_machinery_type_required:
    "कृपया मशीनरी का प्रकार चुनें।",
  owner_machine_name_required:
    "मशीन का नाम या मॉडल आवश्यक है।",
  owner_machine_name_min:
    "मशीन का नाम कम से कम 2 अक्षरों का होना चाहिए।",
  owner_rent_required:
    "प्रति घंटे किराया आवश्यक है।",
  owner_rent_positive:
    "किराए के लिए शून्य से अधिक संख्या दर्ज करें।",
  owner_operator_required:
    "ऑपरेटर सेवा का प्रति घंटे शुल्क आवश्यक है।",
  owner_operator_positive:
    "ऑपरेटर सेवा शुल्क के लिए शून्य से अधिक संख्या दर्ज करें।",
  owner_availability_required:
    "कृपया उपलब्धता चुनें।",
  owner_password_required:
    "पासवर्ड आवश्यक है।",
  owner_password_min:
    "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
  owner_confirm_password_required:
    "कृपया अपने पासवर्ड की पुष्टि करें।",
  owner_password_mismatch:
    "पासवर्ड मेल नहीं खाते हैं।",

  owner_geolocation_unsupported:
    "आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता।",
  owner_requesting_location:
    "लोकेशन की अनुमति माँगी जा रही है...",
  owner_location_captured:
    "लोकेशन सफलतापूर्वक दर्ज हो गई है।",
  owner_permission_denied:
    "लोकेशन की अनुमति नहीं मिली। आप टेक्स्ट लोकेशन का उपयोग कर सकते हैं या फिर से प्रयास कर सकते हैं।",
  owner_location_unavailable:
    "लोकेशन उपलब्ध नहीं है। कृपया बाद में फिर से प्रयास करें।",
  owner_location_timeout:
    "लोकेशन अनुरोध का समय समाप्त हो गया। कृपया फिर से प्रयास करें।",
  owner_location_failed:
    "लोकेशन दर्ज नहीं की जा सकी। कृपया फिर से प्रयास करें।",

  owner_registration_description:
    "मशीनरी मालिक के रूप में पंजीकरण करें और किसानों के लिए उपलब्ध मशीनरी जोड़ें।",
  owner_form_instructions:
    "मालिक और मशीनरी की जानकारी भरें। सभी फ़ील्ड आवश्यक हैं। कीबोर्ड से भी नेविगेट किया जा सकता है।",
  owner_information_title:
    "मालिक की जानकारी",
  owner_phone_label:
    "फ़ोन नंबर",
  owner_detecting_location:
    "लोकेशन खोजी जा रही है…",
  owner_use_current_location:
    "मेरी वर्तमान लोकेशन का उपयोग करें",
  owner_location_detected:
    "लोकेशन मिल गई",
  owner_no_coordinates:
    "कोई निर्देशांक दर्ज नहीं है",

  machinery_information_title:
    "मशीनरी की जानकारी",
  owner_select_machinery_type:
    "मशीनरी का प्रकार चुनें",

  owner_rent_machine:
    "मशीन किराया",
  owner_farmer_operates:
    "किसान मशीन चलाएगा",
  owner_with_operator:
    "ऑपरेटर के साथ",
  owner_owner_performs:
    "मालिक/ऑपरेटर काम करेगा",

  owner_available:
    "उपलब्ध",
  owner_currently_unavailable:
    "अभी उपलब्ध नहीं",

  owner_register_machinery:
    "मशीनरी पंजीकृत करें",
  owner_reset:
    "रीसेट करें",

  owner_registration_success_title:
    "पंजीकरण सफल हुआ",
  owner_registration_success_message:
    "आपका मशीनरी मालिक खाता और मशीनरी विवरण सफलतापूर्वक पंजीकृत हो गए हैं।",

  owner_summary_owner:
    "मालिक",
  owner_summary_phone:
    "फ़ोन",
  owner_summary_village:
    "गाँव / शहर",
  owner_summary_location:
    "लोकेशन",
  owner_summary_coordinates:
    "निर्देशांक",
  owner_summary_machinery_type:
    "मशीनरी का प्रकार",
  owner_summary_machine_name:
    "मशीन का नाम / मॉडल",
  owner_per_hour:
    "प्रति घंटा",

  owner_edit:
    "संपादित करें",
  owner_register_another:
    "एक और पंजीकरण करें",

  owner_note_title:
    "नोट",
  owner_note:
    "यह केवल फ्रंटएंड प्रोटोटाइप है। प्रदर्शन के लिए पंजीकरण डेटा आपके ब्राउज़र में स्थानीय रूप से संग्रहीत किया जाता है।",
};