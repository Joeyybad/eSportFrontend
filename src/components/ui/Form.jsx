import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";

function Form({
  title,
  fields,
  onSubmit,
  submitLabel,
  resolver,
  defaultValues,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver, defaultValues });

  // Synchronisation valeurs initiales dès qu'elles changent
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  // Style commun pour tous les champs (Input, Select, Textarea)
  const inputClass =
    "w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      // J'ai retiré 'bg-white shadow-md' pour que ça se fonde dans la Card parente
      className="w-full max-w-lg mx-auto flex flex-col gap-5"
    >
      {title && (
        <h2 className="text-2xl font-black italic text-white mb-4 uppercase tracking-wide">
          {title}
        </h2>
      )}

      {fields.map((field) => (
        <div key={field.name} className="flex flex-col group">
          <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-purple-400 transition-colors">
            {field.label}
          </label>

          {/* gestion de plusieurs types de champs */}
          {field.type === "textarea" ? (
            <textarea
              {...register(field.name)}
              className={`${inputClass} min-h-[120px] resize-y`}
              placeholder={field.placeholder}
            />
          ) : field.type === "select" ? (
            <select {...register(field.name)} className={inputClass}>
              <option value="">-- Sélectionner --</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              step={field.step}
              placeholder={field.placeholder}
              {...register(field.name)}
              className={inputClass}
            />
          )}

          {errors[field.name] && (
            <p className="text-red-400 text-sm mt-1 font-medium flex items-center gap-1">
              ⚠ {errors[field.name].message}
            </p>
          )}
        </div>
      ))}

      <div className="mt-4">
        <Button
          text={submitLabel || "Envoyer"}
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)] transition-all transform hover:-translate-y-0.5"
        />
      </div>
    </form>
  );
}

export default Form;
