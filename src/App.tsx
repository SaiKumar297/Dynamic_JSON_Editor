import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import tailwind from 'react-syntax-highlighter/dist/esm/styles/hljs/tomorrow-night';

const sampleSchema = `{
  "formTitle": "Survey Form",
  "formDescription": "Please fill out this form.",
  "fields": [
    { "id": "name", "type": "text", "label": "Name", "required": true },
    { "id": "email", "type": "email", "label": "Email", "required": true },
    { "id": "feedback", "type": "textarea", "label": "Feedback", "required": false }
  ]
}`;

function App() {
  const [jsonSchema, setJsonSchema] = useState<string>(sampleSchema);
  const [formSchema, setFormSchema] = useState<any>(JSON.parse(sampleSchema));
  const [formData, setFormData] = useState(null);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    setFormData(data);
    console.log('Form Data:', data);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonSchema(value);
    try {
      const parsed = JSON.parse(value);
      setFormSchema(parsed);
    } catch (err) {
      console.error('Invalid JSON');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-1/2 p-4 bg-gray-50 border-r">
        <h1 className="text-xl font-bold mb-4">JSON Schema Editor</h1>
        <textarea
          className="w-full h-3/4 p-2 border rounded"
          value={jsonSchema}
          onChange={handleJsonChange}
        />
        <SyntaxHighlighter language="json" style={tailwind} className="mt-4">
          {jsonSchema}
        </SyntaxHighlighter>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 p-4">
        <h1 className="text-xl font-bold">{formSchema?.formTitle}</h1>
        <p className="text-gray-600 mb-4">{formSchema?.formDescription}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formSchema?.fields?.map((field: any) => (
            <div key={field.id}>
              <label className="block mb-1 font-semibold">{field.label}</label>
              {field.type === 'text' || field.type === 'email' ? (
                <input
                  type={field.type}
                  {...register(field.id, { required: field.required })}
                  className={`w-full p-2 border rounded ${
                    errors[field.id] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              ) : field.type === 'textarea' ? (
                <textarea
                  {...register(field.id, { required: field.required })}
                  className={`w-full p-2 border rounded ${
                    errors[field.id] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              ) : null}
              {errors[field.id] && (
                <p className="text-red-500 text-sm">This field is required</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </form>

        {formData && (
          <div className="mt-4">
            <h2 className="font-bold">Submitted Data:</h2>
            <pre className="bg-gray-100 p-2 rounded">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
