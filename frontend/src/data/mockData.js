// SafePath AI - Realistic Mock Data

export const mockDriverInfo = {
  name: "Ali Haider",
  email: "ali.haider@example.com",
  phone: "+92 321 1234567",
  location: "Karachi, Pakistan",
  memberSince: "May 2024",
  totalPoints: 2840,
  level: 7,
  levelName: "Road Guardian",
  nextLevelPoints: 4000,
  vehicle: {
    name: "Honda CG 125",
    registration: "KHI-1234",
    type: "Motorcycle",
    year: "2021",
    color: "Black",
    addedOn: "12 May 2024",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&auto=format&fit=crop&q=60" // Standard motorcycle placeholder
  }
};

export const mockStats = {
  roadsMonitored: 1248,
  activeCommunity: 986,
  hazardsDetected: 245,
  alertsDelivered: 12842,
  reportsVerified: 932,
  falseDetections: 128,
  todayDistance: 36.4,
  todayDistanceGoal: 60.0,
  driveTime: "1h 28m",
  totalTripsToday: 2,
  averageSpeed: 42,
  harshBrakingTimes: 8,
  highRiskAlerts: 5,
  co2Saved: 12.4,
  communityHelped: 89,
  safeDrivingScore: 92
};

export const mockHazards = [
  {
    id: "HZ-2024-05-18-1023",
    type: "Pothole",
    severity: "Critical",
    location: "Shahrah-e-Faisal, Near Teen Hatti, Karachi",
    lat: 24.8607,
    lng: 67.0099,
    reportedBy: "Ali Haider",
    reportedOn: "18 May 2024, 09:42 AM",
    confidence: 92,
    verifiedCount: 12,
    modelName: "PotholeNet v2.1",
    dateDetected: "18 May 2024, 09:41 AM",
    description: "Large pothole covering major part of the left lane. Water accumulated inside. Risk of vehicle damage and accidents.",
    status: "Unverified",
    photos: [
      "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1621259182978-f09e5e2ae091?w=600&auto=format&fit=crop&q=80"
    ],
    comments: [
      { user: "Usman Khan", role: "Driver", text: "Still there. Got a flat tire because of this.", time: "18 May 2024, 11:02 AM", verified: true },
      { user: "Ayesha Malik", role: "Driver", text: "Very dangerous for motorcyclists in the evening.", time: "18 May 2024, 02:15 PM", verified: false }
    ]
  },
  {
    id: "HZ-2025-4820",
    type: "Road Crack",
    severity: "High",
    location: "Ferozepur Road, Lahore",
    lat: 31.4621,
    lng: 74.2456,
    reportedBy: "Sana Khan",
    reportedOn: "May 21, 2025, 09:52 AM",
    confidence: 88,
    verifiedCount: 7,
    modelName: "CrackNet v1.8",
    dateDetected: "May 21, 2025, 09:50 AM",
    description: "Multiple longitudinal cracks detected along the center strip.",
    status: "Pending",
    photos: ["https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=600&auto=format&fit=crop&q=80"]
  },
  {
    id: "HZ-2025-4819",
    type: "Open Manhole",
    severity: "High",
    location: "Model Town, Lahore",
    lat: 31.4732,
    lng: 74.2660,
    reportedBy: "Hassan Ali",
    reportedOn: "May 21, 2025, 08:11 AM",
    confidence: 91,
    verifiedCount: 15,
    modelName: "ManholeNet v1.5",
    dateDetected: "May 21, 2025, 08:10 AM",
    description: "An open manhole without warning signs, posing extreme danger.",
    status: "Verified",
    photos: ["https://images.unsplash.com/photo-1508873696983-2df519f0397e?w=600&auto=format&fit=crop&q=80"]
  },
  {
    id: "HZ-2025-4818",
    type: "Flooded Road",
    severity: "Medium",
    location: "DHA Phase 5, Lahore",
    lat: 31.5210,
    lng: 74.3920,
    reportedBy: "Bilal Ahmed",
    reportedOn: "May 20, 2025, 07:45 PM",
    confidence: 85.7,
    verifiedCount: 22,
    modelName: "FloodNet v2.0",
    dateDetected: "May 20, 2025, 07:40 PM",
    description: "Waterlogging reported on DHA main boulevard following rainfall.",
    status: "Verified",
    photos: ["https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format&fit=crop&q=80"]
  },
  {
    id: "HZ-2025-4817",
    type: "Construction Area",
    severity: "Low",
    location: "Johar Town, Lahore",
    lat: 31.4421,
    lng: 74.2711,
    reportedBy: "Fatima Noor",
    reportedOn: "May 20, 2025, 06:30 PM",
    confidence: 78.4,
    verifiedCount: 8,
    modelName: "ConNet v1.3",
    dateDetected: "May 20, 2025, 06:25 PM",
    description: "Sewer installation work blocks the side lane.",
    status: "Pending",
    photos: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80"]
  },
  {
    id: "HZ-2025-4816",
    type: "Speed Breaker",
    severity: "Medium",
    location: "Lahore Cantt",
    lat: 31.5267,
    lng: 74.2334,
    reportedBy: "Usman Tariq",
    reportedOn: "May 20, 2025, 05:12 PM",
    confidence: 82.9,
    verifiedCount: 30,
    modelName: "PotholeNet v2.1",
    dateDetected: "May 20, 2025, 05:10 PM",
    description: "Unmarked high speed breaker near Cantt Entrance.",
    status: "Verified",
    photos: ["https://images.unsplash.com/photo-1617634173752-d60232c25345?w=600&auto=format&fit=crop&q=80"]
  },
  {
    id: "HZ-2025-4815",
    type: "Uneven Road",
    severity: "High",
    location: "Wapda Town, Lahore",
    lat: 31.4714,
    lng: 74.3093,
    reportedBy: "Ahmed Nawaz",
    reportedOn: "May 20, 2025, 03:55 PM",
    confidence: 90.2,
    verifiedCount: 5,
    modelName: "PotholeNet v2.1",
    dateDetected: "May 20, 2025, 03:50 PM",
    description: "Highly uneven gravel surface causing heavy vibration.",
    status: "Unverified",
    photos: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80"]
  }
];

export const mockNotifications = [
  {
    id: "notif-1",
    type: "Road Alert",
    severity: "High",
    title: "Pothole Detected Ahead",
    description: "Large pothole detected on Shahrah-e-Faisal near Nipa Chowrangi. Drive with caution.",
    location: "Shahrah-e-Faisal, Karachi",
    time: "10:45 AM",
    date: "Today",
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "notif-2",
    type: "Municipality Notice",
    severity: "New",
    title: "Street Cleaning Schedule",
    description: "Clifton Block 5 & 6 street cleaning on 26 May 2024 from 6:00 AM to 10:00 AM.",
    location: "Clifton Block 5 & 6, Karachi",
    time: "6:30 PM",
    date: "Yesterday",
    image: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "notif-3",
    type: "Construction Alert",
    severity: "Medium Risk",
    title: "Road Construction Ahead",
    description: "Ongoing construction on University Road near PAF Museum. Expect delays.",
    location: "University Road, Karachi",
    time: "11:20 AM",
    date: "Yesterday",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "notif-4",
    type: "Flood Warning",
    severity: "Severe",
    title: "Heavy Rain & Flood Warning",
    description: "Heavy rainfall expected in Karachi. Avoid low-lying areas and river banks.",
    location: "Karachi City Wide",
    time: "08:15 PM",
    date: "23 May 2024",
    image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=200&auto=format&fit=crop&q=80"
  }
];

export const mockUsers = [
  { id: "usr-1", name: "Usman Khan", handle: "@usman.khan", role: "Driver", contact: "+92 312 3456789", status: "Active", joined: "May 21, 2025" },
  { id: "usr-2", name: "Ayesha Malik", handle: "@ayesha.malik", role: "Municipal Staff", contact: "+92 333 1234567", status: "Active", joined: "May 20, 2025" },
  { id: "usr-3", name: "Bilal Ahmed", handle: "@bilal.ahmed", role: "Administrator", contact: "+92 311 9876543", status: "Active", joined: "May 19, 2025" },
  { id: "usr-4", name: "Hamza Saleem", handle: "@hamza.saleem", role: "Driver", contact: "+92 314 5556677", status: "Inactive", joined: "May 18, 2025" },
  { id: "usr-5", name: "Sana Fatima", handle: "@sana.fatima", role: "Municipal Staff", contact: "+92 335 7766554", status: "Active", joined: "May 17, 2025" },
  { id: "usr-6", name: "Ali Raza", handle: "@ali.raza", role: "Driver", contact: "+92 312 8884433", status: "Active", joined: "May 16, 2025" },
  { id: "usr-7", name: "Muhammad Zain", handle: "@zain.munir", role: "Municipal Staff", contact: "+92 336 9988776", status: "Inactive", joined: "May 15, 2025" }
];

export const mockMaintenanceJobs = [
  { id: "m-1", type: "Pothole", location: "Main Boulevard, Gulberg", severity: "High", team: "Team Alpha", date: "May 25, 2025", status: "Pending Repair", photo: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=200&auto=format&fit=crop&q=80" },
  { id: "m-2", type: "Road Crack", location: "Ferozepur Road", severity: "Medium", team: "Team Bravo", date: "May 27, 2025", status: "Assigned", photo: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=200&auto=format&fit=crop&q=80" },
  { id: "m-3", type: "Open Manhole", location: "Model Town", severity: "High", team: "Team Charlie", date: "May 24, 2025", status: "In Progress", photo: "https://images.unsplash.com/photo-1508873696983-2df519f0397e?w=200&auto=format&fit=crop&q=80" },
  { id: "m-4", type: "Flooded Road", location: "DHA Phase 5", severity: "Medium", team: "Team Delta", date: "May 26, 2025", status: "In Progress", photo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&auto=format&fit=crop&q=80" },
  { id: "m-5", type: "Construction Area", location: "Johar Town", severity: "Low", team: "Team Echo", date: "May 30, 2025", status: "Assigned", photo: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop&q=80" },
  { id: "m-6", type: "Speed Breaker", location: "Lahore Cantt", severity: "Low", team: "Team Alpha", date: "May 18, 2025", status: "Completed", photo: "https://images.unsplash.com/photo-1617634173752-d60232c25345?w=200&auto=format&fit=crop&q=80" }
];
