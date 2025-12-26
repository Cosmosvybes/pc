export interface BonusScript {
    category: string;
    scenario: string;
    age: '2-3' | '4-6' | 'All';
    say: string;
    action: string;
}

export const BONUS_SCRIPTS: BonusScript[] = [
    // --- DEFIANCE & LYING ---
    {
        category: "Defiance & Lying",
        scenario: "Refusing to put on shoes",
        age: "2-3",
        say: "Shoes on feet. Then we go outside.",
        action: "Hold shoes. Wait silently."
    },
    {
        category: "Defiance & Lying",
        scenario: "Refusing to put on shoes",
        age: "4-6",
        say: "Do you want to put on the left shoe or the right shoe first?",
        action: "Offer limited choice. Do not nag."
    },
    {
        category: "Defiance & Lying",
        scenario: "Saying 'NO!' to everything",
        age: "2-3",
        say: "You are saying no. You want to be the boss.",
        action: "Acknowledge the wish. Set the limit."
    },
    {
        category: "Defiance & Lying",
        scenario: "Lying about breaking something",
        age: "4-6",
        say: "You were worried you'd get in trouble. We can fix this together.",
        action: "Focus on solution, not the lie."
    },
    {
        category: "Defiance & Lying",
        scenario: "Running away when called",
        age: "2-3",
        say: "Stop. Walking feet.",
        action: "Physically stop them gently but firmly."
    },
     {
        category: "Defiance & Lying",
        scenario: "Screaming 'I hate you'",
        age: "4-6",
        say: "You are really mad at me right now. I'm okay with that.",
        action: "Stay calm. Do not take it personally."
    },

    // --- HITTING & BITING ---
    {
        category: "Aggression",
        scenario: "Hitting parent",
        age: "All",
        say: "I will not let you hit me. Hitting hurts.",
        action: "Catch the hand. Block the hit."
    },
    {
        category: "Aggression",
        scenario: "Biting a friend",
        age: "2-3",
        say: "Ouch. Teeth are for food.",
        action: "Separate immediately. Check on the victim."
    },
    {
        category: "Aggression",
        scenario: "Throwing toys in anger",
        age: "All",
        say: "Toys are for playing, not throwing.",
        action: "Remove the toy for 5 minutes."
    },
    {
        category: "Aggression",
        scenario: "Kicking the car seat",
        age: "4-6",
        say: "Your legs feel wiggly. Push your feet against my hands.",
        action: "Provide resistance (heavy work) safely."
    },
    {
        category: "Aggression",
        scenario: "Pulling the cat's tail",
        age: "2-3",
        say: "Gentle hands. Like this.",
        action: "Model stroking. Move cat away."
    },

    // --- SIBLING RIVALRY ---
    {
        category: "Sibling Rivalry",
        scenario: "Snatching a toy",
        age: "2-3",
        say: "You wanted that toy. Brother is using it.",
        action: "Validate the want. Return the toy."
    },
    {
        category: "Sibling Rivalry",
        scenario: "Fighting over who goes first",
        age: "4-6",
        say: "You both want to be first. That is tricky.",
        action: "Pause. Let them problem solve (or flip a coin)."
    },
    {
        category: "Sibling Rivalry",
        scenario: "Roughhousing got too rough",
        age: "All",
        say: "The fun stopped. Someone is crying. Break time.",
        action: "Separate without blaming."
    },
    {
        category: "Sibling Rivalry",
        scenario: "Older sibling teasing younger",
        age: "4-6",
        say: "His face looks sad. He doesn't like that game.",
        action: "Point out cues. Do not lecture."
    },
    {
        category: "Sibling Rivalry",
        scenario: "Baby destroyed a build",
        age: "4-6",
        say: "You worked hard on that! You are furious!",
        action: "Validate the anger. Help rebuild or move to safety."
    },

    // --- EATING & SLEEP ---
    {
        category: "Daily Battles",
        scenario: "Refusing dinner",
        age: "All",
        say: "You don't have to eat. You do have to sit with us.",
        action: "Remove pressure. Enjoy your own meal."
    },
    {
        category: "Daily Battles",
        scenario: "Throwing food",
        age: "2-3",
        say: "Food stays on the tray.",
        action: "End the meal if it continues."
    },
    {
        category: "Daily Battles",
        scenario: "Getting out of bed",
        age: "2-3",
        say: "It is sleep time.",
        action: "Walk them back silently. Repeat 100x."
    },
    {
        category: "Daily Battles",
        scenario: "Stalling at bedtime",
        age: "4-6",
        say: "One last hug. Then lights out.",
        action: "Be boring. Be consistent."
    },
    {
        category: "Daily Battles",
        scenario: "Waking up too early",
        age: "4-6",
        say: "The sun is not up. Back to bed.",
        action: "Use an 'Okay to Wake' clock."
    },

    // --- TRANSITIONS ---
    {
        category: "Transitions",
        scenario: "Leaving the park",
        age: "2-3",
        say: "Bye-bye slide. Bye-bye swings.",
        action: "Wave goodbye to objects. Carry to car."
    },
    {
        category: "Transitions",
        scenario: "Turning off TV",
        age: "4-6",
        say: "I'm turning the TV off in 3... 2... 1...",
        action: "Turn it off. Expect the meltdown. Validate it."
    },
    {
        category: "Transitions",
        scenario: "Getting out of the bath",
        age: "2-3",
        say: "Pull the plug! Watch the water go!",
        action: "Make the transition a game."
    },
    {
        category: "Transitions",
        scenario: "Getting into the car seat",
        age: "2-3",
        say: "Do you want to climb in like a monkey or fly like a bird?",
        action: "Add playfulness to the task."
    },
    {
        category: "Transitions",
        scenario: "Leaving a friend's house",
        age: "4-6",
        say: "It's hard to stop playing. We will see them again.",
        action: " validate the sadness."
    }
];
