import { useState } from 'react';

function CourseForm({ initialData, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [instructor, setInstructor] = useState(initialData?.instructor || '');
  const [schedule, setSchedule] = useState(initialData?.schedule || '');
  const [capacity, setCapacity] = useState(initialData?.capacity || 30);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        instructor,
        schedule,
        capacity: parseInt(capacity, 10),
      });
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const first = Object.entries(data)[0];
        setError(`${first[0]}: ${first[1]}`);
      } else {
        setError('Could not save course.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">
          {initialData ? 'Edit Course' : 'New Course'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="Title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
            />
          </Field>

          <Field label="Instructor">
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
            />
          </Field>

          <Field label="Schedule">
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="e.g., Mon/Wed 10-11 AM"
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
            />
          </Field>

          <Field label="Capacity">
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              min={1}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
            />
          </Field>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded font-semibold"
            >
              {submitting ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block mb-1 text-sm text-gray-300">{label}</label>
      {children}
    </div>
  );
}

export default CourseForm;