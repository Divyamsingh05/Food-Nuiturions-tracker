import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search foods…" }) {
  return (
    <div className="input-group">
      <Search size={16} className="input-icon" />
      <input
        className="input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            position: "absolute", right: 12,
            background: "none", border: "none",
            color: "var(--text-muted)", cursor: "pointer",
            display: "flex", alignItems: "center",
          }}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
