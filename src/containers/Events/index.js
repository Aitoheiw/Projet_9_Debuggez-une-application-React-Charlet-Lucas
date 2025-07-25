import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  // Fix : initialisation explicite de `type` à `null` au lieu de `undefined` (plus clair pour tester avec `!type`)
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fix : séparation logique du filtrage par catégorie dans une variable `filtered`
  // au lieu de mélanger filtrage et pagination (plus lisible, plus maintenable)
  const filtered = (data?.events || []).filter((event) =>
    !type ? true : event.type === type
  );

  // Fix : pagination séparée dans `paginatedEvents` avec calcul clair des bornes (start/end)
  // plus lisible et réutilisable
  const paginatedEvents = filtered.filter((_, index) => {
    const start = (currentPage - 1) * PER_PAGE;
    const end = currentPage * PER_PAGE;
    return index >= start && index < end;
  });

  // Fix : calcul de `pageNumber` corrigé avec `Math.ceil` au lieu de `Math.floor + 1`
  // évite de générer une page vide inutile à la fin
  const pageNumber = Math.ceil(filtered.length / PER_PAGE);

  const typeList = new Set(data?.events.map((event) => event.type));

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  return (
    <>
      {/* Fix : message d’erreur en français et plus explicite */}
      {error && <div>Une erreur est survenue</div>}
      {/* Fix : message de chargement en français + plus agréable visuellement */}
      {data === null ? (
        "Chargement..."
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>

          <Select
            selection={Array.from(typeList)}
            // Fix : simplification de la logique de changement : si pas de valeur, on passe `null`
            onChange={(value) => changeType(value || null)}
          />

          <div id="events" className="ListContainer">
            {/* Fix : utilisation de `paginatedEvents` pour afficher uniquement les éléments paginés */}
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>

          <div className="Pagination">
            {/* Fix : suppression de `|| 0` inutile, `pageNumber` vaut déjà 0 si besoin
                évite d'ajouter une page 1 vide quand pas d’events */}
            {[...Array(pageNumber)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
