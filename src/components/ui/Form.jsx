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
          <label className="mb-1 font-medium text-gray-700">
            {field.label}
          </label>

          {field.type === "textarea" ? (
            <textarea
              {...register(field.name)}
              placeholder={field.placeholder}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          ) : (
            <input
              type={field.type}
              {...register(field.name)}
              placeholder={field.placeholder}
              className="border border-gray-300 rounded-lg p-2 w-full"
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
