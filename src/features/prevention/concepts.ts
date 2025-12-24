export interface Concept {
    id: string;
    title: string;
    description: string;
    content: string; // Markdown-like or raw text
    readTime: string;
    icon: string;
    color: string;
}

export const CONCEPTS: Concept[] = [
    {
        id: 'silence',
        title: 'The Power of Silence',
        description: 'Why saying nothing is often the strongest move.',
        content: `### The Core Idea
When a child is in chaos, their brain is overloaded. Every word you speak is just more noise to process. By staying silent, you become a "certainty anchor." You show them that you are not rattled by their storm.

### The Science
Silence lowers the sensory load. It signals safety to the amygdala. If you start explaining or negotiating, you validate the chaos. If you stay silent and present, you validate the safety.

### Try This
Next time they scream, sit on the floor. Open your arms. Close your mouth. Wait. Count to 10. Watch how the energy shifts when you refuse to add fuel to the fire.`,
        readTime: '1 min',
        icon: '🤐',
        color: 'bg-indigo-100 text-indigo-700'
    },
    {
        id: 'mirror',
        title: 'Mirror Neurons',
        description: 'Your calm becomes their calm.',
        content: `### The Core Idea
Humans are wired to mimic the emotions of those around them. This is done via "mirror neurons." If you are anxious, your child will escalate. If you are visibly, unshakeably calm, their brain will eventually sync with yours.

### The Science
Mirror neurons are the brain's WiFi. They detect micro-expressions and heart rate variability in others. A child cannot calm down if their leader (you) is dysregulated. You are the thermostat, not the thermometer. Set the temperature.

### Try This
When they are spinning out, exaggerate your own calm. Take a visibly deep breath. Drop your shoulders. Slow your blinking. They will unconsciously copy you.`,
        readTime: '2 min',
        icon: '🧠',
        color: 'bg-rose-100 text-rose-700'
    },
    {
        id: 'validation',
        title: 'Validation vs. Agreement',
        description: 'You can accept feelings without accepting behavior.',
        content: `### The Core Idea
Validation says: "I see you are angry." Agreement says: "You are right to hit your brother." We always validate the feeling. We never validate the violence.

### The Science
Naming an emotion ("Name it to tame it") reduces activity in the amygdala. When a child feels "felt," their defense mechanisms lower. Denying their feeling ("You don't need to cry about that") spikes their stress hormones.

### Try This
Say: "You are so mad that I turned off the TV. You wanted to keep watching."
(Pause)
"I know. It's hard to stop. But I will not let you hit."`,
        readTime: '2 min',
        icon: '🤝',
        color: 'bg-amber-100 text-amber-700'
    },
    {
        id: '90second',
        title: 'The 90-Second Rule',
        description: 'Emotions are chemical waves. Wait for the crash.',
        content: `### The Core Idea
Neuroscience shows that the chemical "rush" of an emotion (cortisol/adrenaline) lasts roughly 90 seconds. If you can stay calm and silent for 90 seconds, the chemical tide recedes, and the child (and you) physically calms down.

### The Science
Dr. Jill Bolte Taylor discovered that the physiological lifespan of an emotion is 90 seconds. Anything longer than that is usually because we have "re-stimulated" the emotion with our own thoughts or reactions.

### Try This
When the tantrum starts, look at your watch. Literally. Do not intervene for 90 seconds (unless they are unsafe). Just witness the wave. Notice how it changes shape after that minute and a half.`,
        readTime: '2 min',
        icon: '⏱️',
        color: 'bg-sky-100 text-sky-700'
    },
    {
        id: 'cbc',
        title: 'Connection Before Correction',
        description: 'A disconnected brain cannot learn.',
        content: `### The Core Idea
You cannot teach a drowning child to swim. You must pull them out of the water first. When a child is misbehaving, they are "drowning" in dysregulation.

### The Science
Learning happens in the prefrontal cortex. Dysregulation happens in the brainstem. You cannot access the cortex while the brainstem is firing alarms. You must "Connect" (hug, tone, eye contact) to shut off the alarm before you can "Correct" (teach the lesson).

### Try This
Before you lecture about why hitting is wrong:
1. Get down to eye level.
2. Touch their shoulder gently.
3. Say: "I love you. You are safe. But we need to fix this."`,
        readTime: '2 min',
        icon: '🔗',
        color: 'bg-emerald-100 text-emerald-700'
    },
    {
        id: 'frontal-lobe',
        title: 'The Frontal Lobe Gap',
        description: 'Why they literally cannot "think" right now.',
        content: `### The Core Idea
The Frontal Lobe (logic, reasoning, impulse control) is not fully connected to the Amygdala (emotion center) until age 25. 

### The Science
When a child is upset, their "upstairs brain" (logic) goes offline. They are operating purely from their "downstairs brain" (survival). Asking them "Why did you do that?" is asking a question to an empty room. There is nobody upstairs to answer.

### Try This
Stop asking "Why?". It implies they had a logical reason. They didn't. They had an impulse. 
Instead, ask "What?": "What happened?" or "What are you feeling?". Or better yet, tell them: "You lost control. That happens. Let's get it back."`,
        readTime: '2 min',
        icon: '🧠',
        color: 'bg-purple-100 text-purple-700'
    }
]
