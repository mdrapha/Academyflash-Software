import { useState, useEffect } from 'react';
import { VscCircleLargeFilled } from 'react-icons/vsc'
import Link from "next/link"

interface Community {
    id: number;
    community_name: string;
    description: string;
    date_creation: Date;
    user_count: number;
    card_count: number;
}

export const Group = () => {
    const [showPopup, setShowPopup] = useState(false);

    const handleButtonClick = () => {
        setShowPopup(true);
    }

    const [communities, setCommunities] = useState<Community[]>([]);

    useEffect(() => {
        fetch('/api/getCommunities')
          .then((response) => response.json())
          .then((data) => {
            setCommunities(data)
          });
      }, []);

    return (
        <>
            <section className="flex justify-between bg-green-700 text-white font-bold py-2 px-4 rounded-md dark:bg-black">
                <div>
                    <span className="font-bold text-left block">CURRENT GROUP</span>
                    <span className="bg-green-700 text-white font-bold block">Federal University of São Paulo</span>
                </div>

                <button className='bg-green-900 text-white font-bold p-2 rounded-md flex items-center justify-center' onClick={handleButtonClick}>Choose Other</button>
            
            </section>

            {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-gray-700 p-4 rounded-md justify-center">
                        <h2 className="text-lg font-bold mb-2">Choose Other Group</h2>
                        <div className="flex flex-col gap-2">
                            {communities.map((deck, index) => (
                                <Link
                                    className="hover:bg-white/10 transition duration-200 rounded-3xl w-full flex items-center justify-left gap-2 p-1 text-white"
                                    key={index}
                                    href={`/cards?deck_name=${deck.community_name}`}
                                >
                                    <VscCircleLargeFilled size={30} className={`${deck.community_name === "Personal" ? "text-red-500" : "text-green-500"}`} /> 
                                    {deck.community_name}
                                </Link>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <button className="bg-green-900 text-white font-bold p-2 rounded-md" onClick={() => setShowPopup(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
