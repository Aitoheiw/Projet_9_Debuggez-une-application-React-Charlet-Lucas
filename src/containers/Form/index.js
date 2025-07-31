import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);

  // fix : États des champs
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    message: "",
    type: "", // personnel / entreprise
  });

  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // fix : Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis.";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis.";
    if (!emailRegex.test(formData.email)) newErrors.email = "Email invalide.";
    if (!formData.message.trim()) newErrors.message = "Le message est requis.";
    if (!formData.type) newErrors.type = "Veuillez choisir un type.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // fix : Envoi du formulaire
  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      // fix : Validation avant envoi
      if (!validate()) return;

      setSending(true);
      try {
        await mockContactApi();
        setSending(false);
        onSuccess();
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    // fix : Ajout de FormData
    [formData, onSuccess, onError]
  );

  // fix : Changement des champs
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field
            placeholder=""
            label="Nom"
            value={formData.nom}
            onChange={(e) => handleChange("nom", e.target.value)}
            error={errors.nom}
          />
          <Field
            placeholder=""
            label="Prénom"
            value={formData.prenom}
            onChange={(e) => handleChange("prenom", e.target.value)}
            error={errors.prenom}
          />
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={(val) => handleChange("type", val)}
            value={formData.type}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
            error={errors.type}
          />
          <Field
            placeholder=""
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
          />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours..." : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            placeholder="Message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            error={errors.message}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;
