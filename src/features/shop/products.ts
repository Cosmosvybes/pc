import { Calendar, Headphones, BookOpen } from 'lucide-react';

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    priceId: string; // Paddle Price ID
    icon: any;
    color: string;
    comingSoon?: boolean;
}

export const DIGITAL_PRODUCTS: Product[] = [
    {
        id: 'script-book',
        title: 'The Script Book',
        description: 'Every script from the app + 50 bonus scenarios (Lying, Hitting, Sibling Rivalry) in a searchable PDF.',
        price: 12,
        priceId: 'pri_script_book_placeholder', // REPLACE
        icon: BookOpen,
        color: 'bg-rose-100 text-rose-600'
    },
    {
        id: 'visual-schedules',
        title: 'Visual Schedule Pack',
        description: 'Printable PDF cards for Morning, Bedtime, and "After School" routines. Ends the power struggles.',
        price: 5,
        priceId: 'pri_visual_schedule_placeholder', // REPLACE
        icon: Calendar,
        color: 'bg-emerald-100 text-emerald-600',
        comingSoon: true
    },
    {
        id: 'audio-pack',
        title: 'Deep Regulation Audio',
        description: '60-minute high-fidelity WAV files of Brown Noise, Green Noise, and Womb Sounds. For sleep & focus.',
        price: 9,
        priceId: 'pri_audio_pack_placeholder', // REPLACE
        icon: Headphones,
        color: 'bg-indigo-100 text-indigo-600',
        comingSoon: true
    }
];
