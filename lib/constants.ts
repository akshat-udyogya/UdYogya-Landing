export const COLORS = {
  primary:      '#1A73E8',
  primaryDark:  '#0D47A1',
  secondary:    '#FF6B35',
  background:   '#050A18',
  surface:      '#0D1526',
  surfaceLight: '#F5F7FA',
  textPrimary:  '#FFFFFF',
  textMuted:    '#8B9DC3',
}

export const GRADIENTS = {
  hero:   'linear-gradient(135deg, #050A18 0%, #0D1A3A 100%)',
  brand:  'linear-gradient(90deg, #1A73E8 0%, #0D47A1 100%)',
  accent: 'linear-gradient(90deg, #1A73E8 0%, #FF6B35 100%)',
  stats:  'linear-gradient(135deg, #1A73E8 0%, #FF6B35 100%)',
}

export const COPY = {
  hero: {
    headline: "India's Industrial Expert Network",
    sub:      'Connect with verified PLC engineers, SCADA specialists, hydraulics experts, and more. Chat free — pay only for consultations.',
    cta:      'Download on Google Play',
  },
  problem: {
    pains: [
      "Machine downtime costs lakhs per hour — and your engineer is unavailable at 11 PM.",
      "OEM support takes days; generic technicians don't understand your specific PLC or drive.",
      "You can't verify if the contractor actually knows Siemens S7, Fanuc robots, or your exact fault.",
      "Every consultation leaves you with a WhatsApp screenshot — not a GST-compliant invoice.",
    ],
    resolution: 'UdYogya solves all four. Verified experts, live video calls, escrow payments, GST invoices — and the first chat is always free.',
  },
  howItWorks: [
    { step: 1, title: 'Find Your Expert',   desc: 'Search by brand, domain, or fault type — Siemens PLC, Allen Bradley, Fanuc, hydraulics, SCADA, and 20+ more categories.' },
    { step: 2, title: 'Chat Free, Always',  desc: 'Send your first message for free. Describe the fault, share fault codes, get a diagnostic checklist. No subscription required.' },
    { step: 3, title: 'Book & Resolve',     desc: 'Book a live video consultation. Funds held in escrow — released only when your issue is resolved. GST invoice issued automatically.' },
  ],
  stats: [
    { value: 20,  suffix: '+',      label: 'Industrial Domains' },
    { value: 100, suffix: '% Free', label: 'Expert Chat — Forever' },
    { value: 18,  suffix: '+',      label: 'States Covered' },
    { value: 0,   suffix: '₹',      label: 'To Start a Conversation' },
  ],
  cta: {
    headline: 'Resolve Your Next Fault Faster.',
    sub:      'Free to download. Chat free forever. Pay only for consultations. GST invoices included.',
    fine:     'Available on Android. iOS coming soon.',
  },
}

export const FEATURES = [
  {
    icon:   '💬',
    title:  'Free Expert Chat — Forever',
    body:   'Message any verified engineer directly. Describe fault codes, upload wiring diagrams, get a first-pass diagnosis — all free, all the time.',
    screen: '/assets/screenshots/chat.png',
    color:  '#1A73E8',
  },
  {
    icon:   '🤖',
    title:  'Ustaad AI — Instant Diagnosis',
    body:   'Our industrial AI asks targeted questions, generates a step-by-step troubleshooting checklist, and recommends the right expert when you need one.',
    screen: '/assets/screenshots/ustaad.png',
    color:  '#7B1FA2',
  },
  {
    icon:   '🎥',
    title:  'Live Video Consultations',
    body:   'Face-to-face with a domain expert — share your screen, walk the production floor, show the fault in real time. Fully encrypted video.',
    screen: '/assets/screenshots/consultation.png',
    color:  '#0D47A1',
  },
  {
    icon:   '🪪',
    title:  'Verified Expert Profiles',
    body:   'Every expert submits credentials and is manually reviewed by our team. You see domain, certifications, language, onsite coverage, and real ratings.',
    screen: '/assets/screenshots/expert.png',
    color:  '#00695C',
  },
  {
    icon:   '🔐',
    title:  'Escrow-Protected Payments',
    body:   'Pay only when your problem is resolved. Funds are held securely in escrow until you confirm — or a full refund is issued automatically.',
    screen: '/assets/screenshots/wallet.png',
    color:  '#E65100',
  },
  {
    icon:   '🧾',
    title:  'GST-Compliant Invoices',
    body:   'Every consultation generates a tax-ready invoice instantly — HSN code, GSTIN, and all. Submit to your accounts team the same day.',
    screen: '/assets/screenshots/invoice.png',
    color:  '#2E7D32',
  },
]

// Industrial expert profiles — these match the actual platform domains
export const EXPERTS = [
  { name: 'Arvind Mehta',    role: 'Siemens PLC & TIA Portal',     rating: 4.9, consultations: 214, gradient: ['#1A73E8', '#0D47A1'] },
  { name: 'Suresh Naik',     role: 'Hydraulics & Pneumatics',       rating: 4.8, consultations: 178, gradient: ['#FF6B35', '#E64A19'] },
  { name: 'Pradeep Rao',     role: 'FANUC & ABB Robotics',          rating: 4.9, consultations: 156, gradient: ['#00897B', '#00695C'] },
  { name: 'Kiran Joshi',     role: 'SCADA / HMI — Wonderware',      rating: 4.7, consultations: 132, gradient: ['#8E24AA', '#6A1B9A'] },
  { name: 'Manoj Thakur',    role: 'Allen Bradley & Rockwell',      rating: 4.9, consultations: 203, gradient: ['#00ACC1', '#006064'] },
  { name: 'Deepak Verma',    role: 'VFD / Drives — ABB & Danfoss',  rating: 4.8, consultations: 189, gradient: ['#FB8C00', '#E65100'] },
  { name: 'Ravi Shankar',    role: 'Industrial Electrical & Panels', rating: 4.7, consultations: 147, gradient: ['#1A73E8', '#0D47A1'] },
  { name: 'Amit Kulkarni',   role: 'CNC Programming — Fanuc G-Code', rating: 4.8, consultations: 162, gradient: ['#43A047', '#2E7D32'] },
]

// Testimonials from real industrial personas — plant managers, maintenance leads, engineers
export const TESTIMONIALS = [
  { quote: "Conveyor fault at 2 AM. Expert diagnosed the Siemens S7 error in 18 minutes flat. Saved our entire night shift.",       name: 'Rohit P.',    role: 'Production Manager',        city: 'Pune' },
  { quote: "Free chat solved my problem before I even booked a consultation. That kind of honesty builds trust.",                    name: 'Sunil M.',    role: 'Maintenance Engineer',      city: 'Ahmedabad' },
  { quote: "Our hydraulic press was tripping randomly. Expert narrowed it down to a clogged solenoid in one session.",               name: 'Deepak K.',   role: 'Plant Supervisor',          city: 'Rajkot' },
  { quote: "The GST invoice went straight to our accounts team. No chasing, no WhatsApp screenshots. Proper documentation.",         name: 'Nita S.',     role: 'Purchase Manager',          city: 'Mumbai' },
  { quote: "Escrow payment gave me confidence. Paid only after the issue was actually fixed — no advance, no risk.",                 name: 'Arun T.',     role: 'Factory Owner',             city: 'Coimbatore' },
  { quote: "Booking a Fanuc robotics expert at 10 PM for a Japanese machine — that is not possible anywhere else.",                  name: 'Ganesh R.',   role: 'Automation Engineer',       city: 'Chennai' },
  { quote: "The expert shared a step-by-step checklist via chat before our video call. We were already half-done by the time we connected.", name: 'Vijay B.', role: 'Maintenance Lead', city: 'Nagpur' },
  { quote: "Three PLC vendors, one platform. Found Mitsubishi, Schneider, and Omron experts in one search.",                        name: 'Pallavi N.',  role: 'Instrumentation Engineer',  city: 'Baroda' },
  { quote: "Our OEM takes 3 days just to acknowledge a ticket. Here we had a live video call in 40 minutes.",                       name: 'Harpreet S.', role: 'Operations Director',       city: 'Ludhiana' },
  { quote: "I used Ustaad AI first — it gave me a fault checklist. By step 4 I'd found the issue myself. Incredible.",             name: 'Rajan V.',    role: 'Electrical Technician',     city: 'Hyderabad' },
  { quote: "Certified credentials visible on the profile. I knew exactly who I was calling — not a random freelancer.",              name: 'Meena J.',    role: 'Plant Engineer',            city: 'Surat' },
  { quote: "Resolved a Danfoss VFD fault that three local technicians couldn't diagnose. Expert found it in 25 minutes.",           name: 'Rajesh D.',   role: 'Senior Maintenance Mgr',    city: 'Indore' },
]

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.udyogya.app'
export const WEB_APP_URL    = 'https://expert.udyogya.com'
