// Mock data for SNOWY MC Minecraft Store

export const serverInfo = {
  name: "SNOWY MC",
  ip: "play.snowymc.in",
  discordUrl: "https://discord.gg/snowymc"
};

export const features = [
  {
    id: 1,
    icon: "Zap",
    title: "Lag-Free Performance",
    description: "High-performance servers with 99.9% uptime",
    color: "#22c55e" // green
  },
  {
    id: 2,
    icon: "Users",
    title: "Friendly Community",
    description: "Join thousands of active players worldwide",
    color: "#8B5CF6" // purple
  },
  {
    id: 3,
    icon: "LayoutGrid",
    title: "Custom Plugins",
    description: "Unique gameplay features and mechanics",
    color: "#F59E0B" // orange/yellow
  },
  {
    id: 4,
    icon: "TrendingUp",
    title: "Regular Updates",
    description: "New content and events every week",
    color: "#06B6D4" // cyan
  },
  {
    id: 5,
    icon: "Heart",
    title: "Active Staff",
    description: "24/7 support and moderation",
    color: "#EC4899" // pink
  }
];

export const ranks = [
  {
    id: 1,
    name: "Prime",
    price: 49,
    currency: "INR",
    color: "#22c55e", // green
    features: [
      "Access to /sit",
      "Access to /lay",
      "Access to /enderchest",
      "Access to /anvil",
      "Access to /hat",
      "Create up to 4x set homes",
      "Create up to 3 Auction listing",
      "Access to 4 Vaults",
      "Access to 6 Orders",
      "Death ban of 12 hours"
    ]
  },
  {
    id: 2,
    name: "Elite",
    price: 129,
    currency: "INR",
    color: "#F59E0B", // orange/yellow
    features: [
      "Access to /sit",
      "Access to /lay",
      "Access to /enderchest",
      "Access to /enderquiver",
      "Access to /anvil",
      "Access to /hat",
      "Create up to 6x set homes",
      "Create up to 5 Auction listing",
      "Access to 8 Vaults",
      "Access to 10 Orders",
      "Death ban of 6 hours"
    ]
  },
  {
    id: 3,
    name: "Ace",
    price: 250,
    currency: "INR",
    color: "#8B5CF6", // purple
    features: [
      "Access to /sit",
      "Access to /lay",
      "Access to /enderchest",
      "Access to /endercutter",
      "Access to /anvil",
      "Access to /workbench",
      "Access to /hat",
      "Create up to 8x set homes",
      "Create up to 8 Auction listing",
      "Access to 12 Vaults",
      "Access to 14 Orders",
      "Death ban of 3 hours"
    ]
  }
];

export const donationHistory = [
  { id: 1, username: "SteveBuilder", rank: "Prime", amount: 49, date: "2025-01-15" },
  { id: 2, username: "CreeperSlayer", rank: "Elite", amount: 129, date: "2025-01-14" },
  { id: 3, username: "DiamondKing", rank: "Ace", amount: 250, date: "2025-01-13" },
  { id: 4, username: "EnderDragon99", rank: "Prime", amount: 49, date: "2025-01-12" },
  { id: 5, username: "NetherWalker", rank: "Elite", amount: 129, date: "2025-01-11" },
  { id: 6, username: "RedstoneGuru", rank: "Ace", amount: 250, date: "2025-01-10" },
  { id: 7, username: "PixelWarrior", rank: "Prime", amount: 49, date: "2025-01-09" },
  { id: 8, username: "BlockMaster", rank: "Elite", amount: 129, date: "2025-01-08" }
];
