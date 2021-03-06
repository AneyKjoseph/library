import React from "react";
import { useDrag, useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { ItemTypes } from "./ItemTypes";

const style = {
    cursor: "move"
};

const Card = ({ id, text, moveCard, findCard }) => {
    const originalIndex = findCard(id).index;

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.CARD, id, originalIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (dropResult, monitor) => {
            // eslint-disable-next-line no-shadow
            const { id: droppedId, originalIndex } = monitor.getItem();
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveCard(droppedId, originalIndex);
            }
        }
    });

    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        canDrop: () => false,
        hover({ id: draggedId }) {
            if (draggedId !== id) {
                const { index: overIndex } = findCard(id);
                moveCard(draggedId, overIndex);
            }
        }
    });

    const opacity = isDragging ? 0.5 : 1;

    return (
        <div ref={(node) => drag(drop(node))} style={{ ...style, opacity }}>
            {text}
        </div>
    );
};

Card.propTypes = {
    id: PropTypes.any,
    text: PropTypes.any,
    moveCard: PropTypes.any,
    findCard: PropTypes.any
};

export default Card;
