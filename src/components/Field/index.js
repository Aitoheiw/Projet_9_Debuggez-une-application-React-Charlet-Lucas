import PropTypes from "prop-types";
import "./style.scss";

export const FIELD_TYPES = {
  INPUT_TEXT: 1,
  TEXTAREA: 2,
};

// Fix : Ajout des props value, onChange, error

const Field = ({
  type = FIELD_TYPES.INPUT_TEXT,
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
}) => {
  let component;

  switch (type) {
    case FIELD_TYPES.INPUT_TEXT:
      component = (
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          // fix : onChange est maintenant une prop
          onChange={onChange}
          data-testid="field-testid"
        />
      );
      break;
    case FIELD_TYPES.TEXTAREA:
      component = (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          // fix : onChange est maintenant une prop
          onChange={onChange}
          data-testid="field-testid"
        />
      );
      break;
    default:
      component = (
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          // fix : onChange est maintenant une prop
          onChange={onChange}
          data-testid="field-testid"
        />
      );
  }

  return (
    <div className="inputField">
      <span>{label}</span>
      {component}
      {/* Fix : Affichage de l'erreur si elle existe */}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

Field.propTypes = {
  type: PropTypes.oneOf(Object.values(FIELD_TYPES)),
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  // Fix : Ajout des types pour les props value, onChange, error
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
};

Field.defaultProps = {
  label: "",
  placeholder: "",
  type: FIELD_TYPES.INPUT_TEXT,
  name: "field-name",
  // Fix : Valeurs par défaut pour value, onChange, error
  value: "",
  onChange: () => {},
  error: null,
};

export default Field;
