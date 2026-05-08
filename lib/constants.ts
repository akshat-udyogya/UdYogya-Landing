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
    headline: "India's Expert Network, In Your Pocket",
    sub:      'Chat with verified experts — free, forever. Pay only when you book a consultation.',
    cta:      'Download on Google Play',
  },
  problem: {
    pains: [
      "Generic Google searches don't solve your specific problem.",
      'Hiring a consultant is expensive and slow.',
      'You never know if the advice is actually from a real expert.',
      'Professional consultations rarely come with proper documentation.',
    ],
    resolution: 'Udyogya fixes all four. And chat is free — always.',
  },
  howItWorks: [
    { step: 1, title: 'Search',  desc: 'Find verified experts by skill, category, or name' },
    { step: 2, title: 'Connect', desc: 'Start a free chat or book a live consultation' },
    { step: 3, title: 'Resolve', desc: 'Get expert advice, receive a GST-compliant invoice, pay only when satisfied' },
  ],
  stats: [
    { value: 500,   suffix: '+',      label: 'Verified Experts' },
    { value: 10000, suffix: '+',      label: 'Consultations Completed' },
    { value: 25,    suffix: '+',      label: 'Professional Categories' },
    { value: 100,   suffix: '% Free', label: 'Expert Chat — Forever' },
  ],
  cta: {
    headline: 'Start Solving Problems Today.',
    sub:      'Free to download. Chat free forever. GST invoices included. Pay only for consultations.',
    fine:     'Available on Android. iOS coming soon.',
  },
}

export const FEATURES = [
  {
    icon:   '💬',
    title:  'Free Expert Chat — Forever',
    body:   'Message any expert directly. No tokens, no subscription, no hidden fees. Free for life.',
    screen: '/assets/screenshots/chat.png',
    color:  '#1A73E8',
  },
  {
    icon:   '🤖',
    title:  'AI-Powered Ustaad Chatbot',
    body:   'Get instant answers from our AI before booking a human expert.',
    screen: '/assets/screenshots/ustaad.png',
    color:  '#7B1FA2',
  },
  {
    icon:   '🎥',
    title:  'Live Video Consultations',
    body:   'Face-to-face advice from verified professionals, on demand.',
    screen: '/assets/screenshots/consultation.png',
    color:  '#0D47A1',
  },
  {
    icon:   '🪪',
    title:  'Verified Expert Profiles',
    body:   'Every expert is reviewed and approved by our team before going live.',
    screen: '/assets/screenshots/expert.png',
    color:  '#00695C',
  },
  {
    icon:   '💰',
    title:  'Secure In-App Wallet',
    body:   'Top up once, pay for consultations instantly. Refunds are automatic.',
    screen: '/assets/screenshots/wallet.png',
    color:  '#E65100',
  },
  {
    icon:   '🧾',
    title:  'GST-Compliant Invoices',
    body:   'Every consultation generates a tax-ready invoice automatically — get reimbursed by your organisation with zero paperwork.',
    screen: '/assets/screenshots/invoice.png',
    color:  '#2E7D32',
  },
]

export const EXPERTS = [
  { name: 'Rajesh Kumar',  role: 'Civil Engineer',   rating: 4.9, consultations: 312, gradient: ['#1A73E8', '#0D47A1'] },
  { name: 'Priya Sharma',  role: 'Tax Consultant',   rating: 4.8, consultations: 245, gradient: ['#FF6B35', '#E64A19'] },
  { name: 'Amir Siddiqui', role: 'Legal Advisor',    rating: 4.9, consultations: 189, gradient: ['#00C853', '#1B5E20'] },
  { name: 'Sunita Verma',  role: 'HR Specialist',    rating: 4.7, consultations: 156, gradient: ['#9C27B0', '#4A148C'] },
]

export const TESTIMONIALS = [
  { quote: "Got my contractor issue resolved in 20 minutes. The expert knew exactly what to do.",     name: 'Deepak M.',  role: 'Small Business Owner', city: 'Delhi' },
  { quote: "The GST invoice was a game-changer — my company reimbursed me the same day.",            name: 'Kavita R.',  role: 'Freelancer',           city: 'Bangalore' },
  { quote: "Free chat is insane. I asked 3 questions before even booking. Best app decision.",        name: 'Rohit P.',   role: 'Startup Founder',      city: 'Mumbai' },
  { quote: "My tax consultant on Udyogya saved me ₹40,000 in penalties I didn't even know about.",  name: 'Ananya S.',  role: 'Accountant',           city: 'Hyderabad' },
  { quote: "Verified experts only. I trust the platform because every profile is reviewed.",          name: 'Farhan K.',  role: 'Engineer',             city: 'Pune' },
  { quote: "Booked a consultation at 11pm. Expert was available. Problem solved by midnight.",        name: 'Meena J.',   role: 'Architect',            city: 'Chennai' },
  { quote: "The video call quality was excellent and the expert was incredibly professional.",         name: 'Sanjay T.',  role: 'Operations Manager',   city: 'Jaipur' },
  { quote: "I chat freely before every booking now. Never felt this confident paying for advice.",    name: 'Ritu A.',    role: 'HR Manager',           city: 'Noida' },
  { quote: "Got a legal document reviewed in one session. The invoice went straight to my CA.",       name: 'Vinod G.',   role: 'Director',             city: 'Ahmedabad' },
  { quote: "Genuinely the most useful professional app on my phone. No exaggeration.",                name: 'Pallavi N.', role: 'Entrepreneur',         city: 'Kolkata' },
  { quote: "Expert found a structural flaw in my building plan. Worth every rupee.",                  name: 'Arun B.',    role: 'Property Developer',   city: 'Lucknow' },
  { quote: "Smooth wallet, instant payment, clear invoice. Nothing complicated.",                     name: 'Shruti D.',  role: 'Consultant',           city: 'Indore' },
]

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.udyogya.app'
