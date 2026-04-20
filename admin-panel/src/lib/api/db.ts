// In-memory mock database
// Changes here are reset when the Next.js development server restarts.

export type Announcement = { id: string; title: string; type: string; status: string; startDate: string; endDate: string; content?: string };
export type Sermon = { id: string; title: string; date: string; isFeatured: boolean; link: string; description?: string };
export type Event = { id: string; title: string; date: string; time: string; location: string; description: string; image: string };
export type Ministry = { id: string; name: string; description: string; meeting: string; contact: string; phone: string };
export type MessageItem = { id: string; type: "contact" | "prayer"; sender: string; email: string; subject: string; message: string; date: string; resolved?: boolean; confidential?: boolean; prayed?: boolean };

export const db = {
  announcements: [
    { id: "1", title: "Sunday Service Time Change", type: "Ticker", status: "Active", startDate: "2024-03-20", endDate: "2024-03-27" },
    { id: "2", title: "Youth Camp Registration Open", type: "Daily", status: "Active", startDate: "2024-03-15", endDate: "2024-04-10" },
    { id: "3", title: "Church Clean-up Day", type: "Daily", status: "Expired", startDate: "2024-03-10", endDate: "2024-03-14" },
  ] as Announcement[],
  
  sermons: [
    { id: "1", title: "Walking in Faith", date: "2024-03-17", isFeatured: true, link: "https://youtu.be/..." },
    { id: "2", title: "The Power of Prayer", date: "2024-03-10", isFeatured: false, link: "https://youtu.be/..." },
    { id: "3", title: "Grace Abounding", date: "2024-03-03", isFeatured: false, link: "https://youtu.be/..." },
  ] as Sermon[],

  livestream: {
    active: false,
    link: "https://youtube.com/watch?v=abcdefg"
  },

  events: [
    { id: "1", title: "Youth Summer Camp 2024", date: "2024-06-15", time: "09:00 AM", location: "Camp Grounds", description: "Annual youth summer camp. A time of worship, games, and fellowship.", image: "https://images.unsplash.com/photo-1544427920-c49ccf08c146?w=800&q=80" },
    { id: "2", title: "Women's Ministry Breakfast", date: "2024-04-10", time: "08:30 AM", location: "Main Hall", description: "Join us for breakfast and a guest speaker.", image: "" },
    { id: "3", title: "Good Friday Service", date: "2024-03-29", time: "07:00 PM", location: "Main Sanctuary", description: "Special service to remember the crucifixion.", image: "" },
  ] as Event[],

  ministries: [
    { id: "1", name: "Youth Impact", description: "Empowering the next generation through word and fellowship.", meeting: "Fridays, 7:00 PM @ Youth Hall", contact: "Pastor Mark", phone: "555-0101" },
    { id: "2", name: "Women's Fellowship", description: "A community of women growing together in Christ.", meeting: "2nd Saturday, 9:00 AM", contact: "Sarah Jenkins", phone: "555-0102" },
    { id: "3", name: "Worship Team", description: "Leading the congregation in praise and worship.", meeting: "Thursdays, 6:30 PM", contact: "David Miller", phone: "555-0103" },
  ] as Ministry[],

  messages: [
    { id: "1", type: "contact", sender: "Michael Brown", email: "michael@example.com", subject: "Small Group Question", message: "Hi, I'm new and looking to join a small group in the downtown area. Are there any spots open?", date: "2024-03-21", resolved: false },
    { id: "2", type: "prayer", sender: "Anonymous", email: "", subject: "Family Health", message: "Please pray for my mother's upcoming surgery on Friday.", date: "2024-03-20", confidential: true, prayed: false },
    { id: "3", type: "contact", sender: "Sarah Jenkins", email: "sarahj@example.com", subject: "Baby Dedication", message: "What is the process for baby dedications?", date: "2024-03-18", resolved: true },
    { id: "4", type: "prayer", sender: "David Smith", email: "david@example.com", subject: "Job Interview", message: "I have a big interview next week, leaning on God's provision.", date: "2024-03-19", confidential: false, prayed: true },
  ] as MessageItem[],

  settings: {
    heroVideo: true,
    upcomingEvents: true,
    ministries: true,
    giveBanner: true,
    featuredSermons: true,
    maintenanceMode: false,
    registrationOpen: true,
  }
};
