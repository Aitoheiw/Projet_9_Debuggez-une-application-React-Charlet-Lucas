import { useEffect, useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = [...(data?.focus || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const timeoutRef = useRef(null);
  const nextCard = () => {
    setIndex((prev) => (prev + 1) % byDateDesc.length);
  };

  // Auto slide avec reset du timeout si index change
  useEffect(() => {
    if (byDateDesc.length === 0) return () => {}; // <- retourne une fonction vide
    timeoutRef.current = setTimeout(nextCard, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [index, byDateDesc.length]);

  // Sécurité
  if (byDateDesc.length === 0) return null;
  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div
          key={event.id || `${event.title}-${event.date}`}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination hors de la map */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((item, radioIdx) => (
            <input
              key={`pagination-${item.id || `${item.title}-${item.date}`}`}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => setIndex(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
