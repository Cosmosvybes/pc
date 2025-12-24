
export interface Quote {
    text: string;
    author: string;
}

export const WISDOM: Quote[] = [
    { text: "The way we talk to our children becomes their inner voice.", author: "Peggy O'Mara" },
    { text: "Children are not a distraction from more important work. They are the most important work.", author: "C.S. Lewis" },
    { text: "Connection before correction.", author: "Positive Parenting" },
    { text: "Don't just teach your children to read. Teach them to question what they read.", author: "George Carlin" },
    { text: "It is easier to build strong children than to repair broken men.", author: "Frederick Douglass" },
    { text: "Listen earnestly to anything your children want to tell you, no matter what. If you don't listen eagerly to the little stuff when they are little, they won't tell you the big stuff when they are big, because to them all of it has always been big.", author: "Catherine M. Wallace" },
    { text: "To be in your children's memories tomorrow, you have to be in their lives today.", author: "Barbara Johnson" },
    { text: "Your children need your presence more than your presents.", author: "Jesse Jackson" },
    { text: "Behind every young child who believes in himself is a parent who believed first.", author: "Matthew Jacobson" },
    { text: "The best way to keep children at home is to make the home atmosphere pleasant, and let the air out of the tires.", author: "Dorothy Parker" }, // Maybe too funny? Keep for variety.
    { text: "Every day, in a 100 small ways, our children ask, 'Do you hear me? Do you see me? Do I matter?' Their behavior often reflects our response.", author: "L.R. Knost" },
    { text: "Play is the work of the child.", author: "Maria Montessori" },
    { text: "A child seldom needs a good talking to as he needs a good listening to.", author: "Robert Brault" },
    { text: "Kids don't remember what you try to teach them. They remember what you are.", author: "Jim Henson" },
    { text: "Encourage and support your kids because children are apt to live up to what you believe of them.", author: "Lady Bird Johnson" },
    { text: "It is not what you do for your children, but what you have taught them to do for themselves, that will make them successful human beings.", author: "Ann Landers" },
    { text: "Before I got married I had six theories about bringing up children; now I have six children and no theories.", author: "John Wilmot" },
    { text: "You cannot teach a man anything; you can only help him find it within himself.", author: "Galileo" }, // Applicable to kids
    { text: "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.", author: "Joyce Meyer" },
    { text: "The greatest gift you can give your child is your own emotional healing.", author: "Dr. Shefali Tsabary" }
];

export function getDailyWisdom(): Quote {
    // Determine the day of the year (0-365)
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Use the day of year to pick a quote
    // This ensures everyone sees the same quote on the same day, 
    // and it only changes tomorrow.
    const index = dayOfYear % WISDOM.length;
    return WISDOM[index];
}
