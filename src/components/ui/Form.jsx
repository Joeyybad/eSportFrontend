import React from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";

function Form({ title, fields, onSubmit, submitLabel, resolver }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg mx-auto flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md"
    >
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="font-medium mb-1">{field.label}</label>

          {/* gestion de plusieurs types de champs */}
          {field.type === "textarea" ? (
            <textarea
              {...register(field.name)}
              className="border p-2 rounded"
            />
          ) : field.type === "select" ? (
            <select {...register(field.name)} className="border p-2 rounded">
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
              {...register(field.name)}
              className="border p-2 rounded"
            />
          )}

          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[field.name].message}
            </p>
          )}
        </div>
      ))}

      <Button
        text={submitLabel || "Envoyer"}
        type="submit"
        color="#A855F7" // violet Tailwind (équivaut à bg-purple-600)
        className="py-2 px-4 hover:bg-purple-700 transition"
        style={{ color: "white" }} // texte blanc
      />
    </form>
  );
}

export default Form;
