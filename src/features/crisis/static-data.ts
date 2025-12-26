export type SituationType = 'meltdown' | 'energy' | 'overstimulated' | 'bedtime';
export type LocationType = 'home' | 'public';
export type AgeType = '2-3' | '4-6';

export interface CrisisScript {
    say: string;
    action: string;
    audio: 'brown' | 'rain'; // Using existing AudioVault types
}

export const CRISIS_SCRIPTS: Record<SituationType, Record<LocationType, Record<AgeType, CrisisScript>>> = {
    meltdown: {
        home: {
            '2-3': {
                say: "I see you are having a hard time. I am right here. You are safe.",
                action: "Sit on the floor nearby. Do not touch unless asked.",
                audio: 'brown'
            },
            '4-6': {
                say: "I know you are angry. It is okay to be angry. I will not let you hurt anything.",
                action: "Sit nearby. Validating nod. Wait it out.",
                audio: 'brown'
            }
        },
        public: {
            '2-3': {
                say: "It is too loud here. We are going to the car/outside now.",
                action: "Scoop them up immediately. Walk calmly to exit.",
                audio: 'brown'
            },
            '4-6': {
                say: "We are having a hard moment. We need a break. Let's head to the car.",
                action: "Guide them firmly by the hand. Ignore onlookers.",
                audio: 'brown'
            }
        }
    },
    energy: {
        home: {
            '2-3': {
                say: "You have big wiggles! Let's shake them out together!",
                action: "Start jumping or shaking immediately.",
                audio: 'rain'
            },
            '4-6': {
                say: "Whoa, fast engine! Let's see how hard you can push this wall!",
                action: "Do 'heavy work' (pushing wall/floor) together.",
                audio: 'rain'
            }
        },
        public: {
            '2-3': {
                say: "Fast feet need to march! March with me!",
                action: "March like soldiers/penguins to your destination.",
                audio: 'rain'
            },
            '4-6': {
                say: "Can you help me carry this? I need your strong muscles.",
                action: "Give them a heavy bag or item to carry.",
                audio: 'rain'
            }
        }
    },
    overstimulated: {
        home: {
            '2-3': {
                say: "Too much noise. Let's make a mouse house.",
                action: "Go under a blanket/table. Whisper only.",
                audio: 'brown'
            },
            '4-6': {
                say: "Your brain needs a quiet break. Let's dim the lights.",
                action: "Turn off lights. Lie on floor together.",
                audio: 'brown'
            }
        },
        public: {
            '2-3': {
                say: "I am right here. Hiding hug.",
                action: "Bear hug to block out visual noise.",
                audio: 'brown'
            },
            '4-6': {
                say: "Close your eyes. Squeeze my hand.",
                action: "Deep hand squeezes (pulses) for regulation.",
                audio: 'brown'
            }
        }
    },
    bedtime: {
        home: {
            '2-3': {
                say: "The sun is sleeping. Your toys are sleeping. Time to rest.",
                action: "Minimize words. Rhythmic back patting.",
                audio: 'rain'
            },
            '4-6': {
                say: "Your body is tired even if your brain is busy. Let's breathe.",
                action: "Lay together. Hand on belly. Model slow breaths.",
                audio: 'rain'
            }
        },
        public: { // Rare/Travel scenario
            '2-3': {
                say: "It is late. Head on shoulder.",
                action: "Rock professionally. Hum 'Twinkle Twinkle'.",
                audio: 'rain'
            },
            '4-6': {
                say: "Lean on me. We are almost done.",
                action: "Rub back in slow, firm circles.",
                audio: 'rain'
            }
        }
    }
};
