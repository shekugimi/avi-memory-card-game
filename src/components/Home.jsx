import React, { useState, useEffect, useRef } from 'react'
import Card from "./Card"
import "./Home.css"

const images = [
    {
        type: "1",
        image: require(`./images/img-1.png`)
    },
    {
        type: "2",
        image: require(`./images/img-2.png`)
    },
    {
        type: "3",
        image: require(`./images/img-3.png`)
    },
    {
        type: "4",
        image: require(`./images/img-4.png`)
    },
    {
        type: "5",
        image: require(`./images/img-5.png`)
    },
    {
        type: "6",
        image: require(`./images/img-6.png`)
    },
    {
        type: "1",
        image: require(`./images/img-1.png`)
    },
    {
        type: "2",
        image: require(`./images/img-2.png`)
    },
    {
        type: "3",
        image: require(`./images/img-3.png`)
    },
    {
        type: "4",
        image: require(`./images/img-4.png`)
    },
    {
        type: "5",
        image: require(`./images/img-5.png`)
    },
    {
        type: "6",
        image: require(`./images/img-6.png`)
    },
];

function shuffleImages(arr) {
    const length = arr.length;
    for (let i = length; i > 0; i--) {
        const randomIdx = Math.floor(Math.random() * i);
        const currIdx = i - 1;

        const temp = arr[currIdx];
        arr[currIdx] = arr[randomIdx];
        arr[randomIdx] = temp;
    }
    return arr;
}

const Home = () => {

    const [cards, setCards] = useState(() => shuffleImages(images));
    const [openCards, setOpenCards] = useState([]);
    const [clearedCards, setClearedCards] = useState({});
    const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
    const [moves, setMoves] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [bestScore, setBestScore] = useState(
        JSON.parse(localStorage.getItem("bestScore")) || Number.POSITIVE_INFINITY
    );

    const timeout = useRef(null);

    const disable = () => {
        setShouldDisableAllCards(true);
    }
    const enable = () => {
        setShouldDisableAllCards(false);
    }

    const checkCompletion = () => {
        // console.log("Check completion called");
        if (Object.keys(clearedCards).length === images.length / 2) {
            setShowModal(true);
            const highScore = Math.min(moves, bestScore);
            setBestScore(highScore);
            localStorage.setItem("bestScore", highScore);
        }
    };

    const evaluate = () => {
        const [first, second] = openCards;
        enable();
        if (cards[first].type === cards[second].type) {
            setClearedCards((prev) => ({ ...prev, [cards[first].type]: true }));
            setOpenCards([]);
            return;
        }
        // This is to flip the cards back after 500ms duration
        timeout.current = setTimeout(() => {
            setOpenCards([]);
        }, 350);
    };

    const handleCardClick = (index) => {
        if (openCards.length === 1) {
            setOpenCards((prev) => [...prev, index]);
            setMoves((moves) => moves + 1);
            disable();
        } else {
            clearTimeout(timeout.current);
            setOpenCards([index]);
        }
    };

    useEffect(() => {
        let timeout = null;
        if (openCards.length === 2) {
            timeout = setTimeout(evaluate, 300);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [openCards]);

    useEffect(() => {
        checkCompletion();
    }, [clearedCards]);

    const checkIsFlipped = (index) => {
        return openCards.includes(index);
    };

    const checkIsInactive = (card) => {
        return Boolean(clearedCards[card.type]);
    };

    const handleRestart = () => {
        setClearedCards({});
        setOpenCards([]);
        setShowModal(false);
        setMoves(0);
        setShouldDisableAllCards(false);
        setCards(shuffleImages(images));
    };


    return (
        <div className="container">

            <div className="card-wrapper">
                <div className={`win ${!showModal ? "hide" : ""}`}>
                    <h2>Hurray! You Won in {moves} flips.</h2>
                </div>
                {cards.map((card, index) => {
                    return (
                        <Card
                            key={index}
                            card={card}
                            index={index}
                            isDisabled={shouldDisableAllCards}
                            isInactive={checkIsInactive(card)}
                            isFlipped={checkIsFlipped(index)}
                            onClick={handleCardClick}
                        />
                    );
                })}
                <div className="footer">
                    {
                        localStorage.getItem("bestScore") && (
                            <div className="best-score">
                                <p>Best Score: <span>{bestScore}</span></p>
                            </div>
                        )
                    }
                    <div className="cnt-flip">
                        <p>Flip: <span>{moves}</span></p>
                    </div>
                    <button onClick={handleRestart}>Restart</button>
                </div>
            </div>
        </div>
    )
}

export default Home