import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Popup from '@/components/_ui/Popup';

interface Deck {
    id: number;
    deck_name: string;
    rating: number;
    category: string;
    description: string;
}

const AddCardPage = () => {
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [decks, setDecks] = useState<Deck[]>([]);
    const [selectedDeck, setSelectedDeck] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const response = await fetch('/api/getDecks');
                const data = await response.json();
                setDecks(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDecks();
    }, [isPopupOpen]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!front || !back || !selectedDeck) {
            setError('Please fill in all fields');
            return;
        }
        const card = { front, back, deck: selectedDeck };
        await createCard(card);
        router.push('/');
    };

    const createCard = async (card: { front: string; back: string; deck: string }) => {
        try {
            await fetch('/api/create/card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(card),
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex flex-col h-full w-full justify-center items-center gap-6">
            <h1 className="text-3xl font-bold mb-4">Add Card</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md p-6 rounded-md shadow-md" style={{backgroundColor : '#575369'}}>
                <div className="mb-4">
                    <label htmlFor="front" className="text-white">Question:</label>
                    <input
                        type="text"
                        id="front"
                        value={front}
                        onChange={(event) => setFront(event.target.value)}
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="back" className="text-white">Answer:</label>
                    <input
                        type="text"
                        id="back"
                        value={back}
                        onChange={(event) => setBack(event.target.value)}
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-md "
                    />
                </div>
                <div className="flex items-center gap-3">
                    <label htmlFor="deck" className="text-white">Deck:</label>
                    <select
                        id="deck"
                        value={selectedDeck}
                        onChange={(event) => setSelectedDeck(event.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    >
                        <option value="">Select a deck</option>
                        {decks.map((deck) => (
                            <option key={deck.id} value={deck.id}>
                                {deck.deck_name}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <p className="pt-5 flex justify-center text-purple-300">{error}</p>}

                <button type="submit" className="w-full bg-violet-950 text-white py-2 px-4 rounded-md hover:bg-violet-950/70 mt-4">
                    Save
                </button>
            </form>
            <Popup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />
        </div>

    );
};

export default AddCardPage;