import React from 'react'
import img from "./images/que_icon.svg"
import "./Card.css"

const Card = ({ onClick, card, index, isInactive, isFlipped, isDisabled  }) => {
    const handleClick = () => {
        !isFlipped && !isDisabled && onClick(index);
    };

    return (
        <>
            <div className={`card-container ${isInactive ? "isInActive" : ""}`}
                onClick={handleClick}
            >
                <div className={`card ${isFlipped ? "isFlip" : ""}`}>
                    <div className="front">
                        <img src={img} alt="icon" />
                    </div>
                    <div className="back">
                        <img src={card.image} alt="card-img" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card