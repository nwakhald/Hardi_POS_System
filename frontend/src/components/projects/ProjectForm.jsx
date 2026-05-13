import Button from "../ui/Button";

export default function ProjectForm({ form, handleChange, onSubmit, isEdit }) {
  return (
    <div className="form-container">
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-input" type="text" name="title" placeholder="House A" value={form.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Owner</label>
          <input className="form-input" type="text" name="owner" placeholder="Owner name" value={form.owner} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input className="form-input" type="text" name="location" placeholder="City / Area" value={form.location} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input className="form-input" type="text" name="phone" placeholder="07xxxxxxxx" value={form.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input className="form-input" type="date" name="start_date" value={form.start_date} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Cost</label>
          <input className="form-input" type="number" name="cost" placeholder="500" value={form.cost} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea className="form-input" name="notes" placeholder="Extra details..." rows="4" value={form.notes} onChange={handleChange}></textarea>
        </div>

        <div className="form-actions">
          <Button variant="primary" type="submit">
            {isEdit ? "Update" : "Save"}
          </Button>
          <Button variant="secondary" type="button">Cancel</Button>
        </div>
      </form>
    </div>
  );
}