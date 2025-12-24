// Imports removed as they were unused

export interface Activity {
    id: string
    title: string
    description: string
    energy: 'high' | 'low'
    duration: 'short' | 'long' // short < 15m, long > 15m
    setup: 'none' | 'light' // none = just body, light = household items
    materials?: string[]
}

export const ACTIVITIES: Activity[] = [
    // HIGH ENERGY + SHORT (Release Valve)
    {
        id: 'wall-pushes',
        title: 'Wall Pushes',
        description: 'Maximum effort, zero destruction. Proprioceptive input to calm the nervous system.',
        energy: 'high',
        duration: 'short',
        setup: 'none'
    },
    {
        id: 'pillow-sumo',
        title: 'Pillow Sumo',
        description: 'Wrestle a pillow/cushion. Get the aggression out on a soft object.',
        energy: 'high',
        duration: 'short',
        setup: 'light',
        materials: ['Pillows', 'Couch Cushions']
    },
    {
        id: 'animal-walks',
        title: 'Heavy Animal Walks',
        description: 'Stomp like an elephant, crab walk, or bear crawl. fast regulation.',
        energy: 'high',
        duration: 'short',
        setup: 'none'
    },

    // HIGH ENERGY + LONG (Burnout)
    {
        id: 'obstacle-course',
        title: 'The "Lava" Course',
        description: 'Build a course using pillows and rugs. The floor is lava.',
        energy: 'high',
        duration: 'long',
        setup: 'light',
        materials: ['Pillows', 'Rugs', 'Chairs']
    },
    {
        id: 'dance-freeze',
        title: 'Dance Freeze',
        description: 'Play music loud. Stop it randomly. They must freeze. Teaches impulse control.',
        energy: 'high',
        duration: 'long',
        setup: 'light',
        materials: ['Music Speaker']
    },

    // LOW ENERGY + SHORT (Connection)
    {
        id: 'whats-in-bag',
        title: 'Mystery Bag',
        description: 'Put a household object in a pillowcase. They have to guess it by feel only.',
        energy: 'low',
        duration: 'short',
        setup: 'light',
        materials: ['Pillowcase', 'Spoon/Toy/Brush']
    },
    {
        id: 'mirror-mime',
        title: 'Mirror Mime',
        description: 'You move slowly, they have to copy you exactly. Then switch.',
        energy: 'low',
        duration: 'short',
        setup: 'none'
    },

    // LOW ENERGY + LONG (Focus/Flow)
    {
        id: 'ice-rescue',
        title: 'Ice Rescue',
        description: 'Freeze small toys in a bowl of water. Give them warm water/salt to "rescue" them.',
        energy: 'low',
        duration: 'long',
        setup: 'light',
        materials: ['Toys', 'Tupperware', 'Freezer']
    },
    {
        id: 'blanket-burrito',
        title: 'Blanket Burrito',
        description: 'Roll them up tight in a blanket (deep pressure). Pretend to put "toppings" (pats/squeezes) on.',
        energy: 'low',
        duration: 'long',
        setup: 'light',
        materials: ['Blanket']
    },
    {
        id: 'water-painting',
        title: 'Water Painting',
        description: 'Give them a paintbrush and a cup of water. Let them "paint" the chalkboard or pavement. Vanishes as it dries.',
        energy: 'low',
        duration: 'long',
        setup: 'light',
        materials: ['Brush', 'Water', 'Dark Surface']
    }
]
