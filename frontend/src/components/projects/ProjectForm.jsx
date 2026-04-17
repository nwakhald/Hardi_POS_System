import Button from "../ui/Button";

export default function ProjectForm() {
  return (
    <div className="form-container">
      <form className="form">
        <div className="form-group">
          <label>Title</label>
          <input className="form-input" type="text" placeholder="House A" />
        </div>

        <div className="form-group">
          <label>Owner</label>
          <input className="form-input" type="text" placeholder="Owner name" />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input className="form-input" type="text" placeholder="City / Area" />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input className="form-input" type="text" placeholder="07xxxxxxxx" />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input className="form-input" type="date" />
        </div>

        <div className="form-group">
          <label>Cost</label>
          <input className="form-input" type="number" placeholder="500" />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea className="form-input"  placeholder="Extra details..." rows="4"></textarea>
        </div>

        <div className="form-actions">
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </form>
    </div>
  );
}