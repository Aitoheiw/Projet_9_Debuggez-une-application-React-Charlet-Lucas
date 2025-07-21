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
  const [type, setType] = useState(); // type sélectionné (catégorie)
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = (data?.events || []).filter((event) =>
    !type ? true : event.type === type
  );

  const paginatedEvents = filtered.filter((_, index) => {
    const start = (currentPage - 1) * PER_PAGE;
    const end = currentPage * PER_PAGE;
    return index >= start && index < end;
  });

  const pageNumber = Math.ceil(filtered.length / PER_PAGE);

  const typeList = new Set(data?.events.map((event) => event.type));

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  return (
    <>
      {error && <div>Une erreur est survenue</div>}
      {data === null ? (
        "Chargement..."
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>

          <Select
            selection={Array.from(typeList)}
            onChange={(value) => changeType(value || null)}
          />

          <div id="events" className="ListContainer">
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
