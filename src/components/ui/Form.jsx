import React from "react";

const Form = ({ title, fields, onSubmit, submitLabel = "Valider" }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md mx-auto space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">{title}</h2>

      {fields.map((field, index) => (
        <div key={index} className="flex flex-col">
          <label
            htmlFor={field.name}
            className="text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type || "text"}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required={field.required}
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-purple-600 text-black py-2 rounded-xl hover:bg-purple-700 transition"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default Form;
