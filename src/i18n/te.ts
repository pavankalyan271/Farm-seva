// src/i18n/te.ts

export const te: typeof import("./en").en = {
  // Header / navigation
  header_title: "Farm Seva",
  nav_home: "హోమ్",
  nav_farmer: "రైతు",
  nav_owner: "యంత్ర యజమాని",
  nav_logout: "లాగ్ అవుట్",
  nav_language_label: "భాష",

  // Footer
  footer_prototype:
    "Farm Seva — ప్రోటోటైప్ (డెమో ఆథెంటికేషన్ మాత్రమే)",

  // Home
  home_hero_title:
    "మీ వ్యవసాయానికి సరైన యంత్రాన్ని కనుగొనండి",
  home_hero_description:
    "Farm Seva రైతులకు సమీపంలోని వ్యవసాయ యంత్రాలను కనుగొనడంలో సహాయపడుతుంది మరియు యంత్ర యజమానులను సేవలు అవసరమైన రైతులతో కలుపుతుంది.",
  home_cta_farmer:
    "నేను రైతును",
  home_cta_owner:
    "నేను యంత్ర యజమానిని",

  home_farmer_card_aria:
    "రైతుగా ప్రవేశించండి",
  home_farmer_card_description:
    "సమీపంలోని యంత్రాలను కనుగొని, పరికరాలను అద్దెకు తీసుకోండి లేదా పనిని చేయడానికి ఆపరేటర్‌ను నియమించుకోండి.",
  home_owner_card_aria:
    "యంత్ర యజమానిగా ప్రవేశించండి",
  home_owner_card_description:
    "మీ యంత్రాలను జాబితా చేసి నిర్వహించండి మరియు స్థానిక రైతులతో అనుసంధానం అవ్వండి.",

  // Authentication
  auth_login_title: "లాగిన్",
  auth_register_title: "రిజిస్టర్",
  auth_role_label: "పాత్ర",
  auth_role_farmer: "రైతు",
  auth_role_owner: "యంత్ర యజమాని",
  auth_phone_label: "ఫోన్ నంబర్",
  auth_password_label: "పాస్‌వర్డ్",
  auth_password_confirm_label:
    "పాస్‌వర్డ్‌ను నిర్ధారించండి",
  auth_login_button: "లాగిన్",
  auth_register_button:
    "ఖాతా సృష్టించండి",
  auth_invalid_phone:
    "దయచేసి సరైన 10 అంకెల భారతీయ మొబైల్ నంబర్ ఇవ్వండి.",
  auth_invalid_password:
    "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.",
  auth_password_mismatch:
    "పాస్‌వర్డ్‌లు సరిపోలడం లేదు.",
  auth_login_error:
    "ఫోన్, పాస్‌వర్డ్ లేదా పాత్ర తప్పుగా ఉంది.",
  auth_demo_note:
    "ఇది డెమో ఆథెంటికేషన్ మాత్రమే — ప్రొడక్షన్‌లో సురక్షిత బ్యాక్‌ఎండ్ అవసరం.",

  auth_phone_placeholder:
    "10 అంకెల మొబైల్ నంబర్",
  auth_password_placeholder:
    "కనీసం 6 అక్షరాలు",

  auth_error_phone:
    "6-9తో ప్రారంభమయ్యే సరైన 10 అంకెల భారతీయ మొబైల్ నంబర్ ఇవ్వండి.",
  auth_error_password:
    "పాస్‌వర్డ్ తప్పనిసరి మరియు కనీసం 6 అక్షరాలు ఉండాలి.",
  auth_error_account_not_found:
    "ఈ ఫోన్ నంబర్ మరియు పాత్రకు ఖాతా కనుగొనబడలేదు. ముందుగా రిజిస్టర్ చేయండి.",
  auth_error_incorrect_password:
    "పాస్‌వర్డ్ తప్పుగా ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి.",

  // Farmer registration
  farmer_register_title:
    "రైతు నమోదు",
  farmer_full_name_label:
    "పూర్తి పేరు",
  farmer_village_label:
    "గ్రామం / నగరం",
  farmer_location_label:
    "స్థానం",
  farmer_register_success:
    "రైతు నమోదు విజయవంతమైంది.",

  farmer_registration_description:
    "సమీపంలోని వ్యవసాయ యంత్రాలను కనుగొని యంత్ర యజమానులతో అనుసంధానం కావడానికి మీ రైతు ఖాతాను సృష్టించండి.",

  farmer_form_instructions:
    "మీ రైతు ఖాతాను సృష్టించడానికి అవసరమైన అన్ని వివరాలను నమోదు చేయండి.",

  farmer_full_name_placeholder:
    "మీ పూర్తి పేరు నమోదు చేయండి",

  farmer_phone_placeholder:
    "10 అంకెల మొబైల్ నంబర్",

  farmer_village_placeholder:
    "మీ గ్రామం లేదా నగరాన్ని నమోదు చేయండి",

  farmer_location_placeholder:
    "మీ స్థానాన్ని నమోదు చేయండి",

  farmer_error_full_name_required:
    "పూర్తి పేరు తప్పనిసరి.",

  farmer_error_full_name_length:
    "పూర్తి పేరు కనీసం 3 అక్షరాలు ఉండాలి.",

  farmer_error_phone_required:
    "ఫోన్ నంబర్ తప్పనిసరి.",

  farmer_error_phone_invalid:
    "6-9తో ప్రారంభమయ్యే సరైన 10 అంకెల భారతీయ మొబైల్ నంబర్ ఇవ్వండి.",

  farmer_error_village_required:
    "గ్రామం లేదా నగరం తప్పనిసరి.",

  farmer_error_village_length:
    "గ్రామం లేదా నగరం కనీసం 2 అక్షరాలు ఉండాలి.",

  farmer_error_location_required:
    "స్థానం తప్పనిసరి.",

  farmer_error_password_required:
    "పాస్‌వర్డ్ తప్పనిసరి.",

  farmer_error_password_length:
    "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.",

  farmer_error_confirm_password:
    "దయచేసి మీ పాస్‌వర్డ్‌ను నిర్ధారించండి.",

  farmer_error_password_mismatch:
    "పాస్‌వర్డ్‌లు సరిపోలడం లేదు.",

  farmer_location_not_supported:
    "ఈ బ్రౌజర్‌లో జియోలొకేషన్‌కు మద్దతు లేదు.",

  farmer_location_requesting:
    "మీ స్థానాన్ని పొందడానికి అనుమతి కోరుతోంది...",

  farmer_location_captured:
    "మీ ప్రస్తుత స్థానం విజయవంతంగా నమోదు చేయబడింది.",

  farmer_location_permission_denied:
    "స్థాన అనుమతి నిరాకరించబడింది. అనుమతిని ఇచ్చి మళ్లీ ప్రయత్నించండి.",

  farmer_location_unavailable:
    "ప్రస్తుతం మీ స్థానం అందుబాటులో లేదు.",

  farmer_location_timeout:
    "స్థాన అభ్యర్థనకు సమయం ముగిసింది. దయచేసి మళ్లీ ప్రయత్నించండి.",

  farmer_location_error:
    "మీ స్థానాన్ని గుర్తించలేకపోయాం. దయచేసి మళ్లీ ప్రయత్నించండి.",

  farmer_registration_success_title:
    "నమోదు విజయవంతమైంది",

  farmer_registration_success_message:
    "మీ రైతు ఖాతా విజయవంతంగా సృష్టించబడింది.",

  farmer_detecting_location:
    "స్థానాన్ని గుర్తిస్తోంది...",

  farmer_use_current_location:
    "నా ప్రస్తుత స్థానాన్ని ఉపయోగించండి",

  farmer_location_detected:
    "స్థానం గుర్తించబడింది.",

  farmer_no_coordinates:
    "కోఆర్డినేట్లు నమోదు కాలేదు.",

  farmer_coordinates:
    "కోఆర్డినేట్లు",

  farmer_register_button:
    "నమోదు చేయండి",

  farmer_reset_button:
    "రీసెట్ చేయండి",

  farmer_edit_button:
    "సవరించండి",

  farmer_register_another_button:
    "మరొక రైతును నమోదు చేయండి",

  farmer_note_title:
    "గమనిక",

  farmer_note_description:
    "ఇది ఫ్రంట్‌ఎండ్ మాత్రమే ఉన్న డెమో. ఖాతా సమాచారం మీ బ్రౌజర్‌లో స్థానికంగా నిల్వ చేయబడుతుంది.",

  // Farmer dashboard
  farmer_dashboard_title:
    "రైతు డాష్‌బోర్డ్",

  farmer_search_placeholder:
    "యంత్రాలు లేదా యజమానులను శోధించండి...",

  farmer_filter_title:
    "ఫిల్టర్లు",

  farmer_filter_available:
    "అందుబాటులో ఉన్నవి మాత్రమే",

  farmer_filter_distance:
    "దూరం",

  farmer_machinery_card_request_button:
    "యంత్రాన్ని అభ్యర్థించండి",

  farmer_profile_title:
    "రైతు ప్రొఫైల్",

  farmer_my_bookings_title:
    "నా బుకింగ్స్",

  farmer_notifications_title:
    "నోటిఫికేషన్లు",

  farmer_empty_bookings:
    "ఇప్పటివరకు బుకింగ్స్ లేవు.",

  farmer_empty_notifications:
    "ఇప్పటివరకు నోటిఫికేషన్లు లేవు.",

  farmer_request_status_pending:
    "పెండింగ్",

  farmer_request_status_accepted:
    "అంగీకరించబడింది",

  farmer_request_status_rejected:
    "తిరస్కరించబడింది",

  farmer_request_status_completed:
    "పూర్తయింది",

  farmer_request_sent_success:
    "యంత్ర అభ్యర్థన యజమానికి పంపబడింది.",

  // Owner registration
  owner_register_title:
    "యంత్ర యజమాని నమోదు",

  owner_full_name_label:
    "పూర్తి పేరు",

  owner_village_label:
    "గ్రామం / నగరం",

  owner_location_label:
    "స్థానం",

  owner_machinery_type_label:
    "యంత్రం రకం",

  owner_machine_name_label:
    "యంత్రం పేరు / మోడల్",

  owner_rent_price_label:
    "గంటకు అద్దె ధర",

  owner_operator_price_label:
    "గంటకు ఆపరేటర్ సేవ ధర",

  owner_availability_label:
    "లభ్యత",

  owner_register_success:
    "యంత్ర యజమాని నమోదు విజయవంతమైంది.",

  // Owner dashboard
  owner_dashboard_title:
    "యంత్ర యజమాని డాష్‌బోర్డ్",

  owner_inventory_title:
    "నా ఇన్వెంటరీ",

  owner_add_machinery_button:
    "యంత్రాన్ని జోడించండి",

  owner_edit_machinery_button:
    "సవరించండి",

  owner_delete_machinery_button:
    "తొలగించండి",

  owner_requests_title:
    "వచ్చిన అభ్యర్థనలు",

  owner_accept_button:
    "అంగీకరించండి",

  owner_reject_button:
    "తిరస్కరించండి",

  owner_schedule_date_label:
    "షెడ్యూల్ తేదీ",

  owner_schedule_time_label:
    "షెడ్యూల్ సమయం",

  owner_my_jobs_title:
    "నా పనులు",

  owner_complete_job_button:
    "పని పూర్తయిందిగా గుర్తించండి",

  owner_profile_title:
    "యంత్ర యజమాని ప్రొఫైల్",

  owner_notifications_title:
    "నోటిఫికేషన్లు",

  owner_empty_inventory:
    "ఇప్పటివరకు యంత్రాలు జోడించలేదు.",

  owner_empty_requests:
    "ఇప్పటివరకు వచ్చిన అభ్యర్థనలు లేవు.",

  owner_empty_jobs:
    "ఇప్పటివరకు పనులు లేవు.",

  owner_request_accepted_success:
    "అభ్యర్థన అంగీకరించబడింది.",

  owner_request_rejected_success:
    "అభ్యర్థన తిరస్కరించబడింది.",

  owner_job_completed_success:
    "పని పూర్తయినట్లు గుర్తించబడింది.",

  // Shared labels
  shared_full_name:
    "పూర్తి పేరు",

  shared_phone:
    "ఫోన్ నంబర్",

  shared_village_city:
    "గ్రామం / నగరం",

  shared_location:
    "స్థానం",

  // Shared / modals / buttons
  shared_loading:
    "లోడ్ అవుతోంది...",

  shared_error_generic:
    "ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.",

  shared_success_generic:
    "చర్య విజయవంతంగా పూర్తయింది.",

  shared_modal_confirm:
    "నిర్ధారించండి",

  shared_modal_cancel:
    "రద్దు చేయండి",

  shared_modal_close:
    "మూసివేయండి",

  shared_back:
    "వెనక్కి",

  // Notifications
  notif_new_request_title:
    "కొత్త యంత్ర అభ్యర్థన",

  notif_new_request_message:
    "ఒక రైతు మీ యంత్రాన్ని అభ్యర్థించారు.",

  notif_request_accepted_title:
    "అభ్యర్థన అంగీకరించబడింది",

  notif_request_accepted_message:
    "మీ యంత్ర అభ్యర్థన అంగీకరించబడింది.",

  notif_request_rejected_title:
    "అభ్యర్థన తిరస్కరించబడింది",

  notif_request_rejected_message:
    "మీ యంత్ర అభ్యర్థన తిరస్కరించబడింది.",

  notif_request_completed_title:
    "పని పూర్తయింది",

  notif_request_completed_message:
    "మీ పని పూర్తయింది.",
  
    // Additional Machinery Owner Registration UI
  owner_full_name_required: "పూర్తి పేరు తప్పనిసరి.",
  owner_full_name_min: "పూర్తి పేరు కనీసం 3 అక్షరాలు ఉండాలి.",
  owner_phone_required: "ఫోన్ నంబర్ తప్పనిసరి.",
  owner_phone_invalid:
    "6-9తో ప్రారంభమయ్యే సరైన 10 అంకెల భారతీయ మొబైల్ నంబర్ ఇవ్వండి.",
  owner_village_required: "గ్రామం లేదా నగరం తప్పనిసరి.",
  owner_village_min:
    "గ్రామం లేదా నగరం కనీసం 2 అక్షరాలు ఉండాలి.",
  owner_location_required: "స్థానం తప్పనిసరి.",
  owner_machinery_type_required:
    "దయచేసి యంత్రం రకాన్ని ఎంచుకోండి.",
  owner_machine_name_required:
    "యంత్రం పేరు లేదా మోడల్ తప్పనిసరి.",
  owner_machine_name_min:
    "యంత్రం పేరు కనీసం 2 అక్షరాలు ఉండాలి.",
  owner_rent_required:
    "గంటకు అద్దె ధర తప్పనిసరి.",
  owner_rent_positive:
    "అద్దె ధర కోసం సున్నా కంటే ఎక్కువ సంఖ్యను నమోదు చేయండి.",
  owner_operator_required:
    "ఆపరేటర్ సేవకు గంటకు ధర తప్పనిసరి.",
  owner_operator_positive:
    "ఆపరేటర్ సేవ ధర కోసం సున్నా కంటే ఎక్కువ సంఖ్యను నమోదు చేయండి.",
  owner_availability_required:
    "దయచేసి లభ్యతను ఎంచుకోండి.",
  owner_password_required:
    "పాస్‌వర్డ్ తప్పనిసరి.",
  owner_password_min:
    "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.",
  owner_confirm_password_required:
    "దయచేసి మీ పాస్‌వర్డ్‌ను నిర్ధారించండి.",
  owner_password_mismatch:
    "పాస్‌వర్డ్‌లు సరిపోలడం లేదు.",

  owner_geolocation_unsupported:
    "మీ బ్రౌజర్ జియోలొకేషన్‌కు మద్దతు ఇవ్వదు.",
  owner_requesting_location:
    "స్థాన అనుమతి కోరుతోంది...",
  owner_location_captured:
    "స్థానం విజయవంతంగా నమోదు చేయబడింది.",
  owner_permission_denied:
    "స్థాన అనుమతి నిరాకరించబడింది. మీరు టెక్స్ట్ ద్వారా స్థానం ఇవ్వవచ్చు లేదా మళ్లీ ప్రయత్నించవచ్చు.",
  owner_location_unavailable:
    "స్థానం అందుబాటులో లేదు. దయచేసి కొంతసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.",
  owner_location_timeout:
    "స్థాన అభ్యర్థన సమయం ముగిసింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
  owner_location_failed:
    "స్థానాన్ని నమోదు చేయలేకపోయాం. దయచేసి మళ్లీ ప్రయత్నించండి.",

  owner_registration_description:
    "యంత్ర యజమానిగా నమోదు చేసుకుని రైతులకు అందించాలనుకునే యంత్రాన్ని జోడించండి.",
  owner_form_instructions:
    "యజమాని మరియు యంత్ర వివరాలను నమోదు చేయండి. అన్ని ఫీల్డ్‌లు తప్పనిసరి. కీబోర్డ్‌తో కూడా నావిగేట్ చేయవచ్చు.",
  owner_information_title:
    "యజమాని సమాచారం",
  owner_phone_label:
    "ఫోన్ నంబర్",
  owner_detecting_location:
    "స్థానాన్ని గుర్తిస్తోంది…",
  owner_use_current_location:
    "నా ప్రస్తుత స్థానాన్ని ఉపయోగించండి",
  owner_location_detected:
    "స్థానం గుర్తించబడింది",
  owner_no_coordinates:
    "కోఆర్డినేట్లు నమోదు కాలేదు",

  machinery_information_title:
    "యంత్ర సమాచారం",
  owner_select_machinery_type:
    "యంత్రం రకాన్ని ఎంచుకోండి",

  owner_rent_machine:
    "యంత్రం అద్దె",
  owner_farmer_operates:
    "రైతు యంత్రాన్ని నడుపుతారు",
  owner_with_operator:
    "ఆపరేటర్‌తో",
  owner_owner_performs:
    "యజమాని/ఆపరేటర్ పని చేస్తారు",

  owner_available:
    "అందుబాటులో ఉంది",
  owner_currently_unavailable:
    "ప్రస్తుతం అందుబాటులో లేదు",

  owner_register_machinery:
    "యంత్రాన్ని నమోదు చేయండి",
  owner_reset:
    "రీసెట్ చేయండి",

  owner_registration_success_title:
    "నమోదు విజయవంతమైంది",
  owner_registration_success_message:
    "మీ యంత్ర యజమాని ఖాతా మరియు యంత్ర వివరాలు విజయవంతంగా నమోదు చేయబడ్డాయి.",

  owner_summary_owner:
    "యజమాని",
  owner_summary_phone:
    "ఫోన్",
  owner_summary_village:
    "గ్రామం / నగరం",
  owner_summary_location:
    "స్థానం",
  owner_summary_coordinates:
    "కోఆర్డినేట్లు",
  owner_summary_machinery_type:
    "యంత్రం రకం",
  owner_summary_machine_name:
    "యంత్రం పేరు / మోడల్",
  owner_per_hour:
    "గంటకు",

  owner_edit:
    "సవరించండి",
  owner_register_another:
    "మరొక నమోదు చేయండి",

  owner_note_title:
    "గమనిక",
  owner_note:
    "ఇది ఫ్రంట్‌ఎండ్ ప్రోటోటైప్ మాత్రమే. డెమో కోసం నమోదు సమాచారం మీ బ్రౌజర్‌లో స్థానికంగా నిల్వ చేయబడుతుంది.",
    // Farmer Dashboard additional translations
  farmer_role_label: "పాత్ర",
  farmer_role_value: "రైతు",
  farmer_mark_all_read: "అన్నింటినీ చదివినట్లు గుర్తించండి",
  farmer_view_request: "అభ్యర్థనను చూడండి",
  farmer_mark_read: "చదివినట్లు గుర్తించండి",
  farmer_registered_location: "నమోదు చేసిన స్థానం:",
  farmer_current_location: "ప్రస్తుత స్థానం:",
  farmer_location_not_detected: "స్థానం గుర్తించబడలేదు.",
  farmer_nearby_machinery_placeholder: "సమీపంలోని యంత్రాలు",
  farmer_nearby_machinery_title: "సమీపంలోని యంత్రాలు",
  farmer_your_location: "మీ స్థానం:",
  farmer_machinery_type: "యంత్రం రకం",
  farmer_all_types: "అన్ని రకాలు",
  farmer_availability: "లభ్యత",
  farmer_available: "అందుబాటులో ఉంది",
  farmer_all: "అన్నీ",
  farmer_nearby: "దూరం",
  farmer_within_5_km: "5 కి.మీ లోపు",
  farmer_within_10_km: "10 కి.మీ లోపు",
  farmer_within_25_km: "25 కి.మీ లోపు",
  farmer_within_50_km: "50 కి.మీ లోపు",
  farmer_search: "శోధించండి",
  farmer_no_machinery_registered: "ఇంకా యంత్రాలు నమోదు కాలేదు.",
  farmer_no_machinery_found: "మీ శోధనకు సరిపోయే యంత్రాలు కనుగొనబడలేదు.",
  farmer_owner: "యజమాని:",
  farmer_location: "స్థానం:",
  farmer_currently_unavailable: "ప్రస్తుతం అందుబాటులో లేదు",
  farmer_request_machinery_title: "యంత్రాన్ని అభ్యర్థించండి",
  farmer_owner_name: "యజమాని పేరు:",
  farmer_select_machine: "యంత్రాన్ని ఎంచుకోండి",
  farmer_no_machines_owner: "ఈ యజమాని వద్ద అందుబాటులో ఉన్న యంత్రాలు లేవు.",
  farmer_select_service: "సేవను ఎంచుకోండి",
  farmer_hours: "గంటలు",
  farmer_estimated_total_label: "అంచనా మొత్తం:",
  farmer_select_service_estimate: "అంచనా ధర చూడటానికి సేవను ఎంచుకోండి.",
  farmer_send_request: "అభ్యర్థన పంపండి",
  farmer_cancel: "రద్దు చేయండి",
  farmer_owner_machinery_details: "యజమాని & యంత్ర వివరాలు",
  farmer_phone: "ఫోన్:",
  farmer_inventory: "యంత్రాలు:",
  farmer_request_this_machine: "ఈ యంత్రాన్ని అభ్యర్థించండి",
  farmer_unavailable: "అందుబాటులో లేదు",
  farmer_close: "మూసివేయండి",
  farmer_my_bookings: "నా బుకింగ్స్",
  farmer_service: "సేవ:",
  farmer_hours_label: "గంటలు:",
  farmer_requested: "అభ్యర్థించిన సమయం:",
  farmer_machinery_confirmed: "యంత్ర అభ్యర్థన ఆమోదించబడింది",
  farmer_arrival_date_time_not_provided: "రాక తేదీ/సమయం అందించబడలేదు.",
  farmer_job_completed: "పని పూర్తయింది",
  farmer_status: "స్థితి:",
  farmer_my_requests: "నా అభ్యర్థనలు",
  farmer_empty_requests: "ఇంకా అభ్యర్థనలు లేవు.",
  farmer_cancel_request: "అభ్యర్థనను రద్దు చేయండి",

};