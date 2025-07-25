// Fix : ajout de `useRef` pour stocker le timeout
import { useEffect, useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  // Fix : création d’une copie du tableau avec `[...]` pour ne pas muter les données d’origine
  // tri décroissant (du plus récent au plus ancien) avec `b - a` pour un affichage logique des événements
  const byDateDesc = [...(data?.focus || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  // Fix : création d’une référence pour le timeout (permet de l’annuler au changement d’index)
  const timeoutRef = useRef(null);
  const nextCard = () => {
    // Fix : utilisation de `setIndex(prev => ...)` pour éviter des problèmes d'images vides
    // et s’assurer que le slider boucle correctement à la fin
    setIndex((prev) => (prev + 1) % byDateDesc.length);
  };

  // Fix : useEffect nettoie le timeout précédent avant d’en recréer un (évite l’empilement de timeouts)
  //  ajout d’un guard si `byDateDesc` est vide pour éviter les erreurs
  useEffect(() => {
    if (byDateDesc.length === 0) return () => {}; // Fix : retourne une fonction vide pour éviter un crash
    timeoutRef.current = setTimeout(nextCard, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [index, byDateDesc.length]);

  // Sécurité
  if (byDateDesc.length === 0) return null; // Fix : si aucun élément dans le slider, on ne retourne rien (évite un rendu vide ou des erreurs)
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

      {/* Fix : pagination déplacée en dehors de la boucle `map()` des cartes pour éviter les duplications */}
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
