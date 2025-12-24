export type AgeGroup = 'toddler' | 'preschool' | 'school';
export type Situation = 'tantrum' | 'boredom' | 'hyperactive' | 'bedtime';

export interface Prescription {
  say: string;
  do: string;
  avoid: string;
}

export const PRESCRIPTIONS: Record<AgeGroup, Record<Situation, Prescription>> = {
  toddler: {
    tantrum: {
      say: "I see you are big mad. I am right here.",
      do: "Sit on the floor with your back to the wall. Open your arms but say nothing. Wait.",
      avoid: "Asking 'What's wrong?' or trying to negotiate."
    },
    boredom: {
      say: "You have your toys. You will find something.",
      do: "Put 3 specific toys in the middle of the room. Walk away.",
      avoid: "Turning on the TV immediately."
    },
    hyperactive: {
      say: "We need to shake the wiggles out!",
      do: "Heavy work: Have them push the laundry basket across the room.",
      avoid: "Saying 'Calm down' repeatedly."
    },
    bedtime: {
      say: "The sun is sleeping, and so are we.",
      do: "Lie on the floor next to their bed. Deep frantic breathing -> Slow breathing.",
      avoid: "Interactive play or extra stories."
    }
  },
  preschool: {
    tantrum: {
      say: "It's okay to be frustrated. It's not okay to hit.",
      do: "Create a 'Calm Corner' with pillows. Ask them to go there until they are ready.",
      avoid: "Giving in to the demand to stop the noise."
    },
    boredom: {
      say: "I am boring. My job is to be boring.",
      do: "Give them a cardboard box and crayons.",
      avoid: "Becoming their entertainment director."
    },
    hyperactive: {
      say: "Your engine is running too fast.",
      do: "Animal walks: Crab walk or Bear crawl from wall to wall.",
      avoid: "Yelling to overpower their noise."
    },
    bedtime: {
      say: "Body is still. Mouth is quiet.",
      do: "Back tracing: Draw letters on their back and have them guess.",
      avoid: "engaging in 'one more thing' debates."
    }
  },
  school: {
    tantrum: {
      say: "I love you too much to argue with you right now.",
      do: "Walk away. Go to the kitchen and drink a glass of water slowly.",
      avoid: "Lecturing or teaching a lesson in the heat of the moment."
    },
    boredom: {
      say: "Boredom is where ideas come from.",
      do: "Standard challenge: 'Build a tower taller than this chair.'",
      avoid: "Offering immediate screen time."
    },
    hyperactive: {
      say: "Let's use that energy.",
      do: "Wall push-ups or timed jumping jacks (See how many in 1 min).",
      avoid: "Shaming them for having energy."
    },
    bedtime: {
      say: "The kitchen is closed. The day is done.",
      do: "Gratitude: Name 3 good things that happened today.",
      avoid: "Lecturing about tomorrow's schedule."
    }
  }
};
