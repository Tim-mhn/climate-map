import { useState } from "react";

export const useForm = initialValues => {
    /**
     * Set value of form whenever one field is updated using useState hook
     */
  const [values, setValues] = useState(initialValues);

  return [
    values,
    e => {
      setValues({
        ...values,
        [e.target.name]: e.target.checked ? e.target.checked : e.target.value
      });
    }
  ];
};