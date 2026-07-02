import { useState, useCallback } from 'react';

export function useForm(initialValues, validate) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        if (validate) {
            const validationErrors = validate(values);
            setErrors((prev) => ({ ...prev, [name]: validationErrors[name] || '' }));
        }
    }, [validate, values]);

    const handleSubmit = useCallback((onSubmit) => async (e) => {
        e.preventDefault();
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
            const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
            setTouched(allTouched);
            if (Object.values(validationErrors).some(Boolean)) return;
        }
        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } finally {
            setIsSubmitting(false);
        }
    }, [validate, values]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    return { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset, setValues };
}